// src/pages/auth/ForgotPasswordPage.tsx
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../services/api/auth';
import { Input } from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import styles from './ForgotPasswordPage.module.scss';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      await authApi.sendRestoreCode({ email });
      setMessage('Инструкция по восстановлению пароля отправлена на ваш email.');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось отправить запрос. Попробуйте позже.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.forgotPage}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1>Восстановление пароля</h1>

        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {message && <div className={styles.message}>{message}</div>}
        {error && <div className={styles.error}>{error}</div>}

        <Button type="submit" disabled={loading} fullWidth>
          {loading ? 'Отправка...' : 'Отправить код'}
        </Button>

        <div className={styles.links}>
          <Link to="/login">Вернуться к входу</Link>
        </div>
      </form>
    </div>
  );
}