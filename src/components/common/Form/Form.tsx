
import { useState } from "react";
import Button from "../../common/Button/Button";
import styles from "./Form.module.scss";
import CustomSelect from "../Select/Select";
import { Checkbox } from "../Input/Checkox";
import { Textarea } from "../Textarea/Textarea";
import { Input } from "../Input/Input";

export default function NewCardForm() {
    const [isAgreed, setIsAgreed] = useState(false);
    const [isPolicyAgreed, setIsPolicyAgreed] = useState(false);

    return (
        <form
            action=""
            className={styles.form}
        >
            <div className={styles.form__upload}>

                <div
                    className={`${styles.form__uploadArea} ${styles.form__uploadArea_primary}`}
                >
                    <img src="/image-download.png" alt="Загрузить" />

                    <div className={`${styles.form__titleWrapper} ${styles.form__titleWrapper_primary}`}>
                        <h3 className={styles.form__titleUpoad}>
                            Фотографии героя
                        </h3>

                        <h4 className={styles.form__subtitle}>
                            Максимальный размер файла <br />
                            ***** MB
                        </h4>
                    </div>

                    <Button
                        className={styles.button_small}
                    >
                        Выбрать файлы
                    </Button>

                </div>

                <div
                    className={`${styles.form__uploadArea} ${styles.form__uploadArea_secondary}`}
                >

                    <div className={`${styles.form__titleWrapper} ${styles.form__titleWrapper_secondary}`}>
                        <h3 className={styles.form__titleUpoad}>
                            Фотографии наград и другие <br />
                            материалы
                        </h3>

                        <h4 className={styles.form__subtitle}>
                            Максимальный размер <br />
                            файлов ***** MB
                        </h4>
                    </div>

                    <Button
                        className={styles.button_small}
                    >
                        Выбрать файлы
                    </Button>

                </div>

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

                <div className={styles.agreementContainer}>
                    <div className={styles.checkboxWrapper}>
                        <Checkbox
                            label="Согласие на обработку персональных данных"
                            checked={isAgreed}
                            onChange={setIsAgreed}
                            required
                        />
                        <a href="">Согласен(а) на обработку персональных данных</a>
                    </div>
                    <div className={styles.checkboxWrapper}>
                        <Checkbox
                            label="Политика обработки персональных данных "
                            checked={isPolicyAgreed}
                            onChange={setIsPolicyAgreed}
                            required
                        />
                        <a href="">Я ознакомлен(а) с Политикой обработки персональных данных</a>
                    </div>

                    <Button
                        className={styles.button}
                    >Отправить сведения о герое</Button>
                </div>
            </div>
        </form>
    );
}
