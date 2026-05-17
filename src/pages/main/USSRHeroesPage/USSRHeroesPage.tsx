import MainLayout from "../../../components/layout/MainLayout/MainLayout";
import styles from "./USSRHeroesPage.module.scss"

interface USSRHeroesPageProps {
    text?: string | undefined;
}

export default function USSRHeroesPage({ text }: USSRHeroesPageProps) {

    return (
        <MainLayout>
            <div className={styles.heroesPage}>
                <h1>USSR HeroesPage {text}</h1>
            </div>
        </MainLayout>
    )
}
