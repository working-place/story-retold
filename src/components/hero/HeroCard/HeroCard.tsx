import styles from "./HeroCard.module.scss"

interface HeroCardProps {
    text?: string | undefined;
}

export default function HeroCard({ text }: HeroCardProps) {

    return (
        <div className={styles.heroCard}>
            <h1>HeroCard {text}</h1>
        </div>
    )
}
