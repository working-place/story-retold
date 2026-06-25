import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import PasswordChangeModal from '../../../components/auth/PasswordChangeModal';
import styles from './LoginPage.module.scss';
import Button from '../../../components/common/Button/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  e.stopPropagation(); // предотвращает всплытие

  setError('');
  setLoading(true);

  try {
    await login({ email, password });
    navigate('/admin-heroes');
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Ошибка входа. Проверьте email и пароль.';
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={styles.loginPage}>
      {/* Логотип в левом верхнем углу */}
      <img src="/logo.png" alt="Логотип" className={styles.logo} />

      {/* Левая панель с формой */}
      <div className={styles.panelLeft}>
        <div className={styles.loginCard}>
          <h2 className={styles.loginTitle}>Вход в систему - Администратор</h2>
          <div className={styles.loginCardInner}>
          <h3 className={styles.welcomeText}>Добро пожаловать!</h3>

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              placeholder="Email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Пароль"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <div className={styles.error}>{error}</div>}

            <Button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </Button>

            <Button
              type="button"
              variant='ghost'
              className={styles.forgotLink}
              onClick={() => setIsModalOpen(true)}
            >
              Забыли пароль?
            </Button>
          </form>
          </div>
        </div>
      </div>

      {/* Правая панель с фоновой картинкой */}
      <div className={styles.panelRight}></div>

      <PasswordChangeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}