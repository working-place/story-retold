import styles from "./TextCard.module.scss"
import type { Hero } from "../../../types/hero.types";
import { Link } from "react-router-dom";

interface TextCardProps {
    heroes?: Hero[];
}

export default function TextCard({ heroes = [] }: TextCardProps) {
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
                        className={styles.textCard}>

                        <div className={styles.textCard__imgContainer}>
                            <img
                                src="/star.png"
                                alt='Звезда'
                                className={styles.textCard__img} />
                        </div>
                        <div className={styles.textCard__infoContainer}>
                            <Link to={`/hero/${hero.id}`} className={styles.cardLink}>
                                <p className={styles.textCard__name}>{hero.name}</p>
                                <span className={styles.textCard__date}>
                                    {formatDate(hero.dateOfBirth)}&nbsp;-&nbsp;{formatDate(hero.dateOfDeath)}
                                </span>
                                <p className={styles.textCard__range}>{hero.range}</p>
                            </Link>
                        </div>
                        <div className={styles.textCard__buttonContainer}>
                            <Link className={styles.textCard__button} to={`/hero/${hero.id}`}>
                                Подробнее
                            </Link>
                        </div>
                    </div>
                )
            })}
        </>
    )
}
