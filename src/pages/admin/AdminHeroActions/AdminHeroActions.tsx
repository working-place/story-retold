import styles from "./AdminHeroActions.module.scss"

interface AdminHeroActionsProps {
    text?: string | undefined;
}

export default function AdminHeroActions({ text }: AdminHeroActionsProps) {

    return (
        <div className={styles.adminHeroActions}>
            <h1>AdminHeroActions {text}</h1>
        </div>
    )
}
