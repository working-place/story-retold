import ImagedCardAdmin from "../../common/Card/AdminCards/ImagedCardAdmin";
import styles from "./HeroAllCards.module.scss"
import type { Hero } from "../../../types/card.types";
import { useEffect, useMemo, useState } from "react";
import { heroesApi, ApiError } from "../../../services/api/heroes";
import TextCardAdmin from "../../common/Card/AdminCards/TextCardAdmin";

interface HeroAllCardsProps {
    type?: 'svo' | 'gpw';
    title?: string;
}

export default function HeroAllCards({ type = 'svo', title = 'Герои СВО' }: HeroAllCardsProps) {
    const [filteredHeroes, setFilteredHeroes] = useState<Hero[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [allHeroes, setAllHeroes] = useState<Hero[]>([]);

    const heroesWithImage: Hero[] = useMemo(() => {
        return filteredHeroes.filter((hero: Hero) => hero.img && hero.img.trim() !== '');
    }, [filteredHeroes]);

    const heroesWithoutImage: Hero[] = useMemo(() => {
        return filteredHeroes.filter((hero: Hero) => !hero.img || hero.img.trim() === '');
    }, [filteredHeroes]);

    const handleDelete = (deletedId: number) => {
        setFilteredHeroes(prev => prev.filter(hero => hero.id !== deletedId));
        setAllHeroes(prev => prev.filter(hero => hero.id !== deletedId));
    };

    useEffect(() => {
        const fetchHeroes = async (): Promise<void> => {
            setLoading(true);
            setError(null);

            try {
                const heroes = await heroesApi.listPublished(type);
                setAllHeroes(heroes);
                setFilteredHeroes(heroes);
                if (heroes.length === 0) {
                    setError(`Не удалось загрузить данные о героях (${title})`);
                }
            } catch (err) {
                const msg = err instanceof ApiError
                    ? `Ошибка сервера: ${err.message}`
                    : 'Не удалось загрузить данные о героях';
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchHeroes();
    }, [type, title]);

    if (loading) {
        return (
            <div className={styles.heroesPage}>
                <div className={styles.loading}>
                    <p>Загрузка...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.heroesPage}>
                <div className={styles.error}>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {filteredHeroes.length !== allHeroes.length && (
                <span className={styles.title__filterInfo}>
                    {" "}· Найдено: {filteredHeroes.length}
                </span>
            )}

                {heroesWithImage.length > 0 && (
                    <ImagedCardAdmin heroes={heroesWithImage} onDelete={handleDelete} />
                )}
                {heroesWithoutImage.length > 0 && (
                    <TextCardAdmin heroes={heroesWithoutImage} onDelete={handleDelete} />
                )}
        </div>
    );
}
