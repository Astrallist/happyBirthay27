
import { useState } from 'react';
import { invitedUsers } from './invitedUsers';
import './WinterInvitation.css'; // Используем зимние стили
import useSound from 'use-sound';
import clickSound_O from './sounds/O.mp3';

export default function Auth({ onLogin }) {
    const [playClick] = useSound(clickSound_O, { volume: 0.7 });
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: ''
    });
    const [error, setError] = useState('');
 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        playClick();

        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            setError('Введите имя и фамилию');
            return;
        }

        const invitedUser = invitedUsers.find(
            guest =>
                guest.firstName.toLowerCase() === formData.firstName.toLowerCase() &&
                guest.lastName.toLowerCase() === formData.lastName.toLowerCase()
        );

        if (invitedUser) {
            onLogin(invitedUser);
        } else {
            setError('Вас нет в списке приглашённых');
        }
    };

    return (
        <div className="winter-container">
            <div className="invitation-header">
                <h1>Приглашение на День Рождения</h1>
                <h2>Войдите в систему приглашений</h2>
            </div>
            
            <div className="question-form" style={{ maxWidth: '400px', margin: '0 auto' }}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="firstName">Имя:</label>
                        <input
                            id="firstName"
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            placeholder="Введите ваше имя"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="lastName">Фамилия:</label>
                        <input
                            id="lastName"
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            placeholder="Введите вашу фамилию"
                        />
                    </div>
                    
                    {error && (
                        <div className="submit-status error" style={{ marginBottom: '1rem' }}>
                            {error}
                        </div>
                    )}
                    
                    <button 
                        type="submit" 
                        className="confirm-btn"
                        style={{ width: '100%', marginTop: '1rem' }}
                    >
                        Войти в систему
                    </button>
                </form>
                
                <div style={{ marginTop: '2rem', color: '#B0E0E6', fontSize: '0.9rem' }}>
                    <p>Для доступа к приглашению введите имя и фамилию, указанные в приглашении.</p>
                </div>
            </div>
        </div>
    );
}
