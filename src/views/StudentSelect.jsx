import React from 'react';
import { ArrowLeft, UserCircle } from 'lucide-react';

export default function StudentSelect({ nav, students }) {
  return (
    <div className="max-w-md mx-auto p-4">
      
      {/* Cabeçalho */}
      <header className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => nav('HomeView')}
          className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Quem é você?</h1>
      </header>

      {/* Lista de Alunos (Sem senha, baseado em confiança - H5) */}
      <main className="flex flex-col gap-3">
        {students.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Nenhum aluno cadastrado ainda.</p>
        ) : (
          students.map(student => (
            <button 
              key={student.id}
              onClick={() => nav('StudentPortal', student)}
              className="w-full bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition-shadow text-left"
            >
              <UserCircle size={40} className="text-blue-200 dark:text-blue-900" />
              <div>
                <h2 className="font-semibold text-lg text-gray-900 dark:text-white">{student.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Objetivo: {student.objective}</p>
              </div>
            </button>
          ))
        )}
      </main>
      
    </div>
  );
}
