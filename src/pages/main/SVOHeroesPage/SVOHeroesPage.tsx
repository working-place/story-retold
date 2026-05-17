import ImagedCard from "../../../components/common/Card/ImagedCard";
import TextCard from "../../../components/common/Card/TextCard";
import MainLayout from "../../../components/layout/MainLayout/MainLayout";
import styles from "./SVOHeroesPage.module.scss"

interface SVOHeroesPageProps {
    text?: string | undefined;
}

export default function SVOHeroesPage({ text }: SVOHeroesPageProps) {

    return (
        <MainLayout>
            <div className={styles.heroesPage}>

                <section className={styles.title}>
                    <p className={styles.title__path}>Путь: SVO HeroesPage {text}</p>
                </section>

                <section className={styles.filter}>
                    <h2 className={styles.filter__title}>Место для фильтра</h2>
                </section>

                <section className={styles.imagedCards}>
                    <ImagedCard />
                </section>

                <section className={styles.textCards}>
                    <TextCard />
                </section>
            </div>
        </MainLayout>
    )
}
