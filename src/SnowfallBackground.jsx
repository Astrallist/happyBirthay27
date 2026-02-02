
import React, { useEffect } from 'react';
import './SnowfallBackground.css';

const SnowfallBackground = () => {
  useEffect(() => {
    const snowColors = ['#FFFFFF', '#B0E0E6', '#E0FFFF']; // Белый, голубой, светлый голубой
    const container = document.querySelector('.snowfall-container');
    
    const createSnowflake = (type) => {
      const snowflake = document.createElement('div');
      snowflake.className = `snowflake ${type}`;
      snowflake.style.left = Math.random() * 100 + 'vw';
      snowflake.style.opacity = Math.random() * 0.7 + 0.3; // Разная прозрачность
      snowflake.style.animationDuration = (Math.random() * 5 + 5) + 's'; // Медленнее, чем конфетти
      snowflake.style.animationDelay = Math.random() * 10 + 's';
      
      const color = snowColors[Math.floor(Math.random() * snowColors.length)];
      
      if (type === 'triangle') {
        snowflake.style.borderBottomColor = color;
      } else {
        snowflake.style.backgroundColor = color;
      }
      
      return snowflake;
    };

    // Создаем больше снежинок, чем конфетти (зимний эффект)
    for (let i = 0; i < 150; i++) {
      const shapeType = ['circle', 'circle', 'triangle'][Math.floor(Math.random() * 3)]; // Чаще круги
      container.appendChild(createSnowflake(shapeType));
    }
  }, []);

  return <div className="snowfall-container"></div>;
};

export default SnowfallBackground;
