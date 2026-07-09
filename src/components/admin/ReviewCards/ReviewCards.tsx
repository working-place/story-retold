// components/admin/ReviewCards/ReviewCards.tsx
import { useState, useEffect } from "react";
import ReviewCard from "../../common/Card/AdminCards/ReviewCard";
import styles from "./ReviewCards.module.scss";
import { heroesApi } from "../../../services/api/heroes";
import type { CardData } from "../../../types/card.types";
import type { CardResponse, CardShowResponse } from "../../../types/api.types";
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
                // CardShowResponse = CardResponse[] (массив)
                const response: CardShowResponse = await heroesApi.show({
                    published: false,
                    perPage: 100,
                });

                // response уже является массивом CardResponse[]
                const items: CardResponse[] = response;

                const cardsData: CardData[] = items.map((item: CardResponse) => ({
                    id: item.id,
                    dateBirth: item.dateBirth,
                    dateDeath: item.dateDeath || '',
                    placeBirth: item.placeBirth,
                    name: item.name,
                    nameAndClass: item.nameAndClass || '',
                    email: item.email || '',
                    description: item.description,
                    militaryRank: item.militaryRank || '',
                    placeService: item.placeService || '',
                    placeConscription: item.placeConscription || '',
                    chapter: item.chapter,
                    photoHero: item.photoHero?.url || null,
                    published: item.published,
                    createdAt: item.created_at,
                    updatedAt: item.updated_at,
                    additionalCardImages: item.additionalImages?.map((img) => ({
                        id: img.id,
                        card_id: item.id,
                        image: img.url,
                        created_at: '',
                        updated_at: '',
                    })) || [],
                }));
                setCards(cardsData);
            } catch (err) {
                console.error('Ошибка загрузки карточек на модерацию:', err);
                setError('Не удалось загрузить карточки на модерацию');
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
