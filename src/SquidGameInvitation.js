import React from 'react';
import './SquidGameInvitation.css';

const SquidGameInvitation = () => {
  return (
    <div className="squid-game-container">
      <div className="game-symbols">
      </div>
      
      <h1 className="invitation-title">
        ВЫ ПРИГЛАШЕНЫ НА ИГРУ
      </h1>
      
      <div className="invitation-text">
        <p>26-й день рождения</p>
        <p>Дата: [число] [месяц] [год]</p>
        <p>Место: [адрес]</p>
      </div>
      
      <div className="confirmation-buttons">
        <button className="red-button">Подтверждаю участие</button>
        <button className="black-button">Отклоняю (рискованно)</button>
      </div>
    </div>
  );
};

export default SquidGameInvitation;