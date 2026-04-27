import { NavLink } from "react-router-dom";
import styles from "./Footer.module.scss"

export default function Footer() {

    return (
        <div className={styles.footer}>

            <div className={styles.item11}>
                <NavLink to='/'>
                    <img className={styles.logo} src="public/logo-footer.png" alt="Логотип" />
                </NavLink>
            </div>

            <div className={styles.item15}>
                <img className={styles.logoSocial} src="public/logo-social.png" alt="ВК" />
            </div>

            <div className={styles.item21}>
                <a href="https://grant.obr.so/">
                    <img className={styles.logoSot} src="public/logo-sot.png" alt="Логотип СОТ" />
                </a>
            </div>

            <div className={styles.item22}>
                Габидуллина Алёна Игоревна школа №60 <br />
                победитель конкурса СОТ-2025 <br />
                Номинация «Воспитание и социализация»
            </div>

            <div className={styles.item23}>
                <span className={styles.tel}>+7 (342) 242-08-60</span>
                <span className={styles.email}>DigitalMemory60@yandex.ru</span>
            </div>

            <div className={styles.item24}>
                <NavLink className={styles.agreement} to=''>
                    Пользовательское соглашение
                </NavLink> <br />
                <NavLink className={styles.confidence} to=''>
                    Политика конфиденциальности
                </NavLink>
            </div>

            <div className={styles.item25}>
                <div className={styles.item25_wrapper}>
                    <span className={styles.xlSize}>Сделано в:</span>
                    <a href="https://союз.рф/">
                        <img className={styles.logoSoyuz} src="public/logo-soyuz.png" alt="Логотип Союз.рф" />
                    </a>
                    <span className={styles.xlSize}>Экипаж</span> <br />
                </div>
                <span className={styles.mSize}>
                    © 2026 «История, рассказанная заново»</span>
            </div>
        </div>
    )
}
