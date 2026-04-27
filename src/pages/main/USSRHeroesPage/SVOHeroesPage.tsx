import MainLayout from "../../../components/layout/MainLayout/MainLayout";
import styles from "./HeroesPage.module.scss"

interface SVOHeroesPageProps {
    text?: string | undefined;
}

export default function SVOHeroesPage({ text }: SVOHeroesPageProps) {

    return (
        <MainLayout>
            <div className={styles.heroesPage}>
                <h1>SVO HeroesPage {text}</h1>
            </div>
        </MainLayout>
    )
}
