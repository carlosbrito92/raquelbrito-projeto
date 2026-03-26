import PlanView from './views/PlanView';
import { useState, useEffect } from 'react';
import TrainerHome from './views/TrainerHome';
import AddStudent from './views/AddStudent';
import { storage } from './lib/storage';

export default function App() {
  const [view, setView] = useState('TrainerHome');
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Começamos com array vazio e um estado de loading
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Busca os dados no Firebase ao carregar o App pela primeira vez
  useEffect(() => {
    async function loadData() {
      const data = await storage.get('pt_students');
      if (data) {
        setStudents(data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const nav = (targetView, student = null) => {
    setSelectedStudent(student);
    setView(targetView);
  };

  const handleAddStudent = async (newStudent) => {
    const updatedList = [...students, newStudent];
    
    // 1. Persistência assíncrona otimista: atualiza a UI instantaneamente
    setStudents(updatedList);
    
    // 2. Salva no Firestore em background usando a chave definida na arquitetura
    await storage.set('pt_students', updatedList);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500">
        Carregando dados...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      {view === 'TrainerHome' && <TrainerHome nav={nav} students={students} />}
      
      {view === 'AddStudent' && <AddStudent nav={nav} onAdd={handleAddStudent} />}

      {view === 'PlanView' && <PlanView nav={nav} student={selectedStudent} />}
    </div>
  );
}
