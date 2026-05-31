import { useMemo, useState } from "react";
import ImagedCard from "../../../components/common/Card/ImagedCard";
import TextCard from "../../../components/common/Card/TextCard";
import Filter from "../../../components/common/Filter";
import MainLayout from "../../../components/layout/MainLayout/MainLayout";
import styles from "./HeroesPage.module.scss";
import type { Hero } from "../../../types/hero.types";
import { heroesData } from "../../../data/data";
import type { HeroesPageProps } from "../../../types/hero.types";

export default function SVOHeroesPage({ path, text }: HeroesPageProps) {

    const ussrHeroes = useMemo(() => {
        return heroesData.filter(hero => hero.type === 'USSR');
    }, []);

    const [filteredHeroes, setFilteredHeroes] = useState<Hero[]>(ussrHeroes);
    const currentPath = path || "Герои СССР/Все Герои";

    const handleSearchResults = (results: Hero[]) => {
        setFilteredHeroes(results);
    };

    const heroesWithImage = useMemo(() => {
        return filteredHeroes.filter(hero => hero.img && hero.img.trim() !== '');
    }, [filteredHeroes]);

    const heroesWithoutImage = useMemo(() => {
        return filteredHeroes.filter(hero => !hero.img || hero.img.trim() === '');
    }, [filteredHeroes]);

    return (
        <MainLayout>
            <div className={styles.heroesPage}>

                <section className={styles.title}>
                    <p className={styles.title__path}>
                        {currentPath} {text && `| ${text}`}
                        {filteredHeroes.length !== ussrHeroes.length && (
                            <span className={styles.title__filterInfo}>
                                {" "}· Найдено: {filteredHeroes.length}
                            </span>
                        )}
                    </p>
                </section>

                <section className={styles.filter}>
                    <Filter
                        title="Герои СВО"
                        heroes={ussrHeroes}
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
