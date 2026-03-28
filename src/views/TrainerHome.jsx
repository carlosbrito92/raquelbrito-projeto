import React from 'react';
import { Users, Plus, ChevronRight, BarChart2, Trash2 } from 'lucide-react';

export default function TrainerHome({ nav, students, onDelete }) {
  const handleDelete = (e, student) => {
    e.stopPropagation();
    if (window.confirm(`Remover ${student.name}? Esta ação não pode ser desfeita.`)) {
      onDelete(student.id);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="text-blue-600 dark:text-blue-400" />
          Meus Alunos
        </h1>
        <button
          onClick={() => nav('AddStudent')}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
          aria-label="Adicionar Aluno"
        >
          <Plus size={24} />
        </button>
      </header>

      <main className="flex flex-col gap-3">
        {students.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
            Nenhum aluno cadastrado ainda.
          </p>
        )}
        {students.map(student => (
          <div
            key={student.id}
            onClick={() => nav('PlanView', student)}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center cursor-pointer hover:shadow-md transition-shadow"
          >
            <div>
              <h2 className="font-semibold text-lg">{student.name}</h2>
              <div className="flex gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md">
                  {student.objective}
                </span>
                <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md">
                  +{student.progressionRate}%/sem
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); nav('DashboardView', student); }}
                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                title="Ver Dashboard"
              >
                <BarChart2 size={20} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nav('PlanView', student); }}
                className="p-2 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-full transition-colors"
                title="Ver Treino"
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={(e) => handleDelete(e, student)}
                className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                title="Remover Aluno"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}