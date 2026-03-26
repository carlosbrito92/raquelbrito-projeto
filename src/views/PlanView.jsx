import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Save } from 'lucide-react';
import ExCard from '../components/ExCard';
import { storage } from '../lib/storage';

// Estrutura inicial vazia baseada no Modelo de Dados (ProjetoRaquel.md)
const INITIAL_PLAN = {
  blocks: {
    A: [],
    B: [],
    C: []
  }
};

export default function PlanView({ nav, student }) {
  // Estado para controlar qual aba (Bloco) está ativa
  const [activeBlock, setActiveBlock] = useState('A');
  
  // Estado para armazenar o plano de treino do aluno
  const [plan, setPlan] = useState(INITIAL_PLAN);
  const [loading, setLoading] = useState(true);

  // Busca o plano específico deste aluno no Firebase ao montar a tela
  useEffect(() => {
    async function loadPlan() {
      if (!student) return;
      const data = await storage.get(`plan_${student.id}`);
      if (data) {
        setPlan(data);
      }
      setLoading(false);
    }
    loadPlan();
  }, [student]);

  // Função para salvar o plano no banco (Persistência Otimista)
  const savePlanToDb = async (updatedPlan) => {
    setPlan(updatedPlan); // Atualiza a UI imediatamente
    await storage.set(`plan_${student.id}`, updatedPlan); // Salva em background
  };

  // Adiciona um exercício vazio/padrão ao bloco ativo
  const handleAddExercise = () => {
    const newExercise = {
      id: Math.random().toString(36).substring(2, 8), // uid() simples
      name: 'Novo Exercício',
      series: 3,
      reps: 10,
      interval: 60,
      week1Load: 10, // Carga base inicial
      actualLoads: {} // Aqui o aluno registrará depois: { 1: 10, 2: 12, ... }
    };

    const updatedPlan = {
      ...plan,
      blocks: {
        ...plan.blocks,
        [activeBlock]: [...plan.blocks[activeBlock], newExercise]
      }
    };

    savePlanToDb(updatedPlan);
  };

  // Recebe o exercício atualizado do ExCard (via onUpdate) e substitui no array
  const handleUpdateExercise = (updatedExercise) => {
    const updatedBlocks = plan.blocks[activeBlock].map(ex => 
      ex.id === updatedExercise.id ? updatedExercise : ex
    );

    const updatedPlan = {
      ...plan,
      blocks: {
        ...plan.blocks,
        [activeBlock]: updatedBlocks
      }
    };

    savePlanToDb(updatedPlan);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Carregando plano...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      {/* Cabeçalho */}
      <header className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => nav('TrainerHome')}
          className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold leading-tight">Plano de Treino</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{student?.name}</p>
        </div>
      </header>

      {/* Navegação por Abas (Blocos A, B, C) */}
      <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-lg mb-6">
        {['A', 'B', 'C'].map(block => (
          <button
            key={block}
            onClick={() => setActiveBlock(block)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              activeBlock === block 
                ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-white' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Treino {block}
          </button>
        ))}
      </div>

      {/* Lista de Exercícios do Bloco Ativo usando o ExCard */}
      <div className="flex flex-col gap-4">
        {plan.blocks[activeBlock].length === 0 ? (
          <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhum exercício no Treino {activeBlock}.</p>
          </div>
        ) : (
          plan.blocks[activeBlock].map(exercise => (
            <ExCard 
              key={exercise.id} 
              exercise={exercise} 
              onUpdate={handleUpdateExercise} 
            />
          ))
        )}

        {/* Botão de Adicionar Exercício */}
        <button 
          onClick={handleAddExercise}
          className="mt-2 flex items-center justify-center gap-2 w-full p-4 rounded-xl border-2 border-dashed border-blue-200 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium transition-colors"
        >
          <Plus size={20} />
          Adicionar Exercício
        </button>
      </div>
    </div>
  );
}
