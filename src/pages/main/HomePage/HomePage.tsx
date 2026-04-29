import MainLayout from "../../../components/layout/MainLayout/MainLayout";
import styles from "./HomePage.module.scss"

// interface HomePageProps {
//     text?: string | undefined;
// }

export default function HomePage() {

    return (
        <MainLayout>
            <div className={styles.main}>
                {/* <div className={styles.main_container}> */}
                <h1
                    className={styles.main_title}
                    style={{ fontFamily: 'Glanz', fontWeight: 400 }}
                >
                    История, рассказанная заново
                </h1>
                <img
                    className={styles.main_paperImg}
                    src="/paper-main.png" alt="Газета" />
                {/* </div> */}

                <img
                    className={styles.main_photoImg}
                    src="/photo.png" alt="Фотография" />
            </div>

            <div className={styles.history}>
                <h2 className={styles.history_subtitle}>
                    История проекта <br />
                    и его команда
                </h2>
                <p className={styles.history_description}>
                    Мы — команда МАОУ «СОШ № 60» города Перми. Более 10 лет в школе сохраняется память о героях прошлого и настоящего.
                    В школе создан Сквер Памяти, а проект «Книга Памяти» объединил семейные истории участников Великой Отечественной войны
                </p>
                <p className={styles.history_description}>
                    Сегодня мы продолжаем эту традицию, используя современные цифровые технологии, чтобы сохранить память о подвигах и передать её будущим поколениям.
                </p>
            </div>

            <div className={styles.about}>
                <h2 className={styles.about_subtitle}>
                    О проекте История, <br />
                    РАССКАЗАННАЯ ЗАНОВО
                </h2>
            </div>
            {/* <p>тег main не требуется, так как он уже есть в Layuot {text}</p> */}
        </MainLayout>
    )
}
