import { useState } from 'react';
import TrainerHome from './views/TrainerHome';

export default function App() {
  // Estado principal de roteamento e seleção
  const [view, setView] = useState('TrainerHome');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Função de roteamento simples (nav)
  const nav = (targetView, student = null) => {
    setSelectedStudent(student);
    setView(targetView);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      {view === 'TrainerHome' && <TrainerHome nav={nav} />}
      
      {/* Views em construção (Mockadas para não quebrar a navegação) */}
      {view === 'AddStudent' && (
        <div className="p-4 max-w-md mx-auto">
          <button onClick={() => nav('TrainerHome')} className="mb-4 text-blue-600">← Voltar</button>
          <h2 className="text-xl font-bold">Adicionar Aluno (Em breve)</h2>
        </div>
      )}

      {view === 'PlanView' && (
        <div className="p-4 max-w-md mx-auto">
          <button onClick={() => nav('TrainerHome')} className="mb-4 text-blue-600">← Voltar</button>
          <h2 className="text-xl font-bold">Plano de Treino: {selectedStudent?.name}</h2>
        </div>
      )}
    </div>
  );
}
