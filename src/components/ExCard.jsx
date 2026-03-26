import React, { useState } from 'react';
import { Dumbbell, Clock, Repeat, Edit2 } from 'lucide-react';

export default function ExCard({ exercise, onUpdate }) {
  // Estado local para controlar se o input está visível (Design Pattern: Edição Inline)
  const [isEditing, setIsEditing] = useState(false);
  
  // Estado local para guardar o valor temporário enquanto o usuário digita
  const [editValue, setEditValue] = useState(exercise.week1Load);

  // Função disparada quando o usuário tira o foco do input (onBlur) ou aperta Enter
  const handleSave = () => {
    setIsEditing(false);
    
    const newLoad = parseFloat(editValue);
    // Só atualiza se for um número válido e diferente do atual para evitar renders desnecessários
    if (!isNaN(newLoad) && newLoad !== exercise.week1Load) {
      onUpdate({ ...exercise, week1Load: newLoad });
    } else {
      // Se for inválido, reverte para o valor original
      setEditValue(exercise.week1Load);
    }
  };

  // Escuta a tecla Enter para salvar rapidamente sem precisar clicar fora
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      
      {/* Cabeçalho do Card: Nome do exercício */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Dumbbell size={18} className="text-blue-600 dark:text-blue-400" />
          {exercise.name}
        </h3>
      </div>

      {/* Corpo do Card: Detalhes de séries, repetições e intervalo */}
      <div className="grid grid-cols-3 gap-2 text-sm mb-4">
        <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <Repeat size={14} className="text-gray-400 mb-1" />
          <span className="font-medium">{exercise.series}x</span>
          <span className="text-xs text-gray-500">Séries</span>
        </div>
        
        <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <Dumbbell size={14} className="text-gray-400 mb-1" />
          <span className="font-medium">{exercise.reps}</span>
          <span className="text-xs text-gray-500">Reps</span>
        </div>
        
        <div className="flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <Clock size={14} className="text-gray-400 mb-1" />
          <span className="font-medium">{exercise.interval}s</span>
          <span className="text-xs text-gray-500">Pausa</span>
        </div>
      </div>

      {/* Rodapé do Card: Área de Carga (Semana 1) com Edição Inline */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Carga Base (S1):
        </span>
        
        {isEditing ? (
          <div className="flex items-center gap-1">
            <input
              type="number"
              // Obstáculo H3: Inputs numéricos com step fracionado para musculação (ex: 7.5kg)
              step="0.5" 
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="w-20 p-1 text-right border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-gray-900 dark:text-white"
            />
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">kg</span>
          </div>
        ) : (
          <div 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 cursor-pointer group px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title="Clique para editar a carga"
          >
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {exercise.week1Load}
            </span>
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">kg</span>
            <Edit2 size={12} className="text-gray-300 group-hover:text-blue-500 transition-colors ml-1" />
          </div>
        )}
      </div>

    </div>
  );
}
