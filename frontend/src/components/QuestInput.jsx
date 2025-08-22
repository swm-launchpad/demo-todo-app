import React, { useState } from 'react';
import { motion } from 'framer-motion';

const difficulties = [
  { value: 'EASY', label: '새우', icon: '🦐', color: 'bg-green-500' },
  { value: 'NORMAL', label: '물고기', icon: '🐟', color: 'bg-blue-500' },
  { value: 'HARD', label: '거북이', icon: '🐢', color: 'bg-yellow-500' },
  { value: 'EPIC', label: '상어', icon: '🦈', color: 'bg-purple-500' },
  { value: 'LEGENDARY', label: '고래', icon: '🐋', color: 'bg-red-500' },
];

const QuestInput = ({ onCreateQuest }) => {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('NORMAL');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onCreateQuest(title, difficulty);
    setTitle('');
    setDifficulty('NORMAL');
    setIsOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
    >
      {!isOpen ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(true)}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all"
        >
          <span className="text-2xl">🌊</span>
          새로운 퀘스트 만들기
        </motion.button>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="무엇을 해야 하나요?"
            className="w-full px-4 py-3 bg-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-lg"
            autoFocus
          />

          <div className="flex gap-2">
            {difficulties.map((diff) => (
              <motion.button
                key={diff.value}
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDifficulty(diff.value)}
                className={`flex-1 py-3 rounded-xl text-white font-medium transition-all ${
                  difficulty === diff.value 
                    ? `${diff.color} shadow-lg` 
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                <div className="text-2xl">{diff.icon}</div>
                <div className="text-xs mt-1">{diff.label}</div>
              </motion.button>
            ))}
          </div>

          <div className="flex gap-2">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg"
            >
              생성하기
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsOpen(false)}
              className="px-6 py-3 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30"
            >
              취소
            </motion.button>
          </div>
        </motion.form>
      )}
    </motion.div>
  );
};

export default QuestInput;