import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TreasureChest = ({ isOpen, onClose, rewards }) => {
  const [showRewards, setShowRewards] = useState(false);

  const handleOpen = () => {
    setShowRewards(true);
    setTimeout(onClose, 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", duration: 0.7 }}
          className="relative"
          onClick={(e) => e.stopPropagation()}
        >
          {!showRewards ? (
            <motion.div
              className="text-8xl cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
            >
              📦
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-br from-yellow-400 to-amber-600 p-8 rounded-3xl text-center"
            >
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 0.5 }}
                className="text-6xl mb-4"
              >
                🏆
              </motion.div>
              
              <h2 className="text-white text-3xl font-bold mb-4">보물 발견!</h2>
              
              <div className="space-y-2">
                {rewards?.map((reward, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white/20 rounded-lg p-2 text-white"
                  >
                    {reward}
                  </motion.div>
                ))}
              </div>

              <div className="absolute -top-10 -left-10 text-4xl animate-bounce">💎</div>
              <div className="absolute -top-10 -right-10 text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🪙</div>
              <div className="absolute -bottom-10 -left-10 text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>💰</div>
              <div className="absolute -bottom-10 -right-10 text-4xl animate-bounce" style={{ animationDelay: '0.6s' }}>👑</div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TreasureChest;