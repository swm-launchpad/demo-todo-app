import React, { useState } from 'react';
import { motion } from 'framer-motion';

const DemoButton = ({ onGenerate, onCompleteAll, questCount }) => {
  const [isRunning, setIsRunning] = useState(false);

  const handleAutoDemo = async () => {
    setIsRunning(true);
    
    if (questCount === 0) {
      await onGenerate();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    await onCompleteAll();
    setIsRunning(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-md rounded-2xl p-4 mb-6 border border-white/20"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="text-white">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            빠른 시연
          </h3>
          <p className="text-sm opacity-80">1분 안에 모든 기능을 체험하세요!</p>
        </div>
        
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGenerate}
            disabled={isRunning}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium flex items-center gap-2 disabled:opacity-50 hover:shadow-lg transition-all"
          >
            <span>🌊</span>
            10개 생성
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCompleteAll}
            disabled={isRunning || questCount === 0}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium flex items-center gap-2 disabled:opacity-50 hover:shadow-lg transition-all"
          >
            <span>⚡</span>
            모두 완료
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAutoDemo}
            disabled={isRunning}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 hover:shadow-lg transition-all ripple-effect"
          >
            <span>🚀</span>
            {isRunning ? '실행 중...' : '자동 시연'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default DemoButton;