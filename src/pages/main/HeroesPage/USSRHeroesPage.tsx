import { useMemo, useState, useEffect, useCallback } from "react";
import ImagedCard from "../../../components/common/Card/ImagedCard";
import TextCard from "../../../components/common/Card/TextCard";
import Filter from "../../../components/common/Filter";
import MainLayout from "../../../components/layout/MainLayout/MainLayout";
import styles from "./HeroesPage.module.scss";
import type { Hero } from "../../../types/card.types";
import { getHeroes } from "../../../services/api/heroes";

interface USSRHeroesPageProps {
    path?: string;
    text?: string;
}

export default function USSRHeroesPage({ path, text }: USSRHeroesPageProps) {
    const [allHeroes, setAllHeroes] = useState<Hero[]>([]);
    const [filteredHeroes, setFilteredHeroes] = useState<Hero[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const currentPath: string = path || "Герои СССР/Все Герои";

    useEffect(() => {
        const fetchHeroes = async (): Promise<void> => {
            setLoading(true);
            setError(null);
            const heroes = await getHeroes('gpw');

            if (heroes && heroes.length > 0) {
                setAllHeroes(heroes);
                setFilteredHeroes(heroes);
            } else {
                setError('В базе данных нет героев');
            }
            setLoading(false);
        };

        fetchHeroes();
    }, []);

    const handleSearchResults = useCallback((results: Hero[]): void => {
        setFilteredHeroes(results);
    }, []);

    const heroesWithImage: Hero[] = useMemo(() => {
        return filteredHeroes.filter((hero: Hero) => hero.img && hero.img.trim() !== '');
    }, [filteredHeroes]);

    const heroesWithoutImage: Hero[] = useMemo(() => {
        return filteredHeroes.filter((hero: Hero) => !hero.img || hero.img.trim() === '');
    }, [filteredHeroes]);

    const hasHeroes: boolean = heroesWithImage.length > 0 || heroesWithoutImage.length > 0;

    if (loading) {
        return (
            <MainLayout>
                <div className={styles.heroesPage}>
                    <div className={styles.loading}>
                        <p>Загрузка...</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <div className={styles.error}>
                    <div className={styles.noHeroes}>
                        <p>{error}</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (!hasHeroes && !loading) {
        return (
            <MainLayout>
                <div className={styles.heroesPage}>
                    <div className={styles.title}>
                        <p className={styles.title__path}>
                            {currentPath} {text && `| ${text}`}
                        </p>
                    </div>
                    <div className={styles.noHeroes}>
                        <p>Нет данных о героях</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className={styles.heroesPage}>
                <section className={styles.title}>
                    <p className={styles.title__path}>
                        {currentPath} {text && `| ${text}`}
                        {filteredHeroes.length !== allHeroes.length && (
                            <span className={styles.title__filterInfo}>
                                {" "}· Найдено: {filteredHeroes.length}
                            </span>
                        )}
                    </p>
                </section>

                <section className={styles.filter}>
                    <Filter
                        title="Герои СССР"
                        heroes={allHeroes}
                        onSearchResults={handleSearchResults}
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

                {filteredHeroes.length === 0 && allHeroes.length > 0 && (
                    <div className={styles.noResults}>
                        <p>По вашему запросу ничего не найдено</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
