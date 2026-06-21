import Button from "../../common/Button/Button";
import styles from "./DeleteConfirmPopup.module.scss";

interface DeleteConfirmPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    heroName?: string;
    isLoading?: boolean;
}

export default function DeleteConfirmPopup({
    isOpen,
    onClose,
    onConfirm,
    heroName,
    isLoading = false,
}: DeleteConfirmPopupProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Закрыть"
                >
                    ×
                </button>

                <div className={styles.content}>
                    <h3 className={styles.title}>
                        Вы уверены, что хотите удалить карточку?
                    </h3>
                    {heroName && (
                        <p className={styles.heroName}>
                            "{heroName}"
                        </p>
                    )}
                    <p className={styles.warning}>
                        Это действие невозможно отменить. Все данные карточки будут безвозвратно удалены.
                    </p>

                    <div className={styles.buttons}>
                        <Button
                            type="button"
                            className={styles.cancelButton}
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Отмена
                        </Button>
                        <Button
                            type="button"
                            className={styles.deleteButton}
                            onClick={onConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Удаление...' : 'Удалить'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
