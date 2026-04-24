import styles from "./LoginForm.module.scss"

interface LoginProps {
    text?: string | undefined;
}

export default function Login({ text }: LoginProps) {

    return (
        <div className={styles.login}>
            <h1>Login {text}</h1>
        </div>
    )
}
