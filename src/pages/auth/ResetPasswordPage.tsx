import { useState, type FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../services/api/auth';
import { Input } from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import styles from './ResetPasswordPage.module.scss';

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (password !== passwordConfirmation) {
      setError('Пароли не совпадают');
      return;
    }
    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (!token) throw new Error('Недействительная ссылка восстановления');
      await authApi.restorePassword({ token, password, password_confirmation: passwordConfirmation });
      navigate('/login');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось восстановить пароль. Попробуйте позже.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.resetPage}>
      <div className={styles.card}>
        <img src="/logo.png" alt="Логотип" className={styles.logo} />
        <h1 className={styles.title}>Установка нового пароля</h1>
        <p className={styles.subtitle}>Введите и подтвердите новый пароль</p>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <Input
            type="password"
            label="Новый пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            size="medium"
            labelPosition="top"
            variant="_primary"
          />

          <Input
            type="password"
            label="Подтвердите пароль"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            size="medium"
            labelPosition="top"
            variant="_primary"
          />

          {error && <div className={styles.error}>{error}</div>}

          <Button type="submit" disabled={loading} fullWidth>
            {loading ? 'Сохранение...' : 'Сохранить пароль'}
          </Button>

          <div className={styles.links}>
            <Link to="/login">← Вернуться к входу</Link>
          </div>
        </form>
      </div>
    </div>
  );
}