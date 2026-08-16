import styles from "./HomePage.module.scss"
import NewCardForm from "../../../components/common/Form/Form";

export default function HomePage() {

    return (
        <>
            <div className={styles.main}>
                {/* <h1
                    className={styles.main_title}
                    style={{ fontFamily: 'Glanz', fontWeight: 400 }}
                >
                    История, рассказанная заново
                </h1> */}
                <img
                    className={styles.main_paperImg}
                    src="/paper-main_full.png" alt="Газета" />

                {/* <img
                    className={styles.main_photoImg}
                    src="/photo.png" alt="Фотография" /> */}
            </div>

            {/* Бумажный разделитель: десктопная версия ≥768px,
                на мобилках — общая homePage_PaperDivider_mobile.png */}
            <picture>
                <source
                    media="(min-width: 768px)"
                    srcSet="/paper-deviding-main.png" />
                <img
                    className={styles.divide}
                    src="/homePage_PaperDivider_mobile.png" alt="Разделительная линия" />
            </picture>

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
                    src="/homepage_block2_img_pc.png" alt="Карта" />

                <img
                    className={styles.history_mapMobile}
                    src="/homepage_block2_img_mobile.png" alt="Карта" />

                {/* <img
                    className={styles.history_imageHistory}
                    src="/image-history.png" alt="Фотография памятника" />

                <img
                    className={styles.history_arrow}
                    src="/arrow-history.png" alt="Стрелка" /> */}

                {/* Десктопный завиток — НЕ УДАЛЯТЬ: работает на ≥1024.
                    На ≤1023 скрыт и заменён мобильным (curlMobile ниже). */}
                <img
                    className={styles.history_curlHistory}
                    src="/curl-history.png" alt="Линия" />

                <img
                    className={styles.history_curlHistoryTop}
                    src="/curl-history-top.png" alt="Линия" />

                {/* Мобильный завиток — ТОЛЬКО ≤1023, по всей ширине экрана. */}
                <img
                    className={styles.history_curlMobile}
                    src="/homepage_curls_mobile_2.png" alt="Линия" />
            </div>

            <picture>
                <source
                    media="(min-width: 768px)"
                    srcSet="/paper-deviding-history.png" />
                <img
                    className={styles.divide}
                    src="/homePage_PaperDivider_mobile.png" alt="Разделительная линия" />
            </picture>

            <div className={styles.about}>

                <div className={styles.about_subtitle}>
                    <h2
                        className={styles.about_subtitle__firstLine}
                        style={{ fontFamily: 'Glanz', fontWeight: 400 }}
                    >
                        О проекте История,
                    </h2>
                    <h2
                        className={styles.about_subtitle__firstLine}
                        style={{ fontFamily: 'Glanz', fontWeight: 400 }}
                    >
                        РАССКАЗАННАЯ ЗАНОВО
                    </h2>
                </div>

                <p className={styles.about_description}>
                    История, рассказанная заново — цифровое <br />
                    пространство памяти, созданное в Перми, <br />
                    городе трудовой доблести. Проект <br />
                    объединяет прошлое и настоящее, сохраняя <br />
                    реальные истории героев и их достижения <br />
                    для будущих поколений. <br />
                </p>

                <img
                    className={styles.about_line1}
                    src="/line-11.png" alt="Линия" />
                <img
                    className={styles.about_line3}
                    src="/line-13.png" alt="Линия" />
                <img
                    className={styles.about_line2}
                    src="/line-12.png" alt="Линия" />
                <img
                    className={styles.about_line5}
                    src="/line-15.png" alt="Линия" />
                <img
                    className={styles.about_line4}
                    src="/line-14.png" alt="Линия" />
                {/* Отдельные фото героев — НЕ УДАЛЯТЬ!
                    На всех ширинах заменены общей картинкой-стеком
                    (about_photoStack ниже), скрыты через CSS.
                    Стили лежат в HomePage.module.scss в комментариях. */}
                <img
                    className={styles.about_photo1}
                    src="/photo-1.png" alt="Фотография героя" />
                <img
                    className={styles.about_photo2}
                    src="/photo-2.png" alt="Фотография героя" />
                <img
                    className={styles.about_photo3}
                    src="/photo-3.png" alt="Фотография героя" />
                <img
                    className={styles.about_photo4}
                    src="/photo-4.png" alt="Фотография героя" />
                <img
                    className={styles.about_photo5}
                    src="/photo-5.png" alt="Фотография героя" />

                {/* Общая картинка-стек фото героев.
                    ≥1280px — десктопная версия (_desc.webp),
                    ниже 1280px — мобильная (_mobile.webp).
                    Через <picture> браузер грузит только нужную. */}
                <picture>
                    <source
                        media="(min-width: 1280px)"
                        srcSet="/homepage_herophotosStack_desc.webp" />
                    <img
                        className={styles.about_photoStack}
                        src="/homepage_herophotosStack_mobile.webp"
                        alt="Фотографии героев" />
                </picture>

                <img
                    className={styles.about_curl}
                    src="/curl-about.png" alt="Линия" />
            </div>

            <picture>
                <source
                    media="(min-width: 768px)"
                    srcSet="/paper-deviding-about.png" />
                <img
                    className={styles.divide}
                    src="/homePage_PaperDivider_mobile.png" alt="Разделительная линия" />
            </picture>

            <div className={styles.hero}>
                <h2
                    className={styles.hero_titleForm}
                    style={{ fontFamily: 'Glanz', fontWeight: 400 }}
                >
                    Расскажите о герое
                </h2>
                <NewCardForm />
            </div>

        </>
    )
}
