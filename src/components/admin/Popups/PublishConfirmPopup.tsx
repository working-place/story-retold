// components/common/Popup/PublishConfirmPopup.tsx
import styles from './PublishConfirmPopup.module.scss';
import Button from '../../common/Button/Button';

interface PublishConfirmPopupProp {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  heroName?: string;
  isLoading?: boolean;
}

export default function PublishConfirmPopup({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: PublishConfirmPopupProp) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.confirmPopup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.content}>
          <h3 className={styles.confirmPopup__title}>
            Вы уверены что хотите опубликовать карточку?
          </h3>
          <div className={styles.confirmPopup__buttons}>
            <Button
              type="button"
              className={styles.confirmPopup__editButton}
              onClick={onClose}
              disabled={isLoading}
            >
              Редактировать
            </Button>
            <Button
              type="button"
              className={styles.confirmPopup__publishButton}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Публикация...' : 'Опубликовать'}
            </Button>
          </div>
        </div>
        <button
          className={styles.confirmPopup__closeButton}
          onClick={onClose}
          aria-label="Закрыть"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.77031 0.583721C0.924856 0.428909 1.16237 0.369891 1.43061 0.419649C1.69884 0.469408 1.97582 0.623867 2.20062 0.849049L19.1524 17.83C19.3772 18.0552 19.5314 18.3327 19.581 18.6014C19.6307 18.8701 19.5718 19.108 19.4173 19.2628C19.2627 19.4176 19.0252 19.4766 18.757 19.4269C18.4887 19.3771 18.2117 19.2227 17.9869 18.9975L1.03518 2.01649C0.810387 1.79131 0.656193 1.51385 0.60652 1.24516C0.556847 0.976459 0.615764 0.738534 0.77031 0.583721Z" fill="#1A1A1A" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2298 0.736591C19.3843 0.891404 19.4432 1.12933 19.3936 1.39803C19.3439 1.66672 19.1897 1.94418 18.9649 2.16936L2.01314 19.1503C1.78835 19.3755 1.51137 19.53 1.24313 19.5797C0.974898 19.6295 0.737383 19.5705 0.582837 19.4157C0.428291 19.2609 0.369374 19.0229 0.419046 18.7542C0.468719 18.4855 0.622914 18.2081 0.847709 17.9829L17.7995 1.00192C18.0243 0.776737 18.3013 0.622277 18.5695 0.572519C18.8377 0.52276 19.0752 0.581778 19.2298 0.736591Z" fill="#1A1A1A" />
          </svg>
        </button>
        <img className={styles.confirmPopup__vector110} src="/vector-110.png" alt="" />
        <img className={styles.confirmPopup__vector111} src="/vector-111.png" alt="" />
      </div>
    </div>
  );
}
