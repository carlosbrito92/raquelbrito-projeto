import React, { useState } from 'react';
import { ArrowLeft, Save, TrendingUp } from 'lucide-react';
import { getExpected } from '../lib/progression';

export default function AddStudent({ nav, onAdd }) {
  const [name, setName] = useState('');
  const [objective, setObjective] = useState('');
  const [rate, setRate] = useState(10); // Padrão 10%

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !objective) return;

    const newStudent = {
      id: Math.random().toString(36).substring(2, 8), // uid() temporário mockado
      name,
      objective,
      progressionRate: Number(rate),
      createdAt: new Date().toISOString()
    };

    onAdd(newStudent);
    nav('TrainerHome');
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <header className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => nav('TrainerHome')}
          className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Novo Aluno</h1>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo</label>
          <input 
            type="text" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ex: Carlos Santos"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Objetivo</label>
          <input 
            type="text" 
            required
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ex: Hipertrofia, Força..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Taxa de Progressão Semanal: <span className="font-bold text-blue-600">{rate}%</span>
          </label>
          <input 
            type="range" 
            min="5" 
            max="25" 
            step="1"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mt-2"
          />
        </div>

        {/* Prévia de Progressão usando a função TDD */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-3 text-blue-800 dark:text-blue-300">
            <TrendingUp size={16} />
            Prévia (Base Exemplo: 100kg)
          </h3>
          <div className="flex justify-between text-sm text-center">
            <div>
              <p className="text-gray-500 dark:text-gray-400">S1</p>
              <p className="font-bold">{getExpected(100, rate, 1)}kg</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">S2</p>
              <p className="font-bold">{getExpected(100, rate, 2)}kg</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">S3</p>
              <p className="font-bold">{getExpected(100, rate, 3)}kg</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">S4 <span className="text-xs text-orange-500">(De-load)</span></p>
              <p className="font-bold">{getExpected(100, rate, 4)}kg</p>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          className="mt-4 flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-medium transition-colors"
        >
          <Save size={20} />
          Salvar Aluno
        </button>
      </form>
    </div>
  );
}
