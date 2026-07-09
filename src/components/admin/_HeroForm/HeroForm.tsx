import styles from "./HeroForm.module.scss"

interface HeroFormProps {
    text?: string | undefined;
}

export default function HeroForm({ text }: HeroFormProps) {

    return (
        <form className={styles.form}>
             <h1>HeroForm {text}</h1>
            <input
                type="text"
                placeholder={text || "Имя"}
            />
        </form>
    )
}
