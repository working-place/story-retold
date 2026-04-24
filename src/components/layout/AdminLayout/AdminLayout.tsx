import styles from "./AdminLayout.module.scss"

interface AdminLayoutProps {
    text?: string | undefined;
}

export default function AdminLayout({ text }: AdminLayoutProps) {

    return (
        <div className={styles.adminLayout}>
            <h1>AdminLayout {text}</h1>
        </div>
    )
}
