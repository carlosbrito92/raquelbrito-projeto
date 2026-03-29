import React, { useState } from 'react';
import { ArrowLeft, Save, TrendingUp, Lock } from 'lucide-react';
import { getExpected } from '../lib/progression';

export default function AddStudent({ nav, onAdd }) {
  const [name, setName] = useState('');
  const [objective, setObjective] = useState('');
  const [rate, setRate] = useState(10);
  const [pin, setPin] = useState('');

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !objective || pin.length !== 4) return;

    const newStudent = {
      id: Math.random().toString(36).substring(2, 8),
      name,
      objective,
      progressionRate: Number(rate),
      pin,
      createdAt: new Date().toISOString()
    };

    onAdd(newStudent);
    nav('TrainerHome');
  };

  const inputClass = "w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none";

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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nome Completo
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Ex: Carlos Santos"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Objetivo
          </label>
          <input
            type="text"
            required
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className={inputClass}
            placeholder="Ex: Hipertrofia, Força..."
          />
        </div>

        {/* PIN de acesso */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
            <Lock size={14} />
            PIN do Aluno (4 dígitos)
          </label>
          <input
            type="password"
            inputMode="numeric"
            required
            value={pin}
            onChange={handlePinChange}
            className={inputClass}
            placeholder="Ex: 1234"
            maxLength={4}
          />
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Passe este PIN para o aluno pelo WhatsApp. Ele será solicitado no acesso.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Taxa de Progressão Semanal:{' '}
            <span className="font-bold text-blue-600">{rate}%</span>
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

        {/* Prévia de Progressão */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-3 text-blue-800 dark:text-blue-300">
            <TrendingUp size={16} />
            Prévia (Base Exemplo: 100kg)
          </h3>
          <div className="flex justify-between text-sm text-center">
            {[1, 2, 3, 4].map(week => (
              <div key={week}>
                <p className="text-gray-500 dark:text-gray-400">
                  S{week}{week === 4 && <span className="text-xs text-orange-500"> (De-load)</span>}
                </p>
                <p className="font-bold">{getExpected(100, rate, week)}kg</p>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={pin.length !== 4}
          className={`mt-4 flex justify-center items-center gap-2 p-3 rounded-xl font-medium transition-colors ${
            pin.length === 4
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Save size={20} />
          Salvar Aluno
        </button>

      </form>
    </div>
  );
}