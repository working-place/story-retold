import styles from "./ImagedCard.module.scss"
import type { Hero } from "../../../types/hero.types";

interface ImagedCardProps {
    heroes?: Hero[];
}

export default function ImagedCard({ heroes = [] }: ImagedCardProps) {
    const formatDate = (dateString: string | number | Date | null) => {
        if (!dateString) return 'неизвестно';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <>
            {heroes.map((hero) => {
                return (
                    <div
                        key={hero.id}
                        className={styles.imagedCard}>
                        <img
                            src={hero.img}
                            alt={hero.name}
                            className={styles.imagedCard__img} />

                        <div className={styles.imagedCard__infoContainer}>
                            <p className={styles.imagedCard__name}>{hero.name}</p>
                            <span className={styles.imagedCard__date}>
                                {formatDate(hero.dateOfBirth)}&nbsp;-&nbsp;{formatDate(hero.dateOfDeath)}
                            </span>
                            <p className={styles.imagedCard__range}>{hero.range}</p>
                        </div>

                        <div className={styles.imagedCard__buttonContainer}>
                            <button className={styles.imagedCard__button}>Подробнее</button>
                        </div>
                    </div>
                )
            })}
        </>
    )
}
