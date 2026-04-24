import styles from "./Card.module.scss"

interface CardProps {
    text?: string | undefined;
}

export default function Card({ text }: CardProps) {

    return (
        <div className={styles.card}>
            <h1>Card {text}</h1>
        </div>
    )
}
