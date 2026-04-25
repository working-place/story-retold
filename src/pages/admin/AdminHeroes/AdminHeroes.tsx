import { NavLink } from "react-router-dom";
import styles from "./AdminHeroes.module.scss"

interface AdminHeroesProps {
    text?: string | undefined;
}

export default function AdminHeroes({ text }: AdminHeroesProps) {

    return (
        <div className={styles.adminHeroes}>
            <h1>AdminHeroes {text}</h1>
            <NavLink to="/">Главная</NavLink>
        </div>
    )
}
