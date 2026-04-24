import styles from "./Header.module.scss"

interface HeaderProps {
    text?: string | undefined;
}

export default function Header({ text }: HeaderProps) {

    return (
        <div className={styles.header}>
            <h1>Header {text}</h1>
        </div>
    )
}
