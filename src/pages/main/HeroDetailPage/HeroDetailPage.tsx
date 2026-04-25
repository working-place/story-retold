import MainLayout from "../../../components/layout/MainLayout/MainLayout";
import styles from "./HeroDetailPage.module.scss"

interface HeroDetailPageProps {
    text?: string | undefined;
}

export default function HeroDetailPage({ text }: HeroDetailPageProps) {

    return (
        <MainLayout>
            <div className={styles.heroDetailPage}>
                <h1>HeroDetailPage {text}</h1>
            </div>
        </MainLayout>
    )
}
