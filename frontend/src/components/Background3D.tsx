import React from 'react';
import { motion } from 'framer-motion';

export const Background3D = () => {
  // Generate random floating shapes
  const shapes = Array.from({ length: 15 }).map((_, i) => {
    const size = Math.random() * 100 + 50;
    const isCube = Math.random() > 0.5;
    const color = Math.random() > 0.5 ? 'rgba(232, 75, 26, 0.1)' : 'rgba(92, 61, 46, 0.08)'; // Magma Orange / Oak Wood Brown

    return {
      id: i,
      size,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * -20,
      isCube,
      color,
    };
  });

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-background">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute shadow-xl backdrop-blur-sm"
          style={{
            width: shape.size,
            height: shape.size,
            backgroundColor: shape.color,
            borderRadius: shape.isCube ? '20%' : '50%',
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            border: `1px solid ${shape.color.replace('0.1', '0.2').replace('0.08', '0.2')}`,
          }}
          animate={{
            y: ['0%', '-50%', '0%'],
            x: ['0%', '30%', '0%'],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: shape.delay,
          }}
        />
      ))}
    </div>
  );
};
