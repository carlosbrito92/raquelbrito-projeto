import React, { useState } from 'react';
import { Dumbbell, Clock, Repeat, Edit2 } from 'lucide-react';

const TYPE_OPTIONS = [
  { value: 'weighted',   label: 'Com Carga', emoji: '🏋️' },
  { value: 'cardio',     label: 'Cardio',    emoji: '🏃' },
  { value: 'bodyweight', label: 'Corporal',  emoji: '💪' },
];

const UNIT_OPTIONS = ['kg', 'min', 'km', 'rep'];

export default function ExCard({ exercise, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(exercise.week1Load);

  // Retrocompatibilidade: exercícios sem tipo são tratados como 'weighted'
  const exerciseType = exercise.exerciseType || 'weighted';
  const unit = exercise.unit || 'kg';
  const isWeighted = exerciseType === 'weighted';

  const handleSave = () => {
    setIsEditing(false);
    const newLoad = parseFloat(editValue);
    if (!isNaN(newLoad) && newLoad !== exercise.week1Load) {
      onUpdate({ ...exercise, week1Load: newLoad });
    } else {
      setEditValue(exercise.week1Load);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
  };

  const handleTypeChange = (newType) => {
    const defaultUnit = newType === 'weighted' ? 'kg'
      : newType === 'cardio' ? 'min'
      : 'rep';
    onUpdate({
      ...exercise,
      exerciseType: newType,
      unit: defaultUnit,
      week1Load: 0,
    });
    setEditValue(0);
  };

  const handleUnitChange = (newUnit) => {
    onUpdate({ ...exercise, unit: newUnit });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">

      {/* Cabeçalho */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Dumbbell size={18} className="text-blue-600 dark:text-blue-400" />
          {exercise.name}
        </h3>
      </div>

      {/* Seletor de Tipo */}
      <div className="flex gap-1 mb-3">
        {TYPE_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => handleTypeChange(opt.value)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              exerciseType === opt.value
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-50 dark:bg-gray-900 text-gray-500 border-gray-200 dark:border-gray-700 hover:border-blue-300'
            }`}
          >
            {opt.emoji} {opt.label}
          </button>
        ))}
      </div>

      {/* Séries / Reps / Pausa */}
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

      {/* Rodapé: Carga Base ou Referência */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {isWeighted ? 'Carga Base (S1):' : 'Referência (S1):'}
          </span>
          {!isWeighted && (
            <select
              value={unit}
              onChange={(e) => handleUnitChange(e.target.value)}
              className="text-xs border border-gray-200 dark:border-gray-600 rounded-md px-1 py-0.5 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300"
            >
              {UNIT_OPTIONS.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          )}
        </div>

        {isEditing ? (
          <div className="flex items-center gap-1">
            <input
              type="number"
              step={isWeighted ? '0.5' : '1'}
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="w-20 p-1 text-right border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 dark:bg-gray-900 dark:text-white"
            />
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{unit}</span>
          </div>
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 cursor-pointer group px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title="Clique para editar"
          >
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {exercise.week1Load || '—'}
            </span>
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{unit}</span>
            <Edit2 size={12} className="text-gray-300 group-hover:text-blue-500 transition-colors ml-1" />
          </div>
        )}
      </div>

    </div>
  );
}