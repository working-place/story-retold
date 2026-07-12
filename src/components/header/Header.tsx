import { NavLink } from "react-router-dom";
import styles from "./Header.module.scss"
import Button from "../common/Button/Button"; // Импортируем ваш компонент
import { useState, useEffect } from "react";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Блокируем прокрутку страницы при открытом меню
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const toggleMenu = () => setIsMenuOpen(prev => !prev);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <div className={styles.header}>
            <img src="/logo.png" alt="Лого" />

            {/* Десктопная навигация */}
            <div className={styles.header_linkContainer}>
                <NavLink 
                    className={({ isActive }) => isActive ? `${styles.header_linkText} ${styles.active}` : styles.header_linkText} 
                    to="/"
                >
                    Главная
                </NavLink>
                <NavLink 
                    className={({ isActive }) => isActive ? `${styles.header_linkText} ${styles.active}` : styles.header_linkText} 
                    to="/ussr-heroes"
                >
                    Герои СССР
                </NavLink>
                <NavLink 
                    className={({ isActive }) => isActive ? `${styles.header_linkText} ${styles.active}` : styles.header_linkText} 
                    to="/svo-heroes"
                >
                    Герои СВО
                </NavLink>
            </div>

            {/* Десктопная кнопка */}
            <div className={styles.desktopButtonWrapper}>
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

            {/* Кнопка бургер-меню (мобильная) */}
            <button 
                className={styles.burgerButton} 
                onClick={toggleMenu} 
                aria-label="Открыть меню"
            >
                <img src="/Icon_Menu.svg" alt="Меню" />
            </button>

            {/* Мобильное меню (оверлей) */}
            {isMenuOpen && (
                <div className={styles.mobileOverlay}>
                    <div className={styles.mobileMenu}>
                        {/* Кнопка закрытия (крестик) */}
                        <button 
                            className={styles.mobileMenu__closeButton} 
                            onClick={closeMenu} 
                            aria-label="Закрыть меню"
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>

                        {/* Ссылки меню */}
                        <nav className={styles.mobileMenu__links}>
                            <NavLink 
                                to="/" 
                                className={({ isActive }) => isActive ? `${styles.mobileMenu__link} ${styles.mobileMenu__link_active}` : styles.mobileMenu__link} 
                                onClick={closeMenu}
                            >
                                Главная
                            </NavLink>
                            <NavLink 
                                to="/ussr-heroes" 
                                className={({ isActive }) => isActive ? `${styles.mobileMenu__link} ${styles.mobileMenu__link_active}` : styles.mobileMenu__link} 
                                onClick={closeMenu}
                            >
                                Герои СССР
                            </NavLink>
                            <NavLink 
                                to="/svo-heroes" 
                                className={({ isActive }) => isActive ? `${styles.mobileMenu__link} ${styles.mobileMenu__link_active}` : styles.mobileMenu__link} 
                                onClick={closeMenu}
                            >
                                Герои СВО
                            </NavLink>
                        </nav>

                        {/* Кнопка внизу меню (использует компонент Button) */}
                        <div className={styles.mobileMenu__buttonWrapper}>
                            <Button
                                variant="primary"
                                fullWidth
                                borderRadius="50px"
                                fontSize="22px"
                                padding="18px 24px"
                                onClick={closeMenu}
                            >
                                Рассказать о герое
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}