
import React, { useState, useEffect } from 'react';
import './WinterInvitation.css';

const WinterInvitation = ({ user, onConfirm, onDecline, userImage }) => {
  const [activeTab, setActiveTab] = useState(null);
  const [formData, setFormData] = useState({
    themes: '',
    song: '',
    pool: ''
  });
  const [friendsAvatars, setFriendsAvatars] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  // === НАСТРОЙКИ ТЕЛЕГРАМ БОТА ===
  const TELEGRAM_BOT_TOKEN = '8441201967:AAHECelSsdl3RIaaMok3OcAgqxbA850aAyo'; // Ваш рабочий токен!
  
  // Chat ID будет определен автоматически
  const [telegramChatId, setTelegramChatId] = useState('');

  // Функция для автоматического поиска Chat ID
  const findTelegramChatId = async () => {
    try {
      console.log('🔍 Ищу Chat ID...');
      
      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`
      );
      
      const data = await response.json();
      console.log('Telegram ответ:', data);
      
      if (data.ok && data.result && data.result.length > 0) {
        // Берем последнее обновление
        const lastUpdate = data.result[data.result.length - 1];
        
        let foundChatId = '';
        
        // Проверяем разные типы обновлений
        if (lastUpdate.message) {
          foundChatId = lastUpdate.message.chat.id;
          console.log('✅ Найден Chat ID из сообщения:', foundChatId);
        } else if (lastUpdate.my_chat_member) {
          foundChatId = lastUpdate.my_chat_member.chat.id;
          console.log('✅ Найден Chat ID из chat_member:', foundChatId);
        } else if (lastUpdate.channel_post) {
          foundChatId = lastUpdate.channel_post.chat.id;
          console.log('✅ Найден Chat ID канала:', foundChatId);
        }
        
        if (foundChatId) {
          setTelegramChatId(foundChatId.toString());
          console.log('🎯 Chat ID сохранен:', foundChatId);
          
          // Показываем уведомление (только разработчику)
          if (user?.status === 'VISITOR') { // Только организатору
            alert(`✅ Telegram настроен!\nChat ID: ${foundChatId}\n\nТеперь все ответы будут приходить в Telegram.`);
          }
          
          return foundChatId.toString();
        }
      } else {
        console.log('⚠️ Сообщений боту еще нет. Напишите боту в Telegram!');
        
        // Показываем инструкцию только организатору
        if (user?.status === 'VISITOR') {
          alert(`🤖 Настройка Telegram:\n\n1. Откройте Telegram\n2. Найдите бота по ID: 8441201967\n3. Напишите "start" или любое сообщение\n4. Обновите эту страницу\n\nИли создайте группу/канал и добавьте бота туда.`);
        }
      }
    } catch (error) {
      console.error('❌ Ошибка при поиске Chat ID:', error);
    }
    
    return null;
  };

  // Загружаем аватарки друзей
  useEffect(() => {
    if (user?.friends) {
      const avatars = user.friends.map(friendStr => {
        try {
          return require(`./images/${friendStr}.png`);
        } catch (e) {
          console.error(`Не удалось загрузить аватар для ${friendStr}:`, e);
          return null;
        }
      }).filter(avatar => avatar !== null);
      setFriendsAvatars(avatars);
    }
    
    // При первой загрузке пробуем найти Chat ID (только для организатора)
    if (user?.status === 'VISITOR') {
      findTelegramChatId();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Функция отправки в Telegram
  const sendToTelegram = async (message) => {
    // Если Chat ID еще не найден, пробуем найти сейчас
    let chatId = telegramChatId;
    if (!chatId) {
      chatId = await findTelegramChatId();
    }
    
    if (!chatId) {
      console.log('⚠️ Chat ID не найден, отправка в Telegram пропущена');
      return false;
    }

    try {
      console.log('📤 Отправка в Telegram...');
      
      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML',
            disable_web_page_preview: true
          })
        }
      );

      const result = await response.json();
      console.log('📨 Ответ Telegram:', result);
      
      if (result.ok) {
        console.log('✅ Успешно отправлено в Telegram');
        return true;
      } else {
        console.error('❌ Ошибка Telegram:', result.description);
        return false;
      }
    } catch (error) {
      console.error('❌ Ошибка сети при отправке в Telegram:', error);
      return false;
    }
  };

  const handleConfirmSubmit = async () => {
    if (!formData.themes.trim() || !formData.song.trim() || !formData.pool) {
      alert('Пожалуйста, заполните все поля анкеты');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('');

    // Данные для сохранения
    const responseData = {
      name: `${user.firstName} ${user.lastName}`,
      themes: formData.themes,
      song: formData.song,
      pool: formData.pool,
      timestamp: new Date().toISOString(),
      type: 'confirmed'
    };

    // 1. Сохраняем в localStorage (всегда)
    try {
      const responses = JSON.parse(localStorage.getItem('birthdayResponses') || '[]');
      responses.push(responseData);
      localStorage.setItem('birthdayResponses', JSON.stringify(responses));
      console.log('💾 Ответ сохранен локально');
    } catch (e) {
      console.error('Ошибка сохранения:', e);
    }

    // 2. Показываем в консоли
    console.log('🎉 ===== НОВЫЙ ОТВЕТ =====');
    console.log('👤 Имя:', responseData.name);
    console.log('🎮 Темы:', responseData.themes);
    console.log('🎵 Песня:', responseData.song);
    console.log('🏊 Бассейн:', responseData.pool);
    console.log('⏰ Время:', new Date().toLocaleString('ru-RU'));
    console.log('========================');

    // 3. Отправляем в Telegram
    const telegramMessage = `
🎉 <b>НОВЫЙ ОТВЕТ НА ДР 2025!</b>

👤 <b>Гость:</b> ${user.firstName} ${user.lastName}
🎮 <b>Темы для игры:</b>
${formData.themes}

🎵 <b>Песня-вайб:</b>
${formData.song}

🏊 <b>Бассейн:</b> ${formData.pool}
⏰ <b>Время ответа:</b> ${new Date().toLocaleString('ru-RU')}

━━━━━━━━━━━━━━━━━━━━
✅ <i>Гость подтвердил участие!</i>`;

    const telegramSent = await sendToTelegram(telegramMessage);
    
    if (telegramSent) {
      setSubmitStatus('success');
    } else {
      setSubmitStatus('warning');
    }

    // 4. Показываем уведомление пользователю
    setTimeout(() => {
      alert(`Спасибо, ${user.firstName}! 🎉\n\nТвой ответ сохранён и отправлен организатору.`);
      onConfirm();
    }, 1500);
  };

  const handleDeclineSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('');
    
    // Сохраняем отказ
    const responseData = {
      name: `${user.firstName} ${user.lastName}`,
      timestamp: new Date().toISOString(),
      type: 'declined'
    };
    
    try {
      const responses = JSON.parse(localStorage.getItem('birthdayResponses') || '[]');
      responses.push(responseData);
      localStorage.setItem('birthdayResponses', JSON.stringify(responses));
      console.log('💾 Отказ сохранен');
    } catch (e) {
      console.error('Ошибка сохранения отказа:', e);
    }

    console.log('😔 ===== ОТКАЗ =====');
    console.log('👤 Имя:', responseData.name);
    console.log('⏰ Время:', new Date().toLocaleString('ru-RU'));
    console.log('==================');

    // Отправляем в Telegram
    const telegramMessage = `
😔 <b>ОТКАЗ НА ДР 2025</b>

👤 <b>Гость:</b> ${user.firstName} ${user.lastName}
⏰ <b>Время отказа:</b> ${new Date().toLocaleString('ru-RU')}

━━━━━━━━━━━━━━━━━━━━
❌ <i>Гость не сможет прийти</i>`;

    await sendToTelegram(telegramMessage);

    setSubmitStatus('success');
    setTimeout(() => {
      onDecline();
    }, 500);
  };

  // Функция для тестирования Telegram
  const testTelegramConnection = async () => {
    if (user?.status !== 'VISITOR') return; // Только организатору
    
    const testMessage = `🤖 <b>Тестовое сообщение от Birthday Bot</b>\n\n✅ Бот работает правильно!\n⏰ Время: ${new Date().toLocaleString('ru-RU')}`;
    
    const sent = await sendToTelegram(testMessage);
    
    if (sent) {
      alert('✅ Тестовое сообщение отправлено в Telegram!');
    } else {
      alert('❌ Не удалось отправить. Напишите боту сообщение в Telegram и обновите страницу.');
    }
  };

  // Функция для экспорта всех ответов
  const exportAllResponses = () => {
    try {
      const responses = JSON.parse(localStorage.getItem('birthdayResponses') || '[]');
      console.log('📊 ===== ВСЕ ОТВЕТЫ =====');
      console.log(JSON.stringify(responses, null, 2));
      console.log('Всего ответов:', responses.length);
      
      // Создаем файл для скачивания
      const dataStr = JSON.stringify(responses, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `birthday_responses_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`✅ Данные экспортированы в файл!\n\nВсего ответов: ${responses.length}`);
        
    } catch (e) {
      console.error('Ошибка экспорта:', e);
      alert('❌ Ошибка при экспорте данных');
    }
  };

  return (
    <div className="winter-container">
      <div className="invitation-header">
        <h1>
          {user.sex === 'мужской' ? 'Дорогой' : 'Дорогая'} {user.shortName}!
        </h1>
        <h2>Приглашаю тебя на свой 27-й день рождения!</h2>
        <p>Который состоится 14 февраля примерно в 15:00 на Западе Москвы...</p>
        
        {userImage && (
          <div className="user-avatar">
            <img 
              src={userImage} 
              alt={`${user.firstName} ${user.lastName}`}
            />
          </div>
        )}
      </div>

      <div className="response-tabs">
        {/* Вкладка ОТКАЗА */}
        <div className={`tab decline-tab ${activeTab === 'decline' ? 'active' : ''}`}>
          <div 
            className="tab-header"
            onClick={() => setActiveTab(activeTab === 'decline' ? null : 'decline')}
          >
            <span className="tab-icon"></span>
            <h3>Я не смогу прийти</h3>
          </div>
          
          {activeTab === 'decline' && (
            <div className="tab-content">
              <p>Очень жаль, что ты не сможешь разделить этот день со мной!</p>
              <button 
                className="decline-btn"
                onClick={handleDeclineSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Отправка...' : 'Подтвердить отказ'}
              </button>
            </div>
          )}
        </div>

        {/* Вкладка ПОДТВЕРЖДЕНИЯ */}
        <div className={`tab confirm-tab ${activeTab === 'confirm' ? 'active' : ''}`}>
          <div 
            className="tab-header"
            onClick={() => setActiveTab(activeTab === 'confirm' ? null : 'confirm')}
          >
            <span className="tab-icon"></span>
            <h3>Я буду на празднике!</h3>
          </div>
          
          {activeTab === 'confirm' && (
            <div className="tab-content">
              {/* Блок с друзьями */}
              {friendsAvatars.length > 0 && (
                <div className="friends-section">
                  <p>Твоих друзей тоже жду:</p>
                  <div className="friends-avatars">
                    {friendsAvatars.map((avatar, index) => (
                      <div key={index} className="friend-avatar">
                        <img src={avatar} alt={`Друг ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Форма с вопросами */}
              <div className="question-form">
                <div className="form-group">
                  <label>Две темы для игры "Самый умный" (общие темы):</label>
                  <textarea 
                    name="themes"
                    value={formData.themes}
                    onChange={handleInputChange}
                    placeholder="Например: Чай, История Китая (две темы одинаковые написал, да), Гарри Поттер (ЗАПРЕЩЕН В ЭТОМ ГОДУ)..."
                    rows="3"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Песня, которая передает вайб именинника:</label>
                  <input 
                    type="text"
                    name="song"
                    value={formData.song}
                    onChange={handleInputChange}
                    placeholder="Название песни и исполнитель"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Поедешь в бассейн? (плавать необязательно)</label>
                  <select 
                    name="pool"
                    value={formData.pool}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Выберите вариант</option>
                    <option value="Да">Да, конечно!</option>
                    <option value="Нет">Нет, не поеду</option>
                    <option value="Наверное">Наверное, посмотрю по настроению</option>
                  </select>
                </div>

                <button 
                  className="confirm-btn"
                  onClick={handleConfirmSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Отправка...' : 'Подтвердить участие'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Статус отправки */}
      {submitStatus === 'success' && (
        <div className="submit-status success">
          ✅ Ответ отправлен! {telegramChatId ? 'Уведомление в Telegram' : 'Сохранено локально'}
        </div>
      )}
      
      {submitStatus === 'warning' && (
        <div className="submit-status warning">
          ⚠️ Ответ сохранён локально. Telegram не настроен.
        </div>
      )}

      {/* Панель управления для организатора */}
      {user?.status === 'VISITOR' && (
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem',
          background: 'rgba(255, 193, 7, 0.1)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 193, 7, 0.3)'
        }}>
          <p style={{ margin: '0 0 0.5rem 0', color: '#ffc107', fontSize: '0.9rem' }}>
            <strong>👑 Панель организатора</strong>
            {telegramChatId && ` • Chat ID: ${telegramChatId}`}
          </p>
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              onClick={testTelegramConnection}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(110, 198, 255, 0.2)',
                border: '1px solid rgba(110, 198, 255, 0.5)',
                borderRadius: '5px',
                color: '#6ec6ff',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              🔗 Тест Telegram
            </button>
            
            <button 
              onClick={exportAllResponses}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(76, 175, 80, 0.2)',
                border: '1px solid rgba(76, 175, 80, 0.5)',
                borderRadius: '5px',
                color: '#4caf50',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              📋 Экспорт всех ответов
            </button>
            
            <button 
              onClick={() => {
                localStorage.removeItem('birthdayResponses');
                alert('✅ Все ответы очищены!');
                console.log('🗑️ Все ответы удалены');
              }}
              style={{
                padding: '0.5rem 1rem',
                background: 'rgba(244, 67, 54, 0.2)',
                border: '1px solid rgba(244, 67, 54, 0.5)',
                borderRadius: '5px',
                color: '#f44336',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              🗑️ Очистить все ответы
            </button>
          </div>
          
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#ffc107' }}>
            {telegramChatId 
              ? '✅ Telegram настроен. Все ответы будут приходить в чат.' 
              : '⚠️ Напишите боту сообщение в Telegram для настройки.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default WinterInvitation;
