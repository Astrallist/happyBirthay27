import React, { useEffect } from 'react';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
useEffect(() => {
  const colors = ['#FF00DC', '#007F7F'];
  const container = document.querySelector('.confetti-container');
  
  const createShape = (type) => {
    const shape = document.createElement('div');
    shape.className = `confetti ${type}`;
    shape.style.left = Math.random() * 100 + 'vw';
    shape.style.animationDuration = (Math.random() * 3 + 2) + 's';
    shape.style.animationDelay = Math.random() * 5 + 's';
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    if (type === 'triangle') {
      shape.style.borderBottomColor = color;
    } else {
      shape.style.backgroundColor = color;
    }
    
    return shape;
  };

  for (let i = 0; i < 100; i++) {
    const shapeType = ['square', 'circle', 'triangle'][Math.floor(Math.random() * 3)];
    container.appendChild(createShape(shapeType));
  }
}, []);

  return <div className="confetti-container"></div>;
};

export default AnimatedBackground;