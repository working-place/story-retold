
import Button from "../../common/Button/Button";
import styles from "./Form.module.scss";
import { Textarea } from "../Textarea/Textarea";
import { InputAdmin } from "../Input/InputAdmin";
import CustomSelectAdmin from "../Select/SelectAdmin";

export default function AdminPanelForm() {

    return (
        <form
            action=""
            className={`${styles.form} ${styles.form_admin}`}
        >
            <div className={`${styles.form__upload} ${styles.form__upload_admin}`}>

                <button>Выйти</button>

                <h1 className={`${styles.form__titleCard} ${styles.form__title_admin}`}>
                    Новая карточка
                </h1>
                <div
                    className={`${styles.form__uploadArea} ${styles.form__uploadArea_primary} ${styles.form__uploadArea_admin} ${styles.form__uploadArea_adminHeightFirst}`}
                >
                    <img src="/image-download-brown.png" alt="Загрузить" />
                    <div className={`${styles.form__titleWrapper} ${styles.form__titleWrapper_primary}`}>
                        <h3 className={`${styles.form__titleUpload} ${styles.form__titleUpload_admin}`}>
                            Фотографии героя
                        </h3>
                        <h4 className={`${styles.form__subtitle} ${styles.form__subtitle_admin}`}>
                            Максимальный размер файла <br />
                            ***** MB
                        </h4>
                    </div>
                    <Button
                        className={`${styles.button_small} ${styles.button_admin}`}
                    >
                        Выбрать файлы
                    </Button>
                </div>
                <div
                    className={`${styles.form__uploadArea} ${styles.form__uploadArea_secondary} ${styles.form__uploadArea_admin} ${styles.form__uploadArea_adminHeightSecond}`}
                >
                    <div className={`${styles.form__titleWrapper} ${styles.form__titleWrapper_secondary}`}>
                        <h3 className={`${styles.form__titleUpload} ${styles.form__titleUpload_admin}`}>
                            Фотографии наград и другие <br />
                            материалы
                        </h3>
                        <h4 className={`${styles.form__subtitle} ${styles.form__subtitle_admin}`}>
                            Максимальный размер <br />
                            файлов ***** MB
                        </h4>
                    </div>
                    <Button
                        className={`${styles.button_small} ${styles.button_admin}`}
                    >
                        Выбрать файлы
                    </Button>
                </div>
            </div>

            <div className={`${styles.form__basicInformation} ${styles.form__basicInformation_admin}`}>
                <div className={`${styles.form__wrapper_secondLine} ${styles.form__wrapper_admin}`}>

                    <div className={`${styles.form__wrapper_firstLine} ${styles.form__wrapper_firstLine_admin}`}>
                        <CustomSelectAdmin
                            className={styles.selectForm}
                        />
                    </div>
                    <InputAdmin
                        className={`${styles.form__input_hero} ${styles.form__input_admin}`}
                        label="Введите ФИО героя"
                        placeholder="Введите Ф.И.О."
                        required
                    />
                </div>

                <div className={`${styles.form__wrapper_firstLine} ${styles.form__wrapper_firstLine_admin}`}>
                    <InputAdmin
                        className={`${styles.form__input_date} ${styles.form__input_admin} ${styles.form__input_adminInputWidth}`}
                        label="Дата рождения"
                        placeholder="ДД.ММ.ГГ"
                        required
                    />
                    <InputAdmin
                        className={`${styles.form__input_date} ${styles.form__input_admin} ${styles.form__input_adminInputWidth}`}
                        label="Дата смерти"
                        placeholder="ДД.ММ.ГГ"
                    />
                    <InputAdmin
                        className={`${styles.form__input_birthplace} ${styles.form__input_admin}`}
                        label="Место рождения"
                        placeholder="Место рождения"
                        required
                    />
                </div>

                <div className={`${styles.form__wrapper_firstLine} ${styles.form__wrapper_firstLine_admin}`}>
                    <InputAdmin
                        className={`${styles.form__input_additional} ${styles.form__input_admin} ${styles.form__input_adminInputWidth}`}
                        label="Воинское звание"
                        placeholder="Введите описание"
                    />
                    <InputAdmin
                        className={`${styles.form__input_additional} ${styles.form__input_admin} ${styles.form__input_adminInputWidth}`}
                        label="Место службы"
                        placeholder="Введите описание"
                    />
                    <InputAdmin
                        className={`${styles.form__input_additional} ${styles.form__input_admin}`}
                        label="Место призыва"
                        placeholder="Введите описание"
                    />
                </div>

                <div className={styles.form__wrapper_thirdLine}>
                    <InputAdmin
                        className={`${styles.form__input_user} ${styles.form__input_admin}`}
                        label="ФИО и класс автора карточки"
                        placeholder="Введите Ф.И.О. и класс"
                        required
                    />
                </div>
                <div className={styles.form__wrapper_fourthLine}>
                    <Textarea
                        className={styles.textarea__admin}
                        label="Описание материала"
                        variant="_admin"
                        size="large"
                        placeholder="Введите описание"
                        resize="none"
                        labelPosition="top"
                        required
                    />
                </div>

                <div className={`${styles.form__wrapper_firstLine} ${styles.form__wrapper_firstLine_admin}`}>
                    <Button
                        className={styles.publishButton}
                    >Опубликовать</Button>
                    <Button
                        className={styles.reviewButton}
                    >Предпросмотр</Button>
                </div>

            </div>
        </form>
    );
}
