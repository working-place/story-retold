import { useMemo, useState, useEffect, useCallback } from "react";
import ImagedCard from "../../../components/common/Card/ImagedCard";
import TextCard from "../../../components/common/Card/TextCard";
import Filter from "../../../components/common/Filter";
import Button from "../../../components/common/Button/Button";
import styles from "./HeroesPage.module.scss";
import type { Hero } from "../../../types/card.types";
import type { Chapter } from "../../../types/api.types";
import { heroesApi, ApiError } from "../../../services/api/heroes";

interface HeroesPageProps {
    chapter: Chapter;
    title: string;
}

export default function HeroesPage({ chapter, title }: HeroesPageProps) {
    const [allHeroes, setAllHeroes] = useState<Hero[]>([]);
    const [filteredHeroes, setFilteredHeroes] = useState<Hero[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdvancedMode, setIsAdvancedMode] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);

    useEffect(() => {
        const fetchHeroes = async (): Promise<void> => {
            setLoading(true);
            setError(null);
            try {
                const heroes = await heroesApi.listPublished(chapter);
                setAllHeroes(heroes);
                setFilteredHeroes(heroes);
            } catch (err) {
                setError(
                    err instanceof ApiError
                        ? `Ошибка сервера: ${err.message}`
                        : 'Не удалось загрузить данные о героях'
                );
            } finally {
                setLoading(false);
            }
        };

        void fetchHeroes();
    }, [chapter]);

    const handleSearchResults = useCallback((results: Hero[]): void => {
        setFilteredHeroes(results);
    }, []);

    const handleResetFilter = () => {
        setFilteredHeroes(allHeroes);
    };

    const heroesWithImage: Hero[] = useMemo(() => {
        return filteredHeroes.filter((hero: Hero) => hero.img && hero.img.trim() !== '');
    }, [filteredHeroes]);

    const heroesWithoutImage: Hero[] = useMemo(() => {
        return filteredHeroes.filter((hero: Hero) => !hero.img || hero.img.trim() === '');
    }, [filteredHeroes]);

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
        <div className={styles.heroesPage}>
            <section className={styles.filter}>
                <Filter
                    title={title}
                    heroes={allHeroes}
                    onSearchResults={handleSearchResults}
                    onModeChange={(mode) => {
                        setIsAdvancedMode(mode === "advanced");
                        if (mode === "advanced") {
                            setSearchPerformed(false);
                        }
                    }}
                    onSearchPerformed={() => setSearchPerformed(true)}
                />
            </section>

            {heroesWithImage.length > 0 && (
                <section className={styles.imagedCards}>
                    <ImagedCard heroes={heroesWithImage} />
                </section>
            )}

            {heroesWithoutImage.length > 0 && (
                <section className={styles.textCards}>
                    <TextCard heroes={heroesWithoutImage} />
                </section>
            )}

            {filteredHeroes.length === 0 && !(isAdvancedMode && !searchPerformed) && (
                <div className={styles.noResults}>
                    <p>{allHeroes.length === 0 ? 'Нет данных о героях' : 'По вашему запросу ничего не найдено'}</p>
                    {allHeroes.length > 0 && (
                        <Button className={styles.resetButton} onClick={handleResetFilter}>
                            Вернуться к поиску
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
