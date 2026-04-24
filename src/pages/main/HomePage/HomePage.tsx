import styles from "./HomePage.module.scss"

interface HomePageProps {
    text?: string | undefined;
}

export default function HomePage({ text }: HomePageProps) {

    return (
        <div className={styles.homePage}>
            <h1>HomePage {text}</h1>
        </div>
    )
}
