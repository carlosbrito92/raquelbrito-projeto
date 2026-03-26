import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { storage } from '../lib/storage';
import { getExpected } from '../lib/progression';

export default function StudentPortal({ nav, student }) {
  // Estados para navegação interna do aluno
  const [activeBlock, setActiveBlock] = useState('A');
  const [activeWeek, setActiveWeek] = useState(1); // Obstáculo H4: Seleção manual da semana
  
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  // Busca o plano montado pelo PT no Firebase
  useEffect(() => {
    async function loadPlan() {
      if (!student) return;
      const data = await storage.get(`plan_${student.id}`);
      setPlan(data || { blocks: { A: [], B: [], C: [] } });
      setLoading(false);
    }
    loadPlan();
  }, [student]);

  // Atualiza a carga real registrada pelo aluno e salva otimisticamente
  const handleRecordLoad = async (exerciseId, loadValue) => {
    const value = parseFloat(loadValue);
    
    // Mapeia os exercícios do bloco atual para atualizar apenas o correto
    const updatedBlocks = plan.blocks[activeBlock].map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          actualLoads: {
            ...ex.actualLoads,
            [activeWeek]: isNaN(value) ? '' : value // Salva o valor ou limpa se apagar
          }
        };
      }
      return ex;
    });

    const updatedPlan = {
      ...plan,
      blocks: {
        ...plan.blocks,
        [activeBlock]: updatedBlocks
      }
    };

    // Padrão de Persistência Assíncrona Otimista
    setPlan(updatedPlan);
    await storage.set(`plan_${student.id}`, updatedPlan);
  };

  // Função auxiliar para definir a cor do card baseada na regra de negócio
  const getCardStyle = (actual, expected) => {
    if (actual === undefined || actual === '' || actual === null) {
      return 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'; // Cinza padrão (sem registro)
    }
    if (actual >= expected) {
      return 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'; // Verde (meta batida)
    }
    return 'border-orange-300 bg-orange-50 dark:bg-orange-900/20'; // Laranja (abaixo da meta)
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Carregando seu treino...</div>;

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
          <h1 className="text-xl font-bold leading-tight">Olá, {student.name.split(' ')[0]}!</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Objetivo: {student.objective}</p>
        </div>
      </header>

      {/* Seleção de Semana (1 a 4) */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Qual semana você está?</h2>
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
              S{week} {week === 4 && <span className="block text-[10px] font-normal opacity-75">De-load</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Navegação por Abas de Treino (Blocos A, B, C) */}
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

      {/* Lista de Exercícios para Registro */}
      <div className="flex flex-col gap-3">
        {plan.blocks[activeBlock].length === 0 ? (
          <p className="text-center text-gray-500 py-10">Seu PT ainda não montou este treino.</p>
        ) : (
          plan.blocks[activeBlock].map(exercise => {
            // Calcula a meta usando a nossa regra de negócio TDD
            const expectedLoad = getExpected(exercise.week1Load, student.progressionRate, activeWeek);
            // Pega o valor real que o aluno já digitou (se houver)
            const actualLoad = exercise.actualLoads?.[activeWeek];
            // Define o estilo dinâmico
            const cardStyle = getCardStyle(actualLoad, expectedLoad);

            return (
              <div key={exercise.id} className={`p-4 rounded-xl border-2 transition-colors ${cardStyle}`}>
                
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{exercise.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {exercise.series} séries × {exercise.reps} reps • Pausa: {exercise.interval}s
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50">
                  
                  {/* Exibição da Meta (Esperado) */}
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Meta calculada:</p>
                    <div className="flex items-center gap-1 font-bold text-gray-700 dark:text-gray-300">
                      <span className="text-lg">{expectedLoad}</span> kg
                    </div>
                  </div>

                  {/* Input de Registro (Real) */}
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Carga real:</p>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        step="0.5"
                        placeholder="0.0"
                        value={actualLoad !== undefined ? actualLoad : ''}
                        onChange={(e) => handleRecordLoad(exercise.id, e.target.value)}
                        className="w-20 p-2 text-right font-bold bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="font-bold text-gray-700 dark:text-gray-300">kg</span>
                    </div>
                  </div>

                </div>

                {/* Mensagem de Feedback Rápido */}
                {actualLoad !== undefined && actualLoad !== '' && (
                  <div className="mt-3 text-xs font-medium flex items-center justify-end gap-1">
                    {actualLoad >= expectedLoad ? (
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
