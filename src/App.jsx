import DashboardView from './views/DashboardView';
import StudentPortal from './views/StudentPortal';
import { useState, useEffect } from 'react';
import HomeView from './views/HomeView';
import StudentSelect from './views/StudentSelect';
import TrainerHome from './views/TrainerHome';
import AddStudent from './views/AddStudent';
import PlanView from './views/PlanView';
import { storage } from './lib/storage';

export default function App() {
  const [view, setView] = useState('HomeView');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await storage.get('pt_students');
      if (data) setStudents(data);
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
    setStudents(updatedList);
    await storage.set('pt_students', updatedList);
  };

  const handleDeleteStudent = async (studentId) => {
    const updatedList = students.filter(s => s.id !== studentId);
    setStudents(updatedList);
    await storage.set('pt_students', updatedList);
    await storage.del(`plan_${studentId}`);
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

      {/* 1. Telas Iniciais */}
      {view === 'HomeView' && <HomeView nav={nav} />}

      {/* 2. Telas do Aluno */}
      {view === 'StudentSelect' && <StudentSelect nav={nav} students={students} />}
      {view === 'StudentPortal' && <StudentPortal nav={nav} student={selectedStudent} />}

      {/* 3. Telas do Personal Trainer */}
      {view === 'TrainerHome' && (
        <TrainerHome
          nav={nav}
          students={students}
          onDelete={handleDeleteStudent}
        />
      )}
      {view === 'AddStudent' && <AddStudent nav={nav} onAdd={handleAddStudent} />}
      {view === 'PlanView' && <PlanView nav={nav} student={selectedStudent} />}
      {view === 'DashboardView' && <DashboardView nav={nav} student={selectedStudent} />}

    </div>
  );
}