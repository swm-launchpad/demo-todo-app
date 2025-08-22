import React from 'react';
import { motion } from 'framer-motion';

const difficultyConfig = {
  EASY: { icon: '🦐', label: '새우', color: 'from-green-400 to-green-600', xp: 10 },
  NORMAL: { icon: '🐟', label: '물고기', color: 'from-blue-400 to-blue-600', xp: 25 },
  HARD: { icon: '🐢', label: '거북이', color: 'from-yellow-400 to-yellow-600', xp: 50 },
  EPIC: { icon: '🦈', label: '상어', color: 'from-purple-400 to-purple-600', xp: 100 },
  LEGENDARY: { icon: '🐋', label: '고래', color: 'from-red-400 to-red-600', xp: 200 },
};

const QuestCard = ({ quest, onComplete, onDelete, completed }) => {
  const config = difficultyConfig[quest.difficulty] || difficultyConfig.NORMAL;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      whileHover={!completed ? { scale: 1.02 } : {}}
      className={`bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 ${
        completed ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <motion.div 
            className="text-4xl"
            animate={!completed ? { 
              y: [0, -5, 0],
              rotate: [0, -5, 5, 0]
            } : {}}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatDelay: 2
            }}
          >
            {config.icon}
          </motion.div>
          
          <div className="flex-1">
            <h3 className={`text-white text-lg font-semibold ${completed ? 'line-through' : ''}`}>
              {quest.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${config.color}`}>
                {config.label}
              </span>
              <span className="text-yellow-300 text-sm font-bold">
                +{quest.exp_reward} XP
              </span>
            </div>
          </div>
        </div>

        {!completed && (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onComplete}
              className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onDelete}
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-red-500/50 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default QuestCard;