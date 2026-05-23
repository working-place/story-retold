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

    const svoHeroes = useMemo(() => {
        return heroesData.filter(hero => hero.type === 'SVO');
    }, []);

    const [filteredHeroes, setFilteredHeroes] = useState<Hero[]>(svoHeroes);
    const currentPath = path || "Герои СВО/Все Герои";

    const handleSearchResults = (results: Hero[]) => {
        setFilteredHeroes(results);
    };

    return (
        <MainLayout>
            <div className={styles.heroesPage}>

                <section className={styles.title}>
                    <p className={styles.title__path}>
                        {currentPath} {text && `| ${text}`}
                        {filteredHeroes.length !== svoHeroes.length && (
                            <span className={styles.title__filterInfo}>
                                {" "}· Найдено: {filteredHeroes.length}
                            </span>
                        )}
                    </p>
                </section>

                <section className={styles.filter}>
                    <Filter
                        title="Герои СВО"
                        heroes={svoHeroes}
                        onSearchResults={handleSearchResults}
                    />
                </section>

                <section className={styles.imagedCards}>
                    <ImagedCard heroes={filteredHeroes} />
                </section>

                <section className={styles.textCards}>
                    <TextCard heroes={filteredHeroes} />
                </section>
            </div>
        </MainLayout>
    );
}
