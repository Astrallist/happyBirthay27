import { useState } from 'react';
import './SquidGameInvitation.css';

export default function RSVP({ user, onConfirm, onDecline }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = () => {
    setIsSubmitting(true);
    onConfirm();
  };

  const handleDecline = () => {
    setIsSubmitting(true);
    onDecline();
  };

  return (
    <div className="squid-game-container">
      <div className="game-symbols">
      </div>
      
      {/*<h1 className="invitation-title">
        ВЫ ПРИГЛАШЕНЫ НА ИГРУ
      </h1>*/}
      
      <div className="invitation-text">
        <h2>
          {user.sex === 'мужской' ? "Дорогой" : "Дорогая"} {user.firstName} {user.lastName},
        </h2>
        <p>Приглашаю тебя на свой 26й день рождения, который состоятся 21 июня 2025 года в Подмосковье (
            ~2 часа от Павелецкого вокзала, или 70км от Мск).</p>
        <p>Официальная часть с 12 до 18, это отличное время чтобы добраться домой до наступления ночи,  а утром успеть выспаться.
             Если планируешь задержаться до утра, то такой вариант тоже возможен, сообщи об этом заранее, т.к. могут возникнуть сложности с размещением. 
             Около дома есть место , где ты можешь припарковать свой автомобиль.
        </p>

      </div>
      
      <div className="confirmation-buttons">
        <button 
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="red-button"
        >
          Подтверждаю участие
        </button>
        
        <button 
          onClick={handleDecline}
          disabled={isSubmitting}
          className="black-button"
        >
          Отклоняю (рискованно)
        </button>
      </div>
    </div>
  );
}