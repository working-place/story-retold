import styles from "./HeroesPage.module.scss"

interface HeroesPageProps {
    text?: string | undefined;
}

export default function HeroesPage({ text }: HeroesPageProps) {

    return (
        <div className={styles.heroesPage}>
            <h1>HeroesPage {text}</h1>
        </div>
    )
}
