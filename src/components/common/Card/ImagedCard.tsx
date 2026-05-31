import styles from "./ImagedCard.module.scss"
import type { Hero } from "../../../types/hero.types";
import { Link } from "react-router-dom";

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
                            <Link to={`/hero/${hero.id}`} className={styles.cardLink}>
                                <p className={styles.imagedCard__name}>{hero.name}</p>
                                <span className={styles.imagedCard__date}>
                                    {formatDate(hero.dateOfBirth)}&nbsp;-&nbsp;{formatDate(hero.dateOfDeath)}
                                </span>
                                <p className={styles.imagedCard__range}>{hero.range}</p>
                            </Link>
                        </div>

                        <div className={styles.imagedCard__buttonContainer}>
                            <Link className={styles.imagedCard__button} to={`/hero/${hero.id}`}>
                                Подробнее
                            </Link>
                        </div>
                    </div>

                )
            })}
        </>
    )
}
