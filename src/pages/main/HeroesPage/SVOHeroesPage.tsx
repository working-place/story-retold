import { useMemo, useState, useEffect, useCallback } from "react";
import ImagedCard from "../../../components/common/Card/ImagedCard";
import TextCard from "../../../components/common/Card/TextCard";
import Filter from "../../../components/common/Filter";
import MainLayout from "../../../components/layout/MainLayout/MainLayout";
import styles from "./HeroesPage.module.scss";
import type { Hero } from "../../../types/card.types";
import { getHeroes } from "../../../services/api/heroes";

interface SVOHeroesPageProps {
    path?: string;
    text?: string;
}

export default function SVOHeroesPage({ path, text }: SVOHeroesPageProps) {
    const [allHeroes, setAllHeroes] = useState<Hero[]>([]);
    const [filteredHeroes, setFilteredHeroes] = useState<Hero[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const currentPath: string = path || "Герои СВО/Все Герои";

    useEffect(() => {
        const fetchHeroes = async (): Promise<void> => {
            setLoading(true);
            setError(null);
            const heroes = await getHeroes('svo');
            console.log('=== SVOHeroesPage DEBUG ===');
            console.log('Heroes received:', heroes.length);
            console.log('First hero:', heroes[0]);
            console.log('Hero with image check:', heroes.filter(h => h.img && h.img.trim() !== '').length);

            if (heroes.length > 0) {
                setAllHeroes(heroes);
                setFilteredHeroes(heroes);
            } else {
                setError('Не удалось загрузить данные о героях');
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
                <div className={styles.heroesPage}>
                    <div className={styles.error}>
                        <p>{error}</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    console.log('=== ALL HEROES WITH IMAGES ===');
    console.log(heroesWithImage.map(h => ({ id: h.id, name: h.name, img: h.img })));

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
                        title="Герои СВО"
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
            </div>
        </MainLayout>
    );
}
