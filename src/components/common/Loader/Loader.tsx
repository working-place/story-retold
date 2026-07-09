import styles from "./Loader.module.scss"

interface LoaderProps {
    text?: string | undefined;
}

export default function Loader({ text }: LoaderProps) {

    return (
        <div className={styles.loader}>
            <h1>Loader {text}</h1>
        </div>
    )
}
