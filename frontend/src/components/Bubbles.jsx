import React, { useEffect, useState } from 'react';

const Bubbles = () => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const generateBubble = () => {
      const id = Date.now();
      const size = Math.random() * 30 + 10;
      const left = Math.random() * 100;
      const duration = Math.random() * 10 + 10;
      const delay = Math.random() * 5;

      setBubbles(prev => [...prev, { id, size, left, duration, delay }]);

      setTimeout(() => {
        setBubbles(prev => prev.filter(b => b.id !== id));
      }, (duration + delay) * 1000);
    };

    const interval = setInterval(generateBubble, 2000);
    
    // 초기 버블 생성
    for (let i = 0; i < 5; i++) {
      setTimeout(generateBubble, i * 500);
    }

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="bubble"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Bubbles;