import React, { useState } from 'react';
import { ArrowLeft, UserCircle, Lock, X } from 'lucide-react';

export default function StudentSelect({ nav, students }) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setPin('');
    setError(false);
  };

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(value);
    setError(false);
  };

  const handleConfirm = () => {
    if (pin === selectedStudent.pin) {
      nav('StudentPortal', selectedStudent);
    } else {
      setError(true);
      setPin('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && pin.length === 4) handleConfirm();
  };

  const handleBack = () => {
    setSelectedStudent(null);
    setPin('');
    setError(false);
  };

  return (
    <div className="max-w-md mx-auto p-4">

      <header className="flex items-center gap-4 mb-6">
        <button
          onClick={selectedStudent ? handleBack : () => nav('HomeView')}
          className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {selectedStudent ? `Olá, ${selectedStudent.name.split(' ')[0]}!` : 'Quem é você?'}
        </h1>
      </header>

      {/* Etapa 1 — Seleção de nome */}
      {!selectedStudent && (
        <main className="flex flex-col gap-3">
          {students.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">
              Nenhum aluno cadastrado ainda.
            </p>
          ) : (
            students.map(student => (
              <button
                key={student.id}
                onClick={() => handleSelectStudent(student)}
                className="w-full bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition-shadow text-left"
              >
                <UserCircle size={40} className="text-blue-200 dark:text-blue-900 flex-shrink-0" />
                <div>
                  <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {student.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Objetivo: {student.objective}
                  </p>
                </div>
              </button>
            ))
          )}
        </main>
      )}

      {/* Etapa 2 — PIN */}
      {selectedStudent && (
        <div className="flex flex-col gap-4">

          {/* Card do aluno selecionado */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-4">
            <UserCircle size={44} className="text-blue-300 dark:text-blue-800 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white truncate">
                {selectedStudent.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedStudent.objective}
              </p>
            </div>
            <button
              onClick={handleBack}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full"
              title="Trocar aluno"
            >
              <X size={18} />
            </button>
          </div>

          {/* Input de PIN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
              <Lock size={14} />
              Digite seu PIN de acesso
            </label>
            <input
              type="password"
              inputMode="numeric"
              autoFocus
              maxLength={4}
              value={pin}
              onChange={handlePinChange}
              onKeyDown={handleKeyDown}
              placeholder="••••"
              className={`w-full p-3 text-center text-2xl tracking-widest rounded-lg border-2 outline-none transition-colors bg-white dark:bg-gray-800 ${
                error
                  ? 'border-red-400 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900'
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              }`}
            />
            {error && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <X size={14} /> PIN incorreto. Tente novamente.
              </p>
            )}
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
              Não sabe seu PIN? Fale com a Raquel.
            </p>
          </div>

          <button
            onClick={handleConfirm}
            disabled={pin.length !== 4}
            className={`w-full p-3 rounded-xl font-medium transition-colors ${
              pin.length === 4
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            Entrar no meu treino
          </button>

        </div>
      )}

    </div>
  );
}