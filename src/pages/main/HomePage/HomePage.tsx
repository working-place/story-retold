import MainLayout from "../../../components/layout/MainLayout/MainLayout";
import styles from "./HomePage.module.scss"

interface HomePageProps {
    text?: string | undefined;
}

export default function HomePage({ text }: HomePageProps) {

    return (
        <MainLayout>
            <h1 className={styles.title}>Главная страница</h1>
            <p>тег main не требуется, так как он уже есть в Layuot {text}</p>
        </MainLayout>
    )
}
