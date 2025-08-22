import React from 'react';
import { motion } from 'framer-motion';

const SunlightEffect = () => {
  const rays = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    left: 10 + i * 20,
    width: Math.random() * 60 + 40,
    delay: Math.random() * 2,
    duration: Math.random() * 5 + 10
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {rays.map(ray => (
        <motion.div
          key={ray.id}
          className="absolute top-0 h-full bg-gradient-to-b from-yellow-200/10 via-cyan-200/5 to-transparent"
          style={{
            left: `${ray.left}%`,
            width: `${ray.width}px`,
            transformOrigin: 'top center'
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scaleX: [1, 1.2, 1]
          }}
          transition={{
            duration: ray.duration,
            delay: ray.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* 상단 광원 */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96">
        <motion.div
          className="w-full h-full rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,200,0.2) 0%, transparent 70%)',
            filter: 'blur(40px)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
};

export default SunlightEffect;