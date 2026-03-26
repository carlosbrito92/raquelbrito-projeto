import { useState } from 'react';
import TrainerHome from './views/TrainerHome';
import AddStudent from './views/AddStudent';

const INITIAL_MOCKS = [
  { id: 'a1b2c3', name: 'João Silva', objective: 'Hipertrofia', progressionRate: 10, createdAt: '2026-03-20T10:00:00Z' },
  { id: 'x9y8z7', name: 'Maria Souza', objective: 'Força', progressionRate: 5, createdAt: '2026-03-22T14:30:00Z' }
];

export default function App() {
  const [view, setView] = useState('TrainerHome');
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Estado que guarda a lista de alunos (por enquanto apenas local)
  const [students, setStudents] = useState(INITIAL_MOCKS);

  const nav = (targetView, student = null) => {
    setSelectedStudent(student);
    setView(targetView);
  };

  const handleAddStudent = (newStudent) => {
    setStudents([...students, newStudent]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      {view === 'TrainerHome' && <TrainerHome nav={nav} students={students} />}
      
      {view === 'AddStudent' && <AddStudent nav={nav} onAdd={handleAddStudent} />}

      {view === 'PlanView' && (
        <div className="p-4 max-w-md mx-auto">
          <button onClick={() => nav('TrainerHome')} className="mb-4 text-blue-600">← Voltar</button>
          <h2 className="text-xl font-bold">Plano de Treino: {selectedStudent?.name}</h2>
        </div>
      )}
    </div>
  );
}
