import styles from "./Button.module.scss"

interface ButtonProps {
    text?: string | undefined;
}

export default function Button({ text }: ButtonProps) {

    return (
        <div className={styles.button}>
            <h1>Button {text}</h1>
        </div>
    )
}
