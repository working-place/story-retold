import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from "../../common/Button/Button";
import styles from "./AdminPanelForm.module.scss";
import { Textarea } from "../Textarea/Textarea";
import { InputAdmin } from "../Input/InputAdmin";
import CustomSelectAdmin from "../Select/SelectAdmin";
import { heroesApi, ApiError } from '../../../services/api/heroes';
import { buildImageUrl } from '../../../services/api/api';
import { useObjectUrl } from "../../../hooks/useObjectUrl";
import { useCardForm } from "../../../hooks/useCardForm";
import type { CardResponse } from '../../../types/api.types';
import PublishConfirmPopup from '../../admin/Popups/PublishConfirmPopup';
import SuccessPopup from '../../admin/Popups/SuccessPopup';
import ReviewCardsTitle from '../../admin/ReviewCards/ReviewCardsTitle';
import { useAuth } from "../../../contexts/AuthContext";

export default function AdminEditForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [loading, setLoading] = useState<boolean>(false);
    const [fetchLoading, setFetchLoading] = useState<boolean>(true);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [isPublishing, setIsPublishing] = useState<boolean>(false);
    const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState<boolean>(false);

    const form = useCardForm({ mode: 'edit' });

    const photoHeroUrl = useObjectUrl(form.photoHero);

    const additionalImageUrls = useMemo(() => {
        return form.additionalImages.map((file) => URL.createObjectURL(file));
    }, [form.additionalImages]);

    useEffect(() => {
        return () => {
            additionalImageUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [additionalImageUrls]);

    const showPhotoBlock =
        form.formData.cardType === 'withPhoto' ||
        Boolean(form.photoHero) ||
        Boolean(form.existingPhotoHero);

    useEffect(() => {
        const fetchHero = async () => {
            if (!id) {
                setFetchLoading(false);
                return;
            }

            setFetchLoading(true);
            try {
                const heroData: CardResponse = await heroesApi.get(Number(id));
                form.hydrateFromCard({
                    ...heroData,
                    photoHero: typeof heroData.photoHero === 'string'
                        ? { path: heroData.photoHero, url: heroData.photoHero, id: 0 }
                        : heroData.photoHero
                });
                form.setError(null);
            } catch (err) {
                form.setError(err instanceof ApiError
                    ? `Ошибка сервера: ${err.message}`
                    : 'Не удалось загрузить данные героя');
            } finally {
                setFetchLoading(false);
            }
        };

        fetchHero();
    }, [id, form.hydrateFromCard]);

    const handleRemoveAdditionalImage = useCallback((index: number, isExisting: boolean) => {
        form.removeAdditionalImage(index, isExisting);
    }, [form]);

    const handleExit = useCallback(() => {
        logout();
        navigate("/login");
    }, [logout, navigate]);

    const submitForm = useCallback(async () => {
        if (loading || isPublishing) return;

        if (!id) {
            form.setError('ID карточки не найден');
            return;
        }

        setIsPublishing(true);

        try {
            const submitData = form.buildSubmitData();

            await heroesApi.update(Number(id), submitData);

            const updatedHero: CardResponse = await heroesApi.get(Number(id));

            if (updatedHero && updatedHero.id) {
                if ('publish' in heroesApi && typeof (heroesApi as { publish?: (id: number) => Promise<unknown> }).publish === 'function') {
                    await (heroesApi as { publish: (id: number) => Promise<unknown> }).publish(updatedHero.id);
                }

                setIsSuccessPopupOpen(true);
                setTimeout(() => {
                    navigate('/admin-heroes/svo-heroes');
                }, 1500);
            } else {
                form.setError('Не удалось получить обновленную карточку');
            }
        } catch (err) {
            console.error('❌ Ошибка:', err);
            const msg = err instanceof Error ? err.message : 'Произошла ошибка при обновлении карточки';
            form.setError(msg);
        } finally {
            setIsPublishing(false);
            setIsPopupOpen(false);
            setLoading(false);
        }
    }, [id, form, loading, isPublishing, navigate]);

    const handlePublishClick = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        form.setError(null);
        if (!form.validate()) {
            return;
        }
        setIsPopupOpen(true);
    }, [form]);

    const handleConfirmPublish = useCallback(() => {
        setLoading(true);
        submitForm();
    }, [submitForm]);

    const handleCancelPublish = useCallback(() => {
        setIsPopupOpen(false);
    }, []);

    const handleSuccessPopupClose = useCallback(() => {
        setIsSuccessPopupOpen(false);
        navigate('/admin-heroes/svo-heroes');
    }, [navigate]);

    const handlePreview = useCallback(() => {
        if (!form.validate()) {
            return;
        }

        let heroImageUrl = '';
        if (form.photoHero) {
            heroImageUrl = photoHeroUrl || '';
        } else if (form.existingPhotoHero) {
            heroImageUrl = buildImageUrl(form.existingPhotoHero);
        }

        const activeExistingImages = form.existingAdditionalImages.filter(img => !img.deleted);
        const previewAdditionalImages = [
            ...activeExistingImages.map(img => buildImageUrl(img.url)),
            ...additionalImageUrls
        ];

        const previewData = {
            name: form.formData.name,
            range: form.formData.militaryRank || '',
            dateOfBirth: form.formData.dateBirth,
            dateOfDeath: form.formData.dateDeath || '',
            img: heroImageUrl,
            description: form.formData.description,
            placeBirth: form.formData.placeBirth,
            placeService: form.formData.placeService || '',
            placeConscription: form.formData.placeConscription || '',
            nameAndClass: form.formData.nameAndClass || '',
            additionalImages: previewAdditionalImages,
            cardData: {
                additionalCardImages: form.additionalImages.map((file) => ({
                    image: URL.createObjectURL(file),
                })),
            },
        };

        localStorage.setItem('previewHeroData', JSON.stringify(previewData));
        window.open('/preview-hero', '_blank');
    }, [form, photoHeroUrl, additionalImageUrls]);

    const getHeroImageUrl = useCallback((): string => {
        if (form.photoHero) {
            return photoHeroUrl || '';
        }
        if (form.existingPhotoHero) {
            return buildImageUrl(form.existingPhotoHero);
        }
        return '';
    }, [form.photoHero, form.existingPhotoHero, photoHeroUrl]);

    const getAdditionalImageUrl = useCallback((img: { id: number; url: string; deleted?: boolean }): string => {
        return buildImageUrl(img.url);
    }, []);

    if (fetchLoading) {
        return (
            <div className={styles.info}>
                <div className={styles.loading}>Загрузка данных...</div>
            </div>
        );
    }

    const activeExistingImages = form.existingAdditionalImages.filter(img => !img.deleted);
    const totalImagesCount = form.additionalImages.length + activeExistingImages.length;

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
                    {form.error && <div className={styles.errorMessage}>{form.error}</div>}

                    <div className={`${styles.form__upload} ${styles.form__upload_admin}`}>
                        {showPhotoBlock && (
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
                                            disabled={form.isCompressing}
                                        >
                                            Выбрать файл
                                        </Button>
                                    </>
                                ) : (
                                    <div className={styles.previewContainer}>
                                        <div className={styles.previewImageWrapper}>
                                            <img
                                                src={getHeroImageUrl()}
                                                alt="Превью фото героя"
                                                className={styles.previewImage}
                                                onError={(e) => {
                                                    console.error('❌ Ошибка загрузки фото:', e);
                                                    e.currentTarget.src = '/404_pic_mob.webp';
                                                }}
                                            />
                                            <button
                                                type="button"
                                                className={styles.removeImageButton}
                                                onClick={() => {
                                                    form.setPhotoHero(null);
                                                    form.setExistingPhotoHero(null);
                                                    form.handleCardTypeChange('withoutPhoto');
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
                                                disabled={form.isCompressing}
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

                        <div className={`${styles.form__uploadArea} ${styles.form__uploadArea_secondary} ${styles.form__uploadArea_admin} ${styles.form__uploadArea_adminHeightSecond}`}>
                            {totalImagesCount < 1 && (
                                <div className={`${styles.form__titleWrapper} ${styles.form__titleWrapper_secondary}`}>
                                    <h3 className={`${styles.form__titleUpload} ${styles.form__titleUpload_admin}`}>
                                        Фотографии наград и другие материалы
                                    </h3>
                                    <h4 className={`${styles.form__subtitle} ${styles.form__subtitle_admin}`}>
                                        Максимальный размер файлов 4 MB. Максимум 9 изображений
                                    </h4>
                                </div>
                            )}

                            {activeExistingImages.length > 0 && (
                                <div className={styles.additionalImagesGrid}>
                                    {activeExistingImages.map((img) => {
                                        const realIndex = form.existingAdditionalImages.findIndex(
                                            (item) => item.id === img.id
                                        );
                                        return (
                                            <div key={`existing-${img.id}`} className={styles.additionalImageItem}>
                                                <div className={styles.additionalImageWrapper}>
                                                    <img
                                                        src={getAdditionalImageUrl(img)}
                                                        alt="Дополнительное фото"
                                                        className={styles.additionalImagePreview}
                                                        onError={(e) => {
                                                            console.error('❌ Ошибка загрузки дополнительного фото:', e);
                                                            e.currentTarget.src = '/placeholder-image.png';
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className={styles.removeAdditionalImageButton}
                                                        onClick={() => handleRemoveAdditionalImage(realIndex, true)}
                                                        aria-label="Удалить фото"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {form.additionalImages.length > 0 && (
                                <div className={styles.additionalImagesGrid}>
                                    {form.additionalImages.map((_, index) => (
                                        <div key={`new-${index}`} className={styles.additionalImageItem}>
                                            <div className={styles.additionalImageWrapper}>
                                                <img
                                                    src={additionalImageUrls[index]}
                                                    alt="Новое дополнительное фото"
                                                    className={styles.additionalImagePreview}
                                                    onError={(e) => {
                                                        console.error('❌ Ошибка загрузки нового дополнительного фото:', e);
                                                        e.currentTarget.src = '/placeholder-image.png';
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    className={styles.removeAdditionalImageButton}
                                                    onClick={() => handleRemoveAdditionalImage(index, false)}
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
                                onChange={form.handleAdditionalImagesChange}
                                style={{ display: 'none' }}
                                disabled={totalImagesCount >= 9}
                            />

                            {totalImagesCount < 9 && (
                                <Button
                                    type="button"
                                    className={`${styles.button_small} ${styles.button_admin}`}
                                    onClick={() => document.getElementById('additionalImages')?.click()}
                                    disabled={form.isCompressing}
                                >
                                    Выбрать файлы ({totalImagesCount}/9)
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
                                {loading ? 'Публикация...' : 'Опубликовать изменения'}
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
                success="Карточка успешно обновлена и опубликована!"
            />
        </>
    );
}
