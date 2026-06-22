import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.scss";

export default function NotFoundPage() {

    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <h1 className={styles.content__title}>404</h1>
                
                <h2 className={styles.content__subtitle}>
                    Такой страницы не существует
                </h2>
                
                <p className={styles.content__text}>
                    Иногда страницы теряются — как письма в архиве.<br />
                    Но важные истории всегда можно найти снова.
                </p>

                <Link to="/" className={styles.content__link}>
                    <button className={styles.button}>
                        Вернуться к архиву
                    </button>
                </Link>
            </div>
        </div>
    );
}