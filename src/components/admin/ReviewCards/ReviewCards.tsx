import { useState, useEffect } from "react";
import ReviewCard from "../../common/Card/AdminCards/ReviewCard";
import styles from "./ReviewCards.module.scss";
import { heroesApi, ApiError } from "../../../services/api/heroes";
import type { CardData } from "../../../types/card.types";
import Button from "../../common/Button/Button";

export default function ReviewCards() {
    const [cards, setCards] = useState<CardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCards = async () => {
            setLoading(true);
            setError(null);
            try {
                // Карточки на модерации: published = false. heroesApi.list
                // фильтрует на сервере и возвращает Hero[] с заполненным cardData.
                const heroes = await heroesApi.list({ published: false, perPage: 100 });
                const cardsData: CardData[] = heroes
                    .map((hero) => hero.cardData)
                    .filter((card): card is CardData => Boolean(card));
                setCards(cardsData);
            } catch (err) {
                const msg = err instanceof ApiError
                    ? `Ошибка сервера: ${err.message}`
                    : 'Не удалось загрузить карточки на модерацию';
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, []);

    if (loading) {
        return (
            <div className={styles.reviewCards}>
                <div className={styles.reviewCards__loading}>
                    <p>Загрузка...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.reviewCards}>
                <div className={styles.reviewCards__error}>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (cards.length === 0) {
        return (
            <div className={styles.reviewCards}>
                <div className={styles.reviewCards__empty}>
                    <p>Нет карточек на модерации</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.reviewCards}>
            <div className={styles.reviewCards__titleContainer}>
                <h2 className={styles.reviewCards__title}>Просмотр</h2>
                <Button className={styles.reviewCards__exitButton}>Выйти</Button>
            </div>
            <div className={styles.reviewCards__list}>
                <ReviewCard cards={cards} />
            </div>
        </div>
    );
}
