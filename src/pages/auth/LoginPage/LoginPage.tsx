import { useState, type KeyboardEvent } from 'react';
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

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/admin-heroes');
    } catch (err) {
      let userMessage = 'Ошибка входа. Проверьте email и пароль.';
      if (err instanceof Error) {
        const msg = err.message.toLowerCase();
        if (
          msg.includes('validation') ||
          msg.includes('min') ||
          msg.includes('string') ||
          msg.includes('email') ||
          msg.includes('password') ||
          msg.includes('неверный') ||
          msg.includes('неправильный')
        ) {
          userMessage = 'Ошибка входа. Проверьте email и пароль.';
        } else {
          userMessage = err.message;
        }
      }
      setError(userMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit();
    }
  };

  return (
    <div className={styles.loginPage}>
      <img src="/logo.png" alt="Логотип" className={styles.logo} />

      <div className={styles.panelLeft}>
        <div className={styles.loginCard}>
          <h2 className={styles.loginTitle}>Вход в систему - Администратор</h2>
          <div className={styles.loginCardInner}>
            <h3 className={styles.welcomeText}>Добро пожаловать!</h3>

            <form
              className={styles.form}
              onSubmit={(e) => e.preventDefault()}
              noValidate
            >
              <input
                type="email"
                placeholder="Email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                required
              />
              <input
                type="password"
                placeholder="Пароль"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                required
              />

              {error && <div className={styles.error}>{error}</div>}

              <Button
                type="button"
                className={styles.submitBtn}
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? 'Вход...' : 'Войти'}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className={styles.forgotLink}
                onClick={() => setIsModalOpen(true)}
              >
                Забыли пароль?
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className={styles.panelRight}></div>

      <PasswordChangeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}