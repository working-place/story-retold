import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from "../../common/Button/Button";
import styles from "./Form.module.scss";
import { Textarea } from "../Textarea/Textarea";
import { InputAdmin } from "../Input/InputAdmin";
import CustomSelectAdmin from "../Select/SelectAdmin";
import { heroesApi, ApiError } from '../../../services/api/heroes';
import { buildImageUrl } from '../../../services/api/api';
import { useObjectUrl, useObjectUrls } from "../../../hooks/useObjectUrl";
import { useCardForm } from "../../../hooks/useCardForm";
import type { CardResponse } from '../../../types/api.types';

export default function AdminEditForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [success, setSuccess] = useState(false);

    const form = useCardForm({ mode: 'edit' });

    const photoHeroUrl = useObjectUrl(form.photoHero);
    const additionalImageUrls = useObjectUrls(form.additionalImages);

    useEffect(() => {
        const fetchHero = async () => {
            if (!id) return;
            setFetchLoading(true);
            try {
                const heroData: CardResponse = await heroesApi.get(Number(id));
                form.hydrateFromCard(heroData);
            } catch (err) {
                form.setError(
                    err instanceof ApiError
                        ? `Ошибка сервера: ${err.message}`
                        : 'Не удалось загрузить данные героя'
                );
            } finally {
                setFetchLoading(false);
            }
        };
        fetchHero();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        form.setError(null);
        setSuccess(false);

        if (!form.validate() || !id) return;

        setLoading(true);
        try {
            const submitData = form.buildSubmitData();
            await heroesApi.update(Number(id), submitData);

            setSuccess(true);
            setTimeout(() => {
                navigate('/admin-heroes/svo-heroes');
            }, 1500);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Произошла ошибка при обновлении карточки';
            form.setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return (
            <div className={styles.form}>
                <div className={styles.loading}>Загрузка данных...</div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className={`${styles.form} ${styles.form_admin}`}>
            {form.error && <div className={styles.errorMessage}>{form.error}</div>}
            {success && <div className={styles.successMessage}>Карточка успешно обновлена!</div>}

            <div className={`${styles.form__upload} ${styles.form__upload_admin}`}>
                <h1 className={`${styles.form__titleCard} ${styles.form__title_admin}`}>
                    Редактирование карточки
                </h1>

                <div className={`${styles.form__uploadArea} ${styles.form__uploadArea_primary} ${styles.form__uploadArea_admin} ${styles.form__uploadArea_adminHeightFirst}`}>
                    {!form.photoHero && !form.existingPhotoHero ? (
                        <>
                            <img src="/image-download-brown.png" alt="Загрузить" />
                            <div className={`${styles.form__titleWrapper} ${styles.form__titleWrapper_primary}`}>
                                <h3 className={`${styles.form__titleUpload} ${styles.form__titleUpload_admin}`}>
                                    Фотографии героя
                                </h3>
                                <h4 className={`${styles.form__subtitle} ${styles.form__subtitle_admin}`}>
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
                                className={`${styles.button_small} ${styles.button_admin}`}
                                onClick={() => document.getElementById('photoHero')?.click()}
                            >
                                Выбрать файл
                            </Button>
                        </>
                    ) : (
                        <div className={styles.previewContainer}>
                            <div className={styles.previewImageWrapper}>
                                <img
                                    src={form.photoHero ? photoHeroUrl : buildImageUrl(form.existingPhotoHero)}
                                    alt="Превью фото героя"
                                    className={styles.previewImage}
                                />
                                <button
                                    type="button"
                                    className={styles.removeImageButton}
                                    onClick={() => {
                                        form.setPhotoHero(null);
                                        form.setExistingPhotoHero(null);
                                    }}
                                    aria-label="Удалить фото"
                                >
                                    ×
                                </button>
                            </div>
                            <div className={styles.previewInfo}>
                                <p className={styles.previewFileName}>
                                    {form.photoHero ? form.photoHero.name : 'Текущее фото'}
                                </p>
                                <Button
                                    type="button"
                                    className={`${styles.button_small} ${styles.button_admin} ${styles.changePhotoButton}`}
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

                <div className={`${styles.form__uploadArea} ${styles.form__uploadArea_secondary} ${styles.form__uploadArea_admin} ${styles.form__uploadArea_adminHeightSecond}`}>
                    <div className={`${styles.form__titleWrapper} ${styles.form__titleWrapper_secondary}`}>
                        <h3 className={`${styles.form__titleUpload} ${styles.form__titleUpload_admin}`}>
                            Фотографии наград и другие материалы
                        </h3>
                        <h4 className={`${styles.form__subtitle} ${styles.form__subtitle_admin}`}>
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
                        disabled={(form.additionalImages.length + form.existingAdditionalImages.length) >= 9}
                    />
                    <Button
                        type="button"
                        className={`${styles.button_small} ${styles.button_admin}`}
                        onClick={() => document.getElementById('additionalImages')?.click()}
                        disabled={(form.additionalImages.length + form.existingAdditionalImages.length) >= 9}
                    >
                        Выбрать файлы ({form.additionalImages.length + form.existingAdditionalImages.length}/9)
                    </Button>

                    {form.existingAdditionalImages.length > 0 && (
                        <div className={styles.additionalImagesGrid}>
                            {form.existingAdditionalImages.map((img, index) => (
                                <div key={`existing-${index}`} className={styles.additionalImageItem}>
                                    <div className={styles.additionalImageWrapper}>
                                        <img
                                            src={buildImageUrl(img)}
                                            alt={`Дополнительное фото ${index + 1}`}
                                            className={styles.additionalImagePreview}
                                        />
                                        <button
                                            type="button"
                                            className={styles.removeAdditionalImageButton}
                                            onClick={() => form.removeAdditionalImage(index, true)}
                                            aria-label="Удалить фото"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {form.additionalImages.length > 0 && (
                        <div className={styles.additionalImagesGrid}>
                            {form.additionalImages.map((_, index) => (
                                <div key={`new-${index}`} className={styles.additionalImageItem}>
                                    <div className={styles.additionalImageWrapper}>
                                        <img
                                            src={additionalImageUrls[index]}
                                            alt={`Дополнительное фото ${index + 1}`}
                                            className={styles.additionalImagePreview}
                                        />
                                        <button
                                            type="button"
                                            className={styles.removeAdditionalImageButton}
                                            onClick={() => form.removeAdditionalImage(index, false)}
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

            <div className={`${styles.form__basicInformation} ${styles.form__basicInformation_admin}`}>
                <div className={`${styles.form__wrapper_secondLine} ${styles.form__wrapper_admin}`}>
                    <div className={`${styles.form__wrapper_firstLine} ${styles.form__wrapper_firstLine_admin}`}>
                        <CustomSelectAdmin
                            className={styles.selectForm}
                            required
                            onChapterChange={form.handleChapterChange}
                            onCardTypeChange={form.handleCardTypeChange}
                            initialChapter={form.formData.chapter}
                            initialCardType={form.formData.cardType}
                        />
                    </div>
                    <InputAdmin
                        className={`${styles.form__input_hero} ${styles.form__input_admin}`}
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

                <div className={`${styles.form__wrapper_firstLine} ${styles.form__wrapper_firstLine_admin}`}>
                    <InputAdmin
                        className={`${styles.form__input_date} ${styles.form__input_admin} ${styles.form__input_adminInputWidth}`}
                        label="Дата рождения"
                        placeholder="ДД.ММ.ГГГГ"
                        value={form.displayDateBirth}
                        onChange={form.handleDateBirthChange}
                        onBlur={() => form.handleBlur('dateBirth')}
                        error={!!form.getFieldError('dateBirth')}
                        errorText={form.getFieldError('dateBirth')}
                        required
                    />
                    <InputAdmin
                        className={`${styles.form__input_date} ${styles.form__input_admin} ${styles.form__input_adminInputWidth}`}
                        label="Дата смерти"
                        placeholder="ДД.ММ.ГГГГ"
                        value={form.displayDateDeath}
                        onChange={form.handleDateDeathChange}
                    />
                    <InputAdmin
                        className={`${styles.form__input_birthplace} ${styles.form__input_admin}`}
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

                <div className={`${styles.form__wrapper_firstLine} ${styles.form__wrapper_firstLine_admin}`}>
                    <InputAdmin
                        className={`${styles.form__input_additional} ${styles.form__input_admin} ${styles.form__input_adminInputWidth}`}
                        label="Воинское звание"
                        placeholder="Воинское звание"
                        value={form.formData.militaryRank}
                        onChange={(e) => form.handleInputChange('militaryRank', e.target.value)}
                    />
                    <InputAdmin
                        className={`${styles.form__input_additional} ${styles.form__input_admin} ${styles.form__input_adminInputWidth}`}
                        label="Место службы"
                        placeholder="Место службы"
                        value={form.formData.placeService}
                        onChange={(e) => form.handleInputChange('placeService', e.target.value)}
                    />
                    <InputAdmin
                        className={`${styles.form__input_additional} ${styles.form__input_admin}`}
                        label="Место призыва"
                        placeholder="Место призыва"
                        value={form.formData.placeConscription}
                        onChange={(e) => form.handleInputChange('placeConscription', e.target.value)}
                    />
                </div>

                <div className={styles.form__wrapper_thirdLine}>
                    <InputAdmin
                        className={`${styles.form__input_user} ${styles.form__input_admin}`}
                        label="ФИО и класс автора карточки"
                        placeholder="Введите Ф.И.О. и класс"
                        value={form.formData.nameAndClass}
                        onChange={(e) => form.handleInputChange('nameAndClass', e.target.value)}
                        onBlur={() => form.handleBlur('nameAndClass')}
                        error={!!form.getFieldError('nameAndClass')}
                        errorText={form.getFieldError('nameAndClass')}
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
                        value={form.formData.description}
                        onChange={(e) => form.handleInputChange('description', e.target.value)}
                        onBlur={() => form.handleBlur('description')}
                        resize="none"
                        labelPosition="top"
                        required
                    />
                </div>

                <div className={`${styles.form__wrapper_firstLine} ${styles.form__wrapper_firstLine_admin}`}>
                    <Button
                        type="submit"
                        className={styles.publishButton}
                        disabled={loading}
                    >
                        {loading ? 'Сохранение...' : 'Сохранить изменения'}
                    </Button>
                    <Button
                        type="button"
                        className={styles.reviewButton}
                        onClick={() => navigate(-1)}
                    >
                        Отмена
                    </Button>
                </div>
            </div>
        </form>
    );
}
