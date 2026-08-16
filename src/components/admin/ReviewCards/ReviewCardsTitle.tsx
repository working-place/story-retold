import { IconExitMobile } from '../../../assets/images/icons/IconExitMobile';
import Button from '../../common/Button/Button';
import styles from './ReviewCards.module.scss';

interface ReviewCardsTitleProps {
    title?: string;
    onExit?: () => void;
}

export default function ReviewCardsTitle({
    title = "Просмотр",
    onExit
}: ReviewCardsTitleProps) {
    return (
        <div className={styles.reviewCards__titleContainer}>
            <h2 className={styles.reviewCards__title}>{title}</h2>
            <Button
                className={styles.reviewCards__exitButton}
                onClick={onExit}
            >
                Выйти
            </Button>
            <Button
                className={styles.reviewCards__exitButtonMobile}
                onClick={onExit}
            >
                <IconExitMobile />
            </Button>
        </div>
    );
}
