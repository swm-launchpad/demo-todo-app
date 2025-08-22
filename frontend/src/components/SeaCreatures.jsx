import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SeaCreatures = () => {
  const [creatures, setCreatures] = useState([]);

  useEffect(() => {
    // 해파리 생성
    const jellyfishInterval = setInterval(() => {
      const id = `jelly-${Date.now()}`;
      const size = Math.random() * 40 + 30;
      const top = Math.random() * 60 + 20;
      const duration = Math.random() * 20 + 20;

      setCreatures(prev => [...prev, {
        id,
        type: 'jellyfish',
        size,
        top,
        duration,
        emoji: '🎐'
      }]);

      setTimeout(() => {
        setCreatures(prev => prev.filter(c => c.id !== id));
      }, duration * 1000);
    }, 8000);

    // 물고기 떼 생성
    const fishSchoolInterval = setInterval(() => {
      const schoolId = `school-${Date.now()}`;
      const fishCount = Math.floor(Math.random() * 5) + 3;
      const top = Math.random() * 70 + 15;
      
      for (let i = 0; i < fishCount; i++) {
        const id = `${schoolId}-${i}`;
        const delay = i * 0.2;
        const size = Math.random() * 20 + 15;
        
        setCreatures(prev => [...prev, {
          id,
          type: 'fish',
          size,
          top: top + (Math.random() * 10 - 5),
          duration: 15,
          delay,
          emoji: '🐟'
        }]);

        setTimeout(() => {
          setCreatures(prev => prev.filter(c => c.id !== id));
        }, 20000);
      }
    }, 10000);

    // 초기 생물 생성
    setTimeout(() => {
      for (let i = 0; i < 3; i++) {
        const id = `init-jelly-${i}`;
        setCreatures(prev => [...prev, {
          id,
          type: 'jellyfish',
          size: Math.random() * 40 + 30,
          top: Math.random() * 60 + 20,
          duration: Math.random() * 20 + 20,
          emoji: '🎐'
        }]);
      }
    }, 1000);

    return () => {
      clearInterval(jellyfishInterval);
      clearInterval(fishSchoolInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {creatures.map(creature => (
        <motion.div
          key={creature.id}
          className="absolute"
          initial={{ 
            x: creature.type === 'fish' ? -100 : '50vw',
            y: `${creature.top}vh`,
            opacity: 0 
          }}
          animate={{ 
            x: creature.type === 'fish' ? '110vw' : ['45vw', '55vw', '45vw'],
            y: creature.type === 'jellyfish' 
              ? [`${creature.top}vh`, `${creature.top - 10}vh`, `${creature.top}vh`]
              : `${creature.top}vh`,
            opacity: [0, 0.7, 0.7, 0]
          }}
          transition={{
            duration: creature.duration,
            delay: creature.delay || 0,
            repeat: creature.type === 'jellyfish' ? Infinity : 0,
            ease: "linear"
          }}
          style={{
            fontSize: `${creature.size}px`,
            filter: creature.type === 'jellyfish' ? 'blur(0.5px)' : 'none'
          }}
        >
          <motion.span
            animate={creature.type === 'jellyfish' ? {
              rotate: [0, -10, 10, 0]
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity
            }}
            style={{ display: 'block' }}
          >
            {creature.emoji}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
};

export default SeaCreatures;