import { NavLink } from "react-router-dom";
import styles from "./LoginPage.module.scss"

interface LoginPageProps {
    text?: string | undefined;
}

export default function LoginPage({ text }: LoginPageProps) {

    return (
        <div className={styles.loginPage}>
            <h1>LoginPage {text}</h1>
            <NavLink to="/">На главную</NavLink>
            <NavLink to="/admin-heroes">Войти</NavLink>
        </div>
    )
}
