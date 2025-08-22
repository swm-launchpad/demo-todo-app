import React from 'react';
import { motion } from 'framer-motion';

const OceanHeader = ({ user }) => {
  if (!user || !user.stats) return null;

  const getOceanDepth = (level) => {
    if (level <= 5) return '얕은 바다';
    if (level <= 10) return '연안';
    if (level <= 20) return '심해';
    if (level <= 30) return '해구';
    return '마리아나 해구';
  };

  const getSeaCreature = (level) => {
    if (level <= 5) return '🐟';
    if (level <= 10) return '🐠';
    if (level <= 15) return '🐢';
    if (level <= 20) return '🦈';
    if (level <= 25) return '🐙';
    return '🐋';
  };

  const expForNextLevel = 100 * Math.pow(1.5, user.stats.level - 1);
  const expProgress = (user.stats.exp / expForNextLevel) * 100;

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-b from-cyan-600/20 to-blue-800/20 backdrop-blur-lg rounded-3xl p-6 mb-6 border border-white/20"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <motion.div 
            className="text-6xl"
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            {getSeaCreature(user.stats.level)}
          </motion.div>
          
          <div className="text-white">
            <h1 className="text-3xl font-bold">{user.username}</h1>
            <p className="text-cyan-200">레벨 {user.stats.level} · {getOceanDepth(user.stats.level)}</p>
          </div>
        </div>

        <div className="text-right text-white">
          <div className="text-3xl font-bold text-yellow-300">{user.stats.total_exp} XP</div>
          <p className="text-sm text-cyan-200">{user.stats.quests_completed}개 퀘스트 완료</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-white text-sm">
          <span>레벨 {user.stats.level}</span>
          <span>레벨 {user.stats.level + 1}</span>
        </div>
        <div className="relative h-6 bg-blue-900/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${expProgress}%` }}
            transition={{ duration: 1 }}
            className="absolute h-full bg-gradient-to-r from-cyan-400 to-blue-500"
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse" />
          </motion.div>
        </div>
        <p className="text-center text-cyan-200 text-xs">
          {user.stats.exp} / {expForNextLevel} XP
        </p>
      </div>
    </motion.div>
  );
};

export default OceanHeader;