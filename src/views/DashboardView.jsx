import React, { useState, useEffect } from 'react';
import { ArrowLeft, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { storage } from '../lib/storage';
import { getExpected, calcVol } from '../lib/progression';

export default function DashboardView({ nav, student }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      if (!student) return;
      const planData = await storage.get(`plan_${student.id}`);
      
      if (!planData || !planData.blocks) {
        setLoading(false);
        return;
      }

      // Processa os dados do gráfico agregando o volume de todas as semanas
      const chartData = [1, 2, 3, 4].map(week => {
        let volEsp = 0;
        let volReal = 0;

        ['A', 'B', 'C'].forEach(block => {
          planData.blocks[block].forEach(ex => {
            // Regras de negócio puras
            const expectedLoad = getExpected(ex.week1Load, student.progressionRate, week);
            const actualLoad = ex.actualLoads?.[week] || 0;

            volEsp += calcVol(expectedLoad, ex.series, ex.reps);
            volReal += calcVol(actualLoad, ex.series, ex.reps);
          });
        });

        return {
          name: `Semana ${week}`,
          Esperado: volEsp,
          Real: volReal,
        };
      });

      setData(chartData);
      setLoading(false);
    }
    
    loadDashboard();
  }, [student]);

  if (loading) return <div className="p-8 text-center text-gray-500">Calculando volumes...</div>;

  return (
    <div className="max-w-md mx-auto p-4 pb-20">
      <header className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => nav('TrainerHome')}
          className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <BarChart2 className="text-blue-600 dark:text-blue-400" />
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{student?.name}</p>
        </div>
      </header>

      {/* Container do Gráfico */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-6">Volume de Treino (kg)</h2>
        
        {/* Solução H2: Altura explícita (h-72) na div pai para o Recharts não sumir */}
        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ backgroundColor: 'var(--color-background-main)', borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
              <Bar dataKey="Esperado" fill="#93c5fd" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Real" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
