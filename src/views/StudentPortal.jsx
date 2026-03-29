import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { storage } from '../lib/storage';
import { getExpected } from '../lib/progression';

// Exercícios sem carga não têm progressão — exibem valor de referência fixo
const isWeighted = (exercise) => (exercise.exerciseType || 'weighted') === 'weighted';

const getGoal = (exercise, progressionRate, week) => {
  if (isWeighted(exercise)) {
    return { value: getExpected(exercise.week1Load, progressionRate, week), unit: 'kg' };
  }
  return { value: exercise.week1Load || '—', unit: exercise.unit || 'rep' };
};

export default function StudentPortal({ nav, student }) {
  const [activeBlock, setActiveBlock] = useState('A');
  const [activeWeek, setActiveWeek] = useState(1);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlan() {
      if (!student) return;
      const data = await storage.get(`plan_${student.id}`);
      setPlan(data || { blocks: { A: [], B: [], C: [] } });
      setLoading(false);
    }
    loadPlan();
  }, [student]);

  const handleRecordLoad = async (exerciseId, loadValue) => {
    const value = parseFloat(loadValue);
    const updatedBlocks = plan.blocks[activeBlock].map(ex => {
      if (ex.id !== exerciseId) return ex;
      return {
        ...ex,
        actualLoads: {
          ...ex.actualLoads,
          [activeWeek]: isNaN(value) ? '' : value
        }
      };
    });

    const updatedPlan = {
      ...plan,
      blocks: { ...plan.blocks, [activeBlock]: updatedBlocks }
    };

    setPlan(updatedPlan);
    await storage.set(`plan_${student.id}`, updatedPlan);
  };

  const getCardStyle = (actual, expected, weighted) => {
    if (!weighted) return 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20';
    if (actual === undefined || actual === '' || actual === null)
      return 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800';
    if (actual >= expected)
      return 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20';
    return 'border-orange-300 bg-orange-50 dark:bg-orange-900/20';
  };

  if (loading) return (
    <div className="p-8 text-center text-gray-500">Carregando seu treino...</div>
  );

  return (
    <div className="max-w-md mx-auto p-4 pb-20">

      {/* Cabeçalho */}
      <header className="flex items-center gap-4 mb-6">
        <button
          onClick={() => nav('StudentSelect')}
          className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold leading-tight">
            Olá, {student.name.split(' ')[0]}!
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Objetivo: {student.objective}
          </p>
        </div>
      </header>

      {/* Seleção de Semana */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Qual semana você está?
        </h2>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(week => (
            <button
              key={week}
              onClick={() => setActiveWeek(week)}
              className={`flex-1 py-2 rounded-lg font-bold text-sm border-2 transition-all ${
                activeWeek === week
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-blue-300'
              }`}
            >
              S{week}
              {week === 4 && (
                <span className="block text-[10px] font-normal opacity-75">De-load</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Abas de Bloco */}
      <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-lg mb-4">
        {['A', 'B', 'C'].map(block => (
          <button
            key={block}
            onClick={() => setActiveBlock(block)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              activeBlock === block
                ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-white'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Treino {block}
          </button>
        ))}
      </div>

      {/* Lista de Exercícios */}
      <div className="flex flex-col gap-3">
        {plan.blocks[activeBlock].length === 0 ? (
          <p className="text-center text-gray-500 py-10">
            Seu PT ainda não montou este treino.
          </p>
        ) : (
          plan.blocks[activeBlock].map(exercise => {
            const weighted = isWeighted(exercise);
            const goal = getGoal(exercise, student.progressionRate, activeWeek);
            const actualLoad = exercise.actualLoads?.[activeWeek];
            const cardStyle = getCardStyle(actualLoad, goal.value, weighted);

            return (
              <div
                key={exercise.id}
                className={`p-4 rounded-xl border-2 transition-colors ${cardStyle}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {exercise.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {exercise.series} séries × {exercise.reps} reps • Pausa: {exercise.interval}s
                    </p>
                    {!weighted && (
                      <span className="inline-block mt-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                        {exercise.exerciseType === 'cardio' ? '🏃 Cardio' : '💪 Corporal'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50">

                  {/* Meta */}
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {weighted ? 'Meta calculada:' : 'Referência:'}
                    </p>
                    <div className="flex items-center gap-1 font-bold text-gray-700 dark:text-gray-300">
                      <span className="text-lg">{goal.value}</span>
                      <span className="text-sm">{goal.unit}</span>
                    </div>
                  </div>

                  {/* Registro real */}
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Executei:
                    </p>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step={weighted ? '0.5' : '1'}
                        placeholder="0"
                        value={actualLoad !== undefined ? actualLoad : ''}
                        onChange={(e) => handleRecordLoad(exercise.id, e.target.value)}
                        className="w-20 p-2 text-right font-bold bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="font-bold text-gray-700 dark:text-gray-300">
                        {goal.unit}
                      </span>
                    </div>
                  </div>

                </div>

                {/* Feedback — só para exercícios com carga */}
                {weighted && actualLoad !== undefined && actualLoad !== '' && (
                  <div className="mt-3 text-xs font-medium flex items-center justify-end gap-1">
                    {actualLoad >= goal.value ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={14} /> Meta alcançada!
                      </span>
                    ) : (
                      <span className="text-orange-600 dark:text-orange-400 flex items-center gap-1">
                        <AlertCircle size={14} /> Abaixo da meta
                      </span>
                    )}
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}