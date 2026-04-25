import { NavLink } from "react-router-dom";
import styles from "./Header.module.scss"

interface HeaderProps {
    text?: string | undefined;
}

export default function Header({ text }: HeaderProps) {

    return (
        <div className={styles.header}>
            <h1>Header {text}</h1>
            <NavLink to="/">Главная</NavLink>
            <NavLink to="/heroes">Все герои</NavLink>
        </div>
    )
}
