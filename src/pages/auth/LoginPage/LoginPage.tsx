// src/pages/auth/LoginPage/LoginPage.tsx
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Input } from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import styles from './LoginPage.module.scss';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/admin-heroes');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ошибка входа. Проверьте email и пароль.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Вход в админ-панель</h1>

        <Input
          type="email"
          label="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="on"
        />

        <Input
          type="password"
          label="Пароль"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="on"
        />

        {error && <div className={styles.error}>{error}</div>}

        <Button type="submit" disabled={loading} fullWidth>
          {loading ? 'Вход...' : 'Войти'}
        </Button>

        <div className={styles.links}>
          <Link to="/forgot-password">Забыли пароль?</Link>
        </div>
      </form>
    </div>
  );
}