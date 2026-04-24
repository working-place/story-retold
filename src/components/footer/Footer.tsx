import styles from "./Footer.module.scss"

interface FooterProps {
    text?: string | undefined;
}

export default function Footer({ text }: FooterProps) {

    return (
        <div className={styles.footer}>
            <h1>Footer {text}</h1>
        </div>
    )
}
