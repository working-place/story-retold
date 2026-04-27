import { NavLink } from "react-router-dom";
import styles from "./Header.module.scss"
import Button from "../common/Button/Button";

export default function Header() {

    return (
        <div className={styles.header}>
            <img
                src="public/logo.png"
                alt="Лого" />
            <div className={styles.header_linkContainer}>
                <NavLink
                    className={({ isActive }) => isActive ? `${styles.header_linkText} ${styles.active}` : styles.header_linkText}
                    to="/">
                    Главная
                </NavLink>
                <NavLink
                    className={({ isActive }) => isActive ? `${styles.header_linkText} ${styles.active}` : styles.header_linkText}
                    to="/ussr-heroes">
                    Герои СССР
                </NavLink>
                <NavLink
                    className={({ isActive }) => isActive ? `${styles.header_linkText} ${styles.active}` : styles.header_linkText}
                    to="/svo-heroes">
                    Герои СВО
                </NavLink>
            </div>

            <Button
                backgroundColor='#534035'
                padding='12px 24px'
                borderRadius='20px'
                fontSize='26px'
                color='#F4F4F4'
            >
                Рассказать о герое
            </Button>
        </div>
    )
}
