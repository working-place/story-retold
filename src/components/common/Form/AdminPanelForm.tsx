import { useState } from 'react';
import Button from "../../common/Button/Button";
import styles from "./AdminPanelForm.module.scss";
import { Textarea } from "../Textarea/Textarea";
import { InputAdmin } from "../Input/InputAdmin";
import CustomSelectAdmin from "../Select/SelectAdmin";
import PublishConfirmPopup from '../../admin/Popups/PublishConfirmPopup';
import SuccessPopup from '../../admin/Popups/SuccessPopup';
import { heroesApi } from '../../../services/api/heroes';
import { useObjectUrl, useObjectUrls } from "../../../hooks/useObjectUrl";
import { useCardForm } from "../../../hooks/useCardForm";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ReviewCardsTitle from '../../admin/ReviewCards/ReviewCardsTitle';

export default function AdminPanelForm() {
    const [loading, setLoading] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);

    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleExit = () => {
        logout();
        navigate("/login");
    };

    const form = useCardForm({ mode: 'create-admin' });

    const photoHeroUrl = useObjectUrl(form.photoHero);
    const additionalImageUrls = useObjectUrls(form.additionalImages);

    const submitForm = async () => {
        setIsPublishing(true);

        try {
            const submitData = form.buildSubmitData();

            const response = await heroesApi.create(submitData);

            if (response?.id) {
                await heroesApi.publish(response.id);
                setIsSuccessPopupOpen(true);
                form.resetForm();
            } else {
                form.setError('Не удалось создать карточку');
            }
        } catch (err) {
            console.error('❌ Ошибка:', err);
            const msg = err instanceof Error ? err.message : 'Произошла ошибка при создании карточки';
            form.setError(msg);
        } finally {
            setIsPublishing(false);
            setIsPopupOpen(false);
            setLoading(false);
        }
    };

    const handlePublishClick = async (e: React.FormEvent) => {
        e.preventDefault();

        form.setError(null);

        if (!form.validate()) {
            return;
        }
        setIsPopupOpen(true);
    };

    const handleConfirmPublish = () => {
        setLoading(true);
        void submitForm();
    };

    const handleCancelPublish = () => {
        setIsPopupOpen(false);
    };

    const handleSuccessPopupClose = () => {
        setIsSuccessPopupOpen(false);
    };

    const showPhotoBlock = form.formData.cardType === 'withoutPhoto';

    const handlePreview = () => {
        if (!form.validate()) {
            return;
        }

        const previewData = {
            name: form.formData.name,
            range: form.formData.militaryRank || '',
            dateOfBirth: form.formData.dateBirth,
            dateOfDeath: form.formData.dateDeath || '',
            img: photoHeroUrl || '',
            description: form.formData.description,
            placeBirth: form.formData.placeBirth,
            placeService: form.formData.placeService || '',
            placeConscription: form.formData.placeConscription || '',
            nameAndClass: form.formData.nameAndClass || '',
            additionalImages: additionalImageUrls,
            cardData: {
                additionalCardImages: form.additionalImages.map((file) => ({
                    image: URL.createObjectURL(file),
                })),
            },
        };

        localStorage.setItem('previewHeroData', JSON.stringify(previewData));
        window.open('/preview-hero', '_blank');
    };

    return (
        <>
            <form noValidate onSubmit={handlePublishClick} className={`${styles.form} ${styles.form_admin}`}>
                <div className={styles.exitContainer}>
                    <ReviewCardsTitle
                        title="Редактирование карточки"
                        onExit={handleExit}
                    />
                </div>
                <div className={styles.contentWrapper}>
                    <div className={`${styles.form__upload} ${styles.form__upload_admin}`}>
                        {/* <h1 className={`${styles.form__titleCard} ${styles.form__title_admin}`}>
                        Новая карточка
                    </h1> */}

                        {!showPhotoBlock && (
                            <div
                                className={`${styles.form__uploadArea} ${styles.form__uploadArea_primary} ${styles.form__uploadArea_admin} ${styles.form__uploadArea_adminHeightFirst}`}
                            >
                                {!form.photoHero ? (
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
                        )}

                        <div
                            className={`${styles.form__uploadArea} ${styles.form__uploadArea_secondary} ${styles.form__uploadArea_admin} ${styles.form__uploadArea_adminHeightSecond}`}
                        >
                            {additionalImageUrls.length < 1 && (
                                <div className={`${styles.form__titleWrapper} ${styles.form__titleWrapper_secondary}`}>
                                    <h3 className={`${styles.form__titleUpload} ${styles.form__titleUpload_admin}`}>
                                        Фотографии наград и другие материалы
                                    </h3>
                                    <h4 className={`${styles.form__subtitle} ${styles.form__subtitle_admin}`}>
                                        Максимальный размер файлов 4 MB. Максимум 9 изображений
                                    </h4>
                                </div>
                            )}

                            {additionalImageUrls.length > 0 && (
                                <div className={styles.additionalImagesGrid}>
                                    {additionalImageUrls.map((url, index) => (
                                        <div key={index} className={styles.additionalImageItem}>
                                            <div className={styles.additionalImageWrapper}>
                                                <img
                                                    src={url}
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

                            <input
                                type="file"
                                id="additionalImages"
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                multiple
                                onChange={(e) => {
                                    form.handleAdditionalImagesChange(e);
                                }}
                                style={{ display: 'none' }}
                                disabled={form.additionalImages.length >= 9}
                            />

                            {form.additionalImages.length < 9 && (
                                <Button
                                    type="button"
                                    className={`${styles.button_small} ${styles.button_admin}`}
                                    onClick={() => document.getElementById('additionalImages')?.click()}
                                    disabled={form.isCompressing}
                                >
                                    Выбрать файлы ({form.additionalImages.length}/9)
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className={`${styles.form__basicInformation} ${styles.form__basicInformation_admin}`}>
                        <div className={`${styles.form__wrapper_secondLine} ${styles.form__wrapper_admin}`}>
                            <div className={`${styles.form__wrapper_firstLine} ${styles.form__wrapper_firstLine_admin}`}>
                                <CustomSelectAdmin
                                    className={styles.selectForm}
                                    required
                                    onChapterChange={(value) => {
                                        if (value !== null) {
                                            form.handleChapterChange(value);
                                        }
                                    }}
                                    onCardTypeChange={(value) => {
                                        form.handleCardTypeChange(value ?? undefined);
                                    }}
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
                                maxLength={255}
                                showCounter={true}
                                required
                            />
                        </div>

                        <div className={`${styles.form__wrapper_firstLine} ${styles.form__wrapper_firstLine_admin}`}>
                            <Button
                                type="submit"
                                className={styles.publishButton}
                                disabled={loading || form.isCompressing}
                            >
                                {loading ? 'Отправка...' : 'Опубликовать'}
                            </Button>
                            <Button
                                type="button"
                                className={styles.reviewButton}
                                onClick={handlePreview}
                            >
                                Предпросмотр
                            </Button>
                        </div>
                    </div>
                </div>
            </form>

            <PublishConfirmPopup
                isOpen={isPopupOpen}
                onClose={handleCancelPublish}
                onConfirm={handleConfirmPublish}
                heroName={form.formData.name}
                isLoading={isPublishing}
            />

            <SuccessPopup
                isOpen={isSuccessPopupOpen}
                onClose={handleSuccessPopupClose}
                success="Карточка успешно создана!"
            />
        </>
    );
}
