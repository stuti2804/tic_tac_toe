import React from 'react';
import { Brain } from 'lucide-react';

interface DifficultySelectorProps {
  difficulty: 'easy' | 'medium' | 'impossible';
  setDifficulty: (difficulty: 'easy' | 'medium' | 'impossible') => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ difficulty, setDifficulty }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700 flex items-center justify-center gap-2">
        <Brain className="w-6 h-6 text-pink-500" />
        Select Difficulty
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {(['easy', 'medium', 'impossible'] as const).map((level) => (
          <button
            key={level}
            onClick={() => setDifficulty(level)}
            className={`py-3 px-6 rounded-lg text-lg font-medium transition-all ${
              difficulty === level
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DifficultySelector;