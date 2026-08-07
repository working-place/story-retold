import styles from "./ReviewCard.module.scss";
import type { CardData } from "../../../../types/card.types";
import { Link } from "react-router-dom";
import { buildImageUrl } from "../../../../services/api/api";

interface ReviewCardProps {
    cards?: CardData[];
    onPublish?: (id: number) => void;
    onDelete?: (id: number) => void;
}

export default function ReviewCard({
    cards = [],
}: ReviewCardProps) {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'неизвестно';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const getImageUrl = (path: string | null) => buildImageUrl(path);

    return (
        <>
            {cards.map((card) => {
                const hasImage = card.photoHero && card.photoHero.trim() !== '';

                return (
                    <div
                        key={card.id}
                        className={`${styles.reviewCard} ${!hasImage ? styles.reviewCard_noImage : ''}`}
                    >
                        <div className={styles.reviewCard__infoContainer}>
                            {/* Блок с изображением - показываем только если есть фото */}
                            {hasImage && (
                                <div className={styles.reviewCard__imageContainer}>
                                    <img
                                        src={getImageUrl(card.photoHero)}
                                        alt={card.name}
                                        className={styles.reviewCard__image}
                                    />
                                </div>
                            )}

                            <div className={styles.reviewCard__info}>
                                <h3 className={styles.reviewCard__name}>
                                    {card.name}
                                </h3>
                                <span className={styles.reviewCard__author}>
                                    Автор: {card.nameAndClass || 'не указан'}
                                </span>
                                <span className={styles.reviewCard__date}>
                                    Дата: {formatDate(card.createdAt)}
                                </span>
                            </div>
                        </div>

                        <div className={styles.reviewCard__actions}>
                            <Link
                                to={`/admin-heroes/edit/${card.id}`}
                                className={styles.reviewCard__button}
                            >
                                Перейти к редактированию
                            </Link>
                            <Link
                                to={`/admin-heroes/feedback?cardId=${card.id}`}
                                className={styles.reviewCard__button}
                            >
                                Направить комментарии
                            </Link>
                        </div>
                    </div>
                );
            })}
        </>
    );
}
