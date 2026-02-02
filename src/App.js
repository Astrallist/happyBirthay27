import { useState, useEffect } from "react";
import Auth from "./Auth";
import WinterInvitation from "./WinterInvitation";
import { invitedUsers } from "./invitedUsers";
import "./App.css";
import SnowfallBackground from "./SnowfallBackground";
import Info from "./Info";
import "./SquidGameInvitation.css";

import useSound from "use-sound";
import bgMusic from "./sounds/background.mp3";
import clickSound_X from "./sounds/X.mp3";
import clickSound_O from "./sounds/O.mp3";

import leaderImg from "./images/leader.gif";
import leaderNoneImg from "./images/leader_none.gif";

function App() {
  const [user, setUser] = useState(null);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [hasDeclined, setHasDeclined] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [imageLeader, setImageLeader] = useState(null);

  // Хуки для звуков
  const [playBgMusic, { stop: stopBgMusic }] = useSound(bgMusic, {
    volume: 0.3,
    loop: true,
    interrupt: true,
    onload: () => console.log("Фоновая музыка загружена"),
    onerror: (error) => console.error("Ошибка загрузки фоновой музыки:", error),
  });

  const [playClickX] = useSound(clickSound_X, {
    volume: 0.7,
    onload: () => console.log("Звук X загружен"),
    onerror: (error) => console.error("Ошибка загрузки звука X:", error),
  });

  const [playClickO] = useSound(clickSound_O, {
    volume: 0.7,
    onload: () => console.log("Звук O загружен"),
    onerror: (error) => console.error("Ошибка загрузки звука O:", error),
  });

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("eventGuest");
    const savedResponse = localStorage.getItem("eventResponse");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);

      try {
        const image = require(
          `/images/${parsedUser.firstName}_${parsedUser.lastName}.png`,
        );
        setUserImage(image);
      } catch (e) {
        console.error("Ошибка загрузки изображения:", e);
        setUserImage(null);
      }

      if (savedResponse === "confirmed") setHasConfirmed(true);
      if (savedResponse === "declined") setHasDeclined(true);
    }
  }, []);

  // Автовоспроизведение музыки после авторизации
  useEffect(() => {
    if (user && !isMusicPlaying) {
      playBgMusic();
      setIsMusicPlaying(true);
    }
  }, [user, isMusicPlaying, playBgMusic]);

  const startMusic = () => {
    try {
      playBgMusic();
      setIsMusicPlaying(true);
    } catch (error) {
      console.error("Ошибка воспроизведения:", error);
      setIsMusicPlaying(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    try {
      const image = require(
        `./images/${userData.firstName}_${userData.lastName}.png`,
      );

      setImageLeader(userData.status === "VISITOR" ? leaderNoneImg : leaderImg);

      setUserImage(image);
    } catch (e) {
      console.error("Ошибка загрузки изображения:", e);
      setUserImage(null);
    }
    localStorage.setItem("eventGuest", JSON.stringify(userData));

    // Запускаем музыку через setTimeout, чтобы дать браузеру время на обработку клика
    setTimeout(startMusic, 100);
  };

  const handleConfirm = () => {
    playClickO(); // Звук при подтверждении
    setHasConfirmed(true);
    localStorage.setItem("eventResponse", "confirmed");
  };

  const handleDecline = () => {
    playClickX(); // Звук при отказе
    setHasDeclined(true);
    localStorage.setItem("eventResponse", "declined");
    setTimeout(() => {
      handleLogout();
    }, 3000);
  };

  const handleLogout = () => {
    playClickX();
    stopBgMusic(); // Останавливаем музыку при выходе
    setIsMusicPlaying(false);
    setUser(null);
    setUserImage(null);
    setHasConfirmed(false);
    setHasDeclined(false);
    localStorage.removeItem("eventGuest");
    localStorage.removeItem("eventResponse");
  };

  // Функция для ручного управления музыкой
  const toggleMusic = () => {
    if (isMusicPlaying) {
      stopBgMusic();
    } else {
      playBgMusic();
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  return (
    <div className="App">
      <SnowfallBackground />

      {/* Кнопка управления музыкой */}
      {user && (
        <button
          onClick={toggleMusic}
          className="music-toggle"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
            background: "rgba(0,0,0,0.5)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            cursor: "pointer",
            fontSize: "20px",
          }}
        >
          {isMusicPlaying ? "🔇" : "🔊"}
        </button>
      )}

      {user ? (
        hasConfirmed ? (
          // ЭКРАН ПОСЛЕ ПОДТВЕРЖДЕНИЯ (детали мероприятия)
          <div className="winter-container">
            <div className="invitation-header">
              <h1>Отлично, ты в игре, {user.firstName}!</h1>
              <p>Жду тебя на празднике! Вот все детали:</p>

              {userImage && (
                <div className="user-avatar">
                  <img
                    src={userImage}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                </div>
              )}
            </div>

            <div className="event-details winter-event-details">
              <div className="detail-card">
                <div className="detail-icon"></div>
                <div className="detail-content">
                  <h3>Дата и время</h3>
                  <p>
                    <strong>14 февраля 2026</strong>
                  </p>
                  <p>
                    Начало: <strong>~15:00</strong>
                  </p>
                </div>
              </div>

              <div className="detail-card">
                <div className="detail-icon"></div>
                <div className="detail-content">
                  <h3>Место проведения</h3>
                  <p>
                    <strong>Запад Москвы</strong>
                  </p>
                  <p>
                    Точный адрес будет отправлен
                    <br />
                    ближе к дате мероприятия
                  </p>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#B0E0E6",
                      marginTop: "0.5rem",
                    }}
                  >
                    ~15 минут от метро
                  </p>
                </div>
              </div>

{/*
              <div className="detail-card">
                <div className="detail-icon"></div>
                <div className="detail-content">
                  <h3>Программа</h3>
                  <p>• Игра "Самый умный" с твоими темами</p>
                  <p>• Музыкальная часть</p>
                  <p>• Угощения и напитки</p>
                  <p>• Общение и веселье</p>
                </div>
              </div>
              */}

              <div className="detail-card">
                <div className="detail-icon"></div>
                <div className="detail-content">
                  <h3>Дресс-код</h3>
                  <p>
                    <strong>"То что некуда надеть"</strong>
                  </p>
                  <p> Всё что угодно, одежда которая тебе уже мала, вечерние платья для ковровой дорожки, новая одежда которая была куплена и невыгулена.</p>
                  <p>• Для праздника: то что некуда надеть</p>
                  <p>• Бассейн: купальник/плавки <strong>+шлепки</strong></p>
                </div>
              </div>

              {/*<div className="detail-card">
                <div className="detail-icon"></div>
                <div className="detail-content">
                  <h3>Что с собой</h3>
                  <p>• Хорошее настроение!</p>
                  <p>• Идеи для именинника приветствуются</p>
                  <p>• Сменная обувь</p>
                  <p>• Пожелания и улыбки</p>
                </div>
              </div>*/}

              {/*<div className="detail-card highlight">
                <div className="detail-icon"></div>
                <div className="detail-content">
                  <h3>Важная информация</h3>
                  <p>Подтверждение присутствия и все ответы сохранены.</p>
                  <p>Организатор свяжется с тобой для уточнения деталей.</p>
                  <p
                    style={{
                      marginTop: "1rem",
                      fontStyle: "italic",
                      color: "#6ec6ff",
                    }}
                  >
                    Спасибо, что заполнил анкету! Твои ответы помогут сделать
                    праздник лучше.
                  </p>
                </div>
              </div>*/}
            </div>

            <div className="action-buttons">
              <button
                className="confirm-btn"
                onClick={() => {
                  // Копируем детали в буфер
                  const details = `Детали ДР 2025:\nДата: 14 февраля ~15:00\nМесто: Запад Москвы\nДресс-код: удобный/праздничный`;
                  navigator.clipboard
                    .writeText(details)
                    .then(() => alert("Детали скопированы в буфер!"))
                    .catch(() => alert("Не удалось скопировать"));
                }}
                style={{ marginRight: "1rem" }}
              >
                📋 Скопировать детали
              </button>

              <button className="decline-btn" onClick={handleLogout}>
                Выйти
              </button>
            </div>

            <div
              style={{
                marginTop: "2rem",
                padding: "1rem",
                background: "rgba(110, 198, 255, 0.1)",
                borderRadius: "10px",
                fontSize: "0.9rem",
                color: "#B0E0E6",
                textAlign: "center",
              }}
            >
              <p>
                <strong>Зимний день рождения 2026(27)</strong>
              </p>
              <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                По всем вопросам обращайся к организатору
              </p>
            </div>
          </div>
        ) : hasDeclined ? (
<></>
        ) : hasDeclined ? (
          <div className="squid-game-container">
            <div className="declined-message">
              <h2>
                Очень жаль, что вы не сможете присоединиться, {user.firstName}.
              </h2>
              <p>Вы будете перенаправлены через 3 секунды...</p>
            </div>
          </div>
        ) : (
          <WinterInvitation
            user={user}
            onConfirm={handleConfirm}
            onDecline={handleDecline}
            userImage={userImage}
          />
        )
      ) : (
        <Auth onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
