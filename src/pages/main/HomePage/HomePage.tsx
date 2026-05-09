import { Input } from "../../../components/common/Input/Input";
import CustomSelect from "../../../components/common/Select/Select";
import MainLayout from "../../../components/layout/MainLayout/MainLayout";
import styles from "./HomePage.module.scss"
import { Textarea } from "../../../components/common/Textarea/Textarea"

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
            </div>

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

                <img
                    className={styles.about_curl}
                    src="/curl-about.png" alt="Линия" />
            </div>

            <div className={styles.hero}>
                <h2
                    className={styles.hero_title}
                    style={{ fontFamily: 'Glanz', fontWeight: 400 }}
                >
                    Расскажите о герое
                </h2>

                <form
                    action=""
                    className={styles.form}
                >
                    <div className={styles.form__upload}>
                        <Input
                            className={styles.form__input_upload}
                        />
                        <Input
                            className={styles.form__input_upload}
                        />
                    </div>
                    
                    <div className={styles.form__basicInformation}>
                        <h3 className={styles.form__title}>
                            Основные сведения
                        </h3>
                        <div className={styles.form__wrapper_firstLine}>
                            <Input
                                className={styles.form__input_date}
                                label="Дата рождения"
                                placeholder="ДД.ММ.ГГ"
                                required
                            />
                            <Input
                                className={styles.form__input_date}
                                label="Дата смерти"
                                placeholder="ДД.ММ.ГГ"
                            />
                            <Input
                                className={styles.form__input_birthplace}
                                label="Место рождения"
                                placeholder="Место рождения"
                                required
                            />
                        </div>
                        <div className={styles.form__wrapper_secondLine}>
                            <Input
                                className={styles.form__input_hero}
                                label="Введите ФИО героя"
                                placeholder="Введите Ф.И.О."
                                required
                            />
                        </div>
                        <div className={styles.form__wrapper_thirdLine}>
                            <Input
                                className={styles.form__input_user}
                                label="ФИО и класс автора карточки"
                                placeholder="Введите Ф.И.О. и класс"
                                required
                            />
                            <Input
                                className={styles.form__input_email}
                                label="Почта"
                                placeholder="Почта"
                            />
                        </div>
                        <div className={styles.form__wrapper_fourthLine}>
                            <Textarea
                                className={styles.textarea}
                                label="Описание материала"
                                placeholder="Введите описание"
                                labelPosition="top"
                                required
                            />
                        </div>
                    </div>
                    <div className={styles.form__additionalInformation}>
                        <h3 className={styles.form__title}>
                            Дополнительные сведения
                        </h3>
                        <Input
                            className={styles.form__input_additional}
                            label="Воинское звание"
                            placeholder="Введите описание"
                        />
                        <Input
                            className={styles.form__input_additional}
                            label="Место службы"
                            placeholder="Введите описание"
                        />
                        <Input
                            className={styles.form__input_additional}
                            label="Место призыва"
                            placeholder="Введите описание"
                        />
                        <CustomSelect
                            className={styles.select}
                        />
                    </div>
                </form>
            </div>

            <img
                className={styles.history_devidigLineHisory}
                src="/paper-deviding-history.png" alt="Разделительная линия" />
            <img
                className={styles.about_devide}
                src="/paper-deviding-about.png" alt="Разделительная линия" />

        </MainLayout>
    )
}
