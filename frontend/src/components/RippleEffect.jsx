import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RippleEffect = () => {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { id, x, y }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 1500);
  };

  return (
    <div 
      className="fixed inset-0 z-0"
      onClick={handleClick}
      style={{ pointerEvents: 'auto' }}
    >
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            className="absolute pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <div className="w-20 h-20 rounded-full border-2 border-cyan-400" />
            <motion.div
              className="absolute inset-0 w-20 h-20 rounded-full border-2 border-cyan-300"
              animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
              transition={{ duration: 1, delay: 0.1 }}
            />
            <motion.div
              className="absolute inset-0 w-20 h-20 rounded-full border-2 border-cyan-200"
              animate={{ scale: [1, 2], opacity: [0.6, 0] }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default RippleEffect;