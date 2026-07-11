
import { useState } from "react";
import Button from "../../common/Button/Button";
import styles from "./Form.module.scss";
import CustomSelect from "../Select/Select";
import { Checkbox } from "../Input/Checkbox";
import { Textarea } from "../Textarea/Textarea";
import { Input } from "../Input/Input";
import { heroesApi } from '../../../services/api/heroes';
import SuccessPopup from "../../admin/Popups/SuccessPopup";
import { useObjectUrl, useObjectUrls } from "../../../hooks/useObjectUrl";
import { useCardForm } from "../../../hooks/useCardForm";

export default function NewCardForm() {
    const [loading, setLoading] = useState(false);
    const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const form = useCardForm({ mode: 'create-public' });

    const photoHeroUrl = useObjectUrl(form.photoHero);
    const additionalImageUrls = useObjectUrls(form.additionalImages);

    const showPhotoBlock = form.formData.cardType === 'withoutPhoto';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        form.setError(null);

        if (!form.validate()) return;

        setLoading(true);
        try {
            const submitData = form.buildSubmitData();
            const response = await heroesApi.create(submitData);

            if (response?.id) {
                setSuccessMessage('Карточка успешно создана! Она будет опубликована после проверки администратором.');
                setIsSuccessPopupOpen(true);
                form.resetForm();
            } else {
                setErrorMessage('Не удалось создать карточку. Попробуйте позже.');
                setIsErrorPopupOpen(true);
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Произошла ошибка при создании карточки';
            setErrorMessage(msg);
            setIsErrorPopupOpen(true);
            form.setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleSuccessPopupClose = () => {
        setIsSuccessPopupOpen(false);
    };

    const handleErrorPopupClose = () => {
        setIsErrorPopupOpen(false);
        form.setError(null);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.form__upload}>

                    {!showPhotoBlock && (
                        <div className={`${styles.form__uploadArea} ${styles.form__uploadArea_primary}`}>

                            {!form.photoHero ? (
                                <>
                                    <img src="/image-download.png" alt="Загрузить" />
                                    <div className={`${styles.form__titleWrapper} ${styles.form__titleWrapper_primary}`}>
                                        <h3 className={styles.form__titleUpload}>
                                            Фотографии героя
                                        </h3>
                                        <h4 className={styles.form__subtitle}>
                                            Максимальный размер файла 4 MB
                                        </h4>
                                    </div>
                                    <input
                                        type="file"
                                        id="photoHero"
                                        accept="image/png,image/jpeg,image/jpg,image/webp"
                                        onChange={form.handlePhotoHeroChange}
                                        style={{ display: 'none' }}
                                    />
                                    <Button
                                        type="button"
                                        className={styles.button_small}
                                        onClick={() => document.getElementById('photoHero')?.click()}
                                        disabled={form.isCompressing}
                                    >
                                        Выбрать файл
                                    </Button>
                                </>
                            ) : (
                                <div className={styles.previewContainer}>
                                    <div className={styles.previewImageWrapper}>
                                        <img
                                            src={photoHeroUrl}
                                            alt="Превью фото героя"
                                            className={styles.previewImage}
                                        />
                                        <button
                                            type="button"
                                            className={styles.removeImageButton}
                                            onClick={() => form.setPhotoHero(null)}
                                            aria-label="Удалить фото"
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <div className={styles.previewInfo}>
                                        <p className={styles.previewFileName}>{form.photoHero.name}</p>
                                        <p className={styles.previewFileSize}>
                                            {(form.photoHero.size / 1024).toFixed(2)} KB
                                        </p>
                                        <Button
                                            type="button"
                                            className={`${styles.button_small} ${styles.changePhotoButton}`}
                                            onClick={() => document.getElementById('photoHero')?.click()}
                                        >
                                            Заменить фото
                                        </Button>
                                    </div>
                                    <input
                                        type="file"
                                        id="photoHero"
                                        accept="image/png,image/jpeg,image/jpg,image/webp"
                                        onChange={form.handlePhotoHeroChange}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    <div className={`${styles.form__uploadArea} ${styles.form__uploadArea_secondary}`}>
                        <div className={`${styles.form__titleWrapper} ${styles.form__titleWrapper_secondary}`}>
                            <h3 className={styles.form__titleUpload}>
                                Фотографии наград и другие материалы
                            </h3>
                            <h4 className={styles.form__subtitle}>
                                Максимальный размер файлов 4 MB. Максимум 9 изображений
                            </h4>
                        </div>

                        <input
                            type="file"
                            id="additionalImages"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            multiple
                            onChange={form.handleAdditionalImagesChange}
                            style={{ display: 'none' }}
                            disabled={form.additionalImages.length >= 9}
                        />
                        <Button
                            type="button"
                            className={styles.button_small}
                            onClick={() => document.getElementById('additionalImages')?.click()}
                            disabled={form.additionalImages.length >= 9 || form.isCompressing}
                        >
                            Выбрать файлы ({form.additionalImages.length}/9)
                        </Button>

                        {form.additionalImages.length > 0 && (
                            <div className={styles.additionalImagesGrid}>
                                {form.additionalImages.map((_, index) => (
                                    <div key={index} className={styles.additionalImageItem}>
                                        <div className={styles.additionalImageWrapper}>
                                            <img
                                                src={additionalImageUrls[index]}
                                                alt={`Дополнительное фото ${index + 1}`}
                                                className={styles.additionalImagePreview}
                                            />
                                            <button
                                                type="button"
                                                className={styles.removeAdditionalImageButton}
                                                onClick={() => form.removeAdditionalImage(index)}
                                                aria-label="Удалить фото"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
                            placeholder="ДД.ММ.ГГГГ"
                            value={form.displayDateBirth}
                            onChange={form.handleDateBirthChange}
                            onBlur={() => form.handleBlur('dateBirth')}
                            error={!!form.getFieldError('dateBirth')}
                            errorText={form.getFieldError('dateBirth')}
                            required
                        />
                        <Input
                            className={styles.form__input_date}
                            label="Дата смерти"
                            placeholder="ДД.ММ.ГГГГ"
                            value={form.displayDateDeath}
                            onChange={form.handleDateDeathChange}
                        />
                        <Input
                            className={styles.form__input_birthplace}
                            label="Место рождения"
                            placeholder="Место рождения"
                            value={form.formData.placeBirth}
                            onChange={(e) => form.handleInputChange('placeBirth', e.target.value)}
                            onBlur={() => form.handleBlur('placeBirth')}
                            error={!!form.getFieldError('placeBirth')}
                            errorText={form.getFieldError('placeBirth')}
                            required
                        />
                    </div>

                    <div className={styles.form__wrapper_secondLine}>
                        <Input
                            className={styles.form__input_hero}
                            label="Введите ФИО героя"
                            placeholder="Введите Ф.И.О."
                            value={form.formData.name}
                            onChange={(e) => form.handleInputChange('name', e.target.value)}
                            onBlur={() => form.handleBlur('name')}
                            error={!!form.getFieldError('name')}
                            errorText={form.getFieldError('name')}
                            required
                        />
                    </div>

                    <div className={styles.form__wrapper_thirdLine}>
                        <Input
                            className={styles.form__input_user}
                            label="ФИО и класс автора карточки"
                            placeholder="Введите Ф.И.О. и класс"
                            value={form.formData.nameAndClass}
                            onChange={(e) => form.handleInputChange('nameAndClass', e.target.value)}
                            onBlur={() => form.handleBlur('nameAndClass')}
                            error={!!form.getFieldError('nameAndClass')}
                            errorText={form.getFieldError('nameAndClass')}
                            required
                        />
                        <Input
                            className={styles.form__input_email}
                            label="Почта"
                            placeholder="Почта"
                            value={form.formData.email}
                            onChange={(e) => form.handleInputChange('email', e.target.value)}
                        />
                    </div>

                    <div className={styles.form__wrapper_fourthLine}>
                        <Textarea
                            label="Описание материала"
                            placeholder="Введите описание"
                            variant="_primary"
                            size="large"
                            labelPosition="top"
                            value={form.formData.description}
                            onChange={(e) => form.handleInputChange('description', e.target.value)}
                            onBlur={() => form.handleBlur('description')}
                            error={!!form.getFieldError('description')}
                            errorText={form.getFieldError('description')}
                            required
                        />
                    </div>
                </div>

                <div className={styles.form__additionalInformation}>
                    <h3 className={styles.form__title}>
                        Дополнительные сведения
                    </h3>

                    <div className={styles.form__additionalInputs}>
                        <Input
                            className={styles.form__input_additional}
                            label="Воинское звание"
                            placeholder="Воинское звание"
                            value={form.formData.militaryRank}
                            onChange={(e) => form.handleInputChange('militaryRank', e.target.value)}
                        />
                        <Input
                            className={styles.form__input_additional}
                            label="Место службы"
                            placeholder="Место службы"
                            value={form.formData.placeService}
                            onChange={(e) => form.handleInputChange('placeService', e.target.value)}
                        />
                        <Input
                            className={styles.form__input_additional}
                            label="Место призыва"
                            placeholder="Место призыва"
                            value={form.formData.placeConscription}
                            onChange={(e) => form.handleInputChange('placeConscription', e.target.value)}
                        />
                    </div>

                    <CustomSelect
                        className={styles.select}
                        key={String(form.formData.chapter)}
                        initialChapter={form.formData.chapter}
                        initialCardType={form.formData.cardType}
                        onChapterChange={form.handleChapterChange}
                        onCardTypeChange={form.handleCardTypeChange}
                    />

                    <div className={styles.agreementContainer}>
                        <div className={styles.checkboxWrapper}>
                            <Checkbox
                                label="Согласие на обработку персональных данных"
                                checked={form.isAgreed}
                                onChange={form.setIsAgreed}
                                required
                            />
                            <a href="/privacy-policy" target="_blank">Согласен(а) на обработку персональных данных</a>
                        </div>
                        <div className={styles.checkboxWrapper}>
                            <Checkbox
                                label="Политика обработки персональных данных"
                                checked={form.isPolicyAgreed}
                                onChange={form.setIsPolicyAgreed}
                                required
                            />
                            <a href="/privacy-policy" target="_blank">Я ознакомлен(а) с Политикой обработки персональных данных</a>
                        </div>

                        <Button
                            type="submit"
                            className={styles.button}
                            disabled={loading || form.isCompressing}
                        >
                            {loading ? 'Отправка...' : 'Отправить сведения о герое'}
                        </Button>
                    </div>
                </div>
            </form>

            <SuccessPopup
                isOpen={isSuccessPopupOpen}
                onClose={handleSuccessPopupClose}
                success={successMessage}
            />

            <SuccessPopup
                isOpen={isErrorPopupOpen}
                onClose={handleErrorPopupClose}
                error={errorMessage}
            />
        </>
    );
}
