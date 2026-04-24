import styles from "./AdminSidebar.module.scss"

interface AdminSidebarProps {
    text?: string | undefined;
}

export default function AdminSidebar({ text }: AdminSidebarProps) {

    return (
        <div className={styles.sidebar}>
            <h1>AdminSidebar {text}</h1>
        </div>
    )
}
