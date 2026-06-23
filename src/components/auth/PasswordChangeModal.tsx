import { useState } from 'react';
import styles from './PasswordChangeModal.module.scss';
import { authApi } from '../../services/api/auth';

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PasswordChangeModal({ isOpen, onClose }: PasswordChangeModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await authApi.sendRestoreCode({ email });
      setIsSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось отправить запрос. Попробуйте позже.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <h2 className={styles.title}>Изменить пароль</h2>

        {!isSuccess ? (
          <div className={styles.form}>
            <input
              type="email"
              className={styles.input}
              placeholder="Введите email от учетной записи"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className={styles.input}
              placeholder="Новый пароль"
              disabled
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
            />
            {error && <div className={styles.error}>{error}</div>}
            <button
              className={styles.submitBtn}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Отправка...' : 'Подтвердите'}
            </button>
          </div>
        ) : (
          <div className={styles.success}>
            <p>
              На указанный email отправлена ссылка для смены пароля! Подтвердите смену пароля в электронной почте, чтобы начать пользоваться сервисом.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}