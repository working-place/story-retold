import styles from "./MainLayout.module.scss"

interface MainLayoutProps {
    text?: string | undefined;
}

export default function MainLayout({ text }: MainLayoutProps) {

    return (
        <div className={styles.mainLayout}>
            <h1>MainLayout {text}</h1>
        </div>
    )
}
