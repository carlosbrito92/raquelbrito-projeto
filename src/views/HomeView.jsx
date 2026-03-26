import React from 'react';
import { Dumbbell, Users } from 'lucide-react';

export default function HomeView({ nav }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6 bg-gray-50 dark:bg-gray-900">
      
      {/* Título Principal */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">PT Periodização</h1>
        <p className="text-gray-500 dark:text-gray-400">Gestão inteligente de treinos</p>
      </div>
      
      {/* Botão de Acesso do Personal */}
      <button 
        onClick={() => nav('TrainerHome')}
        className="w-full max-w-xs flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-medium shadow-sm transition-colors"
      >
        <Users size={24} />
        Acesso do Personal
      </button>

      {/* Botão de Acesso do Aluno */}
      <button 
        onClick={() => nav('StudentSelect')}
        className="w-full max-w-xs flex items-center justify-center gap-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 p-4 rounded-xl font-medium shadow-sm transition-colors"
      >
        <Dumbbell size={24} />
        Acesso do Aluno
      </button>

    </div>
  );
}
