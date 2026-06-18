// components/common/Form/AdminPanelForm.tsx
import { useState } from 'react';
import Button from "../../common/Button/Button";
import styles from "./Form.module.scss";
import { Textarea } from "../Textarea/Textarea";
import { InputAdmin } from "../Input/InputAdmin";
import CustomSelectAdmin from "../Select/SelectAdmin";
import { httpClient } from '../../../services/http.client';
import PublishConfirmPopup from '../../admin/Popups/PublishConfirmPopup';
import { heroesApi } from '../../../services/api/heroes';


interface FormData {
    dateBirth: string;
    dateDeath: string;
    placeBirth: string;
    name: string;
    nameAndClass: string;
    email: string;
    description: string;
    militaryRank: string;
    placeService: string;
    placeConscription: string;
    chapter: 'svo' | 'gpw' | null;
    cardType: 'withPhoto' | 'withoutPhoto' | null;
}

export default function AdminPanelForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        dateBirth: '',
        dateDeath: '',
        placeBirth: '',
        name: '',
        nameAndClass: '',
        email: '',
        description: '',
        militaryRank: '',
        placeService: '',
        placeConscription: '',
        chapter: null,
        cardType: null,
    });

    const [photoHero, setPhotoHero] = useState<File | null>(null);
    const [additionalImages, setAdditionalImages] = useState<File[]>([]);

    const [touched, setTouched] = useState<Record<string, boolean>>({
        name: false,
        dateBirth: false,
        placeBirth: false,
        nameAndClass: false,
        description: false,
    });

    const getFieldError = (fieldName: string): string | undefined => {
        if (!touched[fieldName]) return undefined;

        switch (fieldName) {
            case 'name':
                return !formData.name ? 'Введите ФИО героя' : undefined;
            case 'dateBirth':
                return !formData.dateBirth ? 'Введите дату рождения' : undefined;
            case 'placeBirth':
                return !formData.placeBirth ? 'Введите место рождения' : undefined;
            case 'nameAndClass':
                return !formData.nameAndClass ? 'Введите ФИО и класс автора' : undefined;
            case 'description':
                return !formData.description ? 'Введите описание материала' : undefined;
            default:
                return undefined;
        }
    };

    const handleInputChange = (field: keyof FormData, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(null);
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleChapterChange = (value: 'svo' | 'gpw' | null) => {
        console.log('Chapter changed:', value);
        setFormData(prev => ({ ...prev, chapter: value }));
        setError(null);
    };

    const handleCardTypeChange = (value: 'withPhoto' | 'withoutPhoto' | null) => {
        console.log('CardType changed:', value);
        setFormData(prev => ({ ...prev, cardType: value }));
        setError(null);
    };

    const handlePhotoHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPhotoHero(e.target.files[0]);
            setError(null);
        }
    };

    const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setAdditionalImages(prev => [...prev, ...files]);
        }
    };

    const removeAdditionalImage = (index: number) => {
        setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    };

    const validateForm = (): boolean => {
        const requiredFields = ['name', 'dateBirth', 'placeBirth', 'nameAndClass', 'description'];

        for (const field of requiredFields) {
            if (!formData[field as keyof FormData]) {
                setError(`Пожалуйста, заполните все обязательные поля`);
                return false;
            }
        }

        if (!formData.chapter) {
            setError('Выберите раздел (Герой СССР или Герой СВО)');
            return false;
        }

        if (!formData.cardType) {
            setError('Выберите тип карточки');
            return false;
        }

        if (formData.cardType === 'withPhoto' && !photoHero) {
            setError('Для карточки с фото необходимо загрузить фотографию героя');
            return false;
        }

        return true;
    };

    const resetForm = () => {
        setFormData({
            dateBirth: '',
            dateDeath: '',
            placeBirth: '',
            name: '',
            nameAndClass: '',
            email: '',
            description: '',
            militaryRank: '',
            placeService: '',
            placeConscription: '',
            chapter: null,
            cardType: null,
        });
        setPhotoHero(null);
        setAdditionalImages([]);
        setTouched({
            name: false,
            dateBirth: false,
            placeBirth: false,
            nameAndClass: false,
            description: false,
        });
    };

    const submitForm = async () => {
        setIsPublishing(true);

        try {
            const submitData = new FormData();

            submitData.append('dateBirth', formData.dateBirth);
            submitData.append('placeBirth', formData.placeBirth);
            submitData.append('name', formData.name);
            submitData.append('nameAndClass', formData.nameAndClass);
            submitData.append('description', formData.description);
            submitData.append('chapter', formData.chapter!);
            submitData.append('cardType', formData.cardType!);
            submitData.append('consent', '1');
            submitData.append('privacyPolicy', '1');

            if (formData.dateDeath) submitData.append('dateDeath', formData.dateDeath);
            if (formData.email) submitData.append('email', formData.email);
            if (formData.militaryRank) submitData.append('militaryRank', formData.militaryRank);
            if (formData.placeService) submitData.append('placeService', formData.placeService);
            if (formData.placeConscription) submitData.append('placeConscription', formData.placeConscription);

            if (photoHero) {
                submitData.append('photoHero', photoHero);
            }

            additionalImages.forEach((img, index) => {
                submitData.append(`additionalCardImages[${index}][image]`, img);
            });

            const response = await heroesApi.create(submitData);
            console.log('Карточка создана:', response);

            if (response?.id) {
                await httpClient<void>(`/api/card/update/${response.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        published: true,
                    }),
                });
                console.log('Карточка опубликована, id:', response.id);
                setSuccess(true);
                resetForm();
            } else {
                setError('Не удалось создать карточку');
            }

        } catch (err) {
            console.error('Ошибка при создании карточки:', err);
            setError(err instanceof Error ? err.message : 'Произошла ошибка при создании карточки');
        } finally {
            setIsPublishing(false);
            setIsPopupOpen(false);
            setLoading(false);
        }
    };

    const handlePublishClick = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        setTouched({
            name: true,
            dateBirth: true,
            placeBirth: true,
            nameAndClass: true,
            description: true,
        });

        if (!validateForm()) {
            return;
        }

        setIsPopupOpen(true);
    };

    const handleConfirmPublish = () => {
        setLoading(true);
        submitForm();
    };

    const handleCancelPublish = () => {
        setIsPopupOpen(false);
    };

    return (
        <>
            <form onSubmit={handlePublishClick} className={`${styles.form} ${styles.form_admin}`}>
                {error && <div className={styles.errorMessage}>{error}</div>}
                {success && <div className={styles.successMessage}>Карточка успешно создана!</div>}

                <div className={`${styles.form__upload} ${styles.form__upload_admin}`}>
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
                                Максимальный размер файла 4 MB
                            </h4>
                        </div>
                        <input
                            type="file"
                            id="photoHero"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={handlePhotoHeroChange}
                            style={{ display: 'none' }}
                        />
                        <Button
                            type="button"
                            className={`${styles.button_small} ${styles.button_admin}`}
                            onClick={() => document.getElementById('photoHero')?.click()}
                        >
                            {photoHero ? photoHero.name : 'Выбрать файл'}
                        </Button>
                    </div>

                    <div
                        className={`${styles.form__uploadArea} ${styles.form__uploadArea_secondary} ${styles.form__uploadArea_admin} ${styles.form__uploadArea_adminHeightSecond}`}
                    >
                        <div className={`${styles.form__titleWrapper} ${styles.form__titleWrapper_secondary}`}>
                            <h3 className={`${styles.form__titleUpload} ${styles.form__titleUpload_admin}`}>
                                Фотографии наград и другие материалы
                            </h3>
                            <h4 className={`${styles.form__subtitle} ${styles.form__subtitle_admin}`}>
                                Максимальный размер файлов 4 MB
                            </h4>
                        </div>
                        <input
                            type="file"
                            id="additionalImages"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            multiple
                            onChange={handleAdditionalImagesChange}
                            style={{ display: 'none' }}
                        />
                        <Button
                            type="button"
                            className={`${styles.button_small} ${styles.button_admin}`}
                            onClick={() => document.getElementById('additionalImages')?.click()}
                        >
                            Выбрать файлы ({additionalImages.length})
                        </Button>
                        {additionalImages.length > 0 && (
                            <div className={styles.fileList}>
                                {additionalImages.map((file, index) => (
                                    <div key={index} className={styles.fileItem}>
                                        <span>{file.name}</span>
                                        <button type="button" onClick={() => removeAdditionalImage(index)}>×</button>
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
                                onChapterChange={handleChapterChange}
                                onCardTypeChange={handleCardTypeChange}
                            />
                        </div>
                        <InputAdmin
                            className={`${styles.form__input_hero} ${styles.form__input_admin}`}
                            label="Введите ФИО героя"
                            placeholder="Введите Ф.И.О."
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            onBlur={() => handleBlur('name')}
                            error={!!getFieldError('name')}
                            errorText={getFieldError('name')}
                            required
                        />
                    </div>

                    <div className={`${styles.form__wrapper_firstLine} ${styles.form__wrapper_firstLine_admin}`}>
                        <InputAdmin
                            className={`${styles.form__input_date} ${styles.form__input_admin} ${styles.form__input_adminInputWidth}`}
                            label="Дата рождения"
                            placeholder="ГГГГ-ММ-ДД"
                            value={formData.dateBirth}
                            onChange={(e) => handleInputChange('dateBirth', e.target.value)}
                            onBlur={() => handleBlur('dateBirth')}
                            error={!!getFieldError('dateBirth')}
                            errorText={getFieldError('dateBirth')}
                            required
                        />
                        <InputAdmin
                            className={`${styles.form__input_date} ${styles.form__input_admin} ${styles.form__input_adminInputWidth}`}
                            label="Дата смерти"
                            placeholder="ГГГГ-ММ-ДД"
                            value={formData.dateDeath}
                            onChange={(e) => handleInputChange('dateDeath', e.target.value)}
                        />
                        <InputAdmin
                            className={`${styles.form__input_birthplace} ${styles.form__input_admin}`}
                            label="Место рождения"
                            placeholder="Место рождения"
                            value={formData.placeBirth}
                            onChange={(e) => handleInputChange('placeBirth', e.target.value)}
                            onBlur={() => handleBlur('placeBirth')}
                            error={!!getFieldError('placeBirth')}
                            errorText={getFieldError('placeBirth')}
                            required
                        />
                    </div>

                    <div className={`${styles.form__wrapper_firstLine} ${styles.form__wrapper_firstLine_admin}`}>
                        <InputAdmin
                            className={`${styles.form__input_additional} ${styles.form__input_admin} ${styles.form__input_adminInputWidth}`}
                            label="Воинское звание"
                            placeholder="Воинское звание"
                            value={formData.militaryRank}
                            onChange={(e) => handleInputChange('militaryRank', e.target.value)}
                        />
                        <InputAdmin
                            className={`${styles.form__input_additional} ${styles.form__input_admin} ${styles.form__input_adminInputWidth}`}
                            label="Место службы"
                            placeholder="Место службы"
                            value={formData.placeService}
                            onChange={(e) => handleInputChange('placeService', e.target.value)}
                        />
                        <InputAdmin
                            className={`${styles.form__input_additional} ${styles.form__input_admin}`}
                            label="Место призыва"
                            placeholder="Место призыва"
                            value={formData.placeConscription}
                            onChange={(e) => handleInputChange('placeConscription', e.target.value)}
                        />
                    </div>

                    <div className={styles.form__wrapper_thirdLine}>
                        <InputAdmin
                            className={`${styles.form__input_user} ${styles.form__input_admin}`}
                            label="ФИО и класс автора карточки"
                            placeholder="Введите Ф.И.О. и класс"
                            value={formData.nameAndClass}
                            onChange={(e) => handleInputChange('nameAndClass', e.target.value)}
                            onBlur={() => handleBlur('nameAndClass')}
                            error={!!getFieldError('nameAndClass')}
                            errorText={getFieldError('nameAndClass')}
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
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            onBlur={() => handleBlur('description')}
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
                            {loading ? 'Отправка...' : 'Опубликовать'}
                        </Button>
                        <Button
                            type="button"
                            className={styles.reviewButton}
                        >
                            Предпросмотр
                        </Button>
                    </div>
                </div>
            </form>

            <PublishConfirmPopup
                isOpen={isPopupOpen}
                onClose={handleCancelPublish}
                onConfirm={handleConfirmPublish}
                heroName={formData.name}
                isLoading={isPublishing}
            />
        </>
    );
}
