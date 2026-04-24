import styles from "./HeroList.module.scss"

interface HeroListProps {
    text?: string | undefined;
}

export default function HeroList({ text }: HeroListProps) {

    return (
        <div className={styles.heroList}>
            <h1>HeroList {text}</h1>
        </div>
    )
}
