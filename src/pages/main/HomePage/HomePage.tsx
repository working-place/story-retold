import MainLayout from "../../../components/layout/MainLayout/MainLayout";
import styles from "./HomePage.module.scss"

// interface HomePageProps {
//     text?: string | undefined;
// }

export default function HomePage() {

    return (
        <MainLayout>
            <div className={styles.main}>
                <h1
                    className={styles.main_title}
                    style={{ fontFamily: 'Glanz', fontWeight: 400 }}
                >
                    История, рассказанная заново
                </h1>
                <img
                    className={styles.main_paperImg}
                    src="/paper-main.png" alt="Газета" />

                <img
                    className={styles.main_photoImg}
                    src="/photo.png" alt="Фотография" />

                <img
                    className={styles.main_devidigLine}
                    src="/paper-deviding-main.png" alt="Разделительная линия" />
            </div>

            <div className={styles.history}>
                <div className={styles.history_container}>
                    <h2
                        className={styles.history_subtitle__firstLine}
                        style={{ fontFamily: 'Glanz', fontWeight: 400 }}
                    >
                        История проекта
                    </h2>
                    <h2
                        className={styles.history_subtitle__secondLine}
                        style={{ fontFamily: 'Glanz', fontWeight: 400 }}
                    >
                        и его команда
                    </h2>
                    <p
                        // style={{ fontFamily: 'Metamorphous-Regular', fontWeight: 400 }}
                        className={styles.history_description__firstLine}>
                        Мы — команда МАОУ «СОШ № 60» города <br />
                        Перми. Более 10 лет в школе сохраняется <br />
                        память о героях прошлого и настоящего. <br />
                        В школе создан Сквер Памяти, а проект <br />
                        «Книга Памяти» объединил семейные <br />
                        истории участников Великой <br />
                        Отечественной войны
                    </p>
                    <p className={styles.history_description__secondLine}>
                        Сегодня мы продолжаем эту традицию, <br />
                        используя современные цифровые <br />
                        технологии, чтобы сохранить память о <br />
                        подвигах и передать её будущим <br />
                        поколениям.
                    </p>
                </div>

                <img
                    className={styles.history_map}
                    src="/map.png" alt="Карта" />

                <img
                    className={styles.history_imageHistory}
                    src="/image-history.png" alt="Фотография памятника" />

                <img
                    className={styles.history_arrow}
                    src="/arrow-history.png" alt="Стрелка" />

                <img
                    className={styles.history_curlHistory}
                    src="/curl-history.png" alt="Линия" />

                <img
                    className={styles.history_curlHistoryTop}
                    src="/curl-history-top.png" alt="Линия" />

                <img
                    className={styles.history_devidigLineHisory}
                    src="/paper-deviding-history.png" alt="Разделительная линия" />
            </div>

            {/* ------------------ */}

            <div className={styles.about}>
                <h2 className={styles.about_subtitle}>
                    О проекте История, <br />
                    РАССКАЗАННАЯ ЗАНОВО
                </h2>
            </div>
            {/* <p>тег main не требуется, так как он уже есть в Layuot {text}</p> */}
            {/* ------------------ */}
        </MainLayout>
    )
}
