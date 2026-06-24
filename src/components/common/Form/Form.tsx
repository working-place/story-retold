
// import { useState } from "react";
// import Button from "../../common/Button/Button";
// import styles from "./Form.module.scss";
// import CustomSelect from "../Select/Select";
// import { Checkbox } from "../Input/Checkox";
// import { Textarea } from "../Textarea/Textarea";
// import { Input } from "../Input/Input";

// export default function NewCardForm() {
//     const [isAgreed, setIsAgreed] = useState(false);
//     const [isPolicyAgreed, setIsPolicyAgreed] = useState(false);

//     return (
//         <form
//             action=""
//             className={styles.form}
//         >
//             <div className={styles.form__upload}>

//                 <div
//                     className={`${styles.form__uploadArea} ${styles.form__uploadArea_primary}`}
//                 >
//                     <img src="/image-download.png" alt="Загрузить" />

//                     <div className={`${styles.form__titleWrapper} ${styles.form__titleWrapper_primary}`}>
//                         <h3 className={styles.form__titleUpload}>
//                             Фотографии героя
//                         </h3>
//                         <h4 className={styles.form__subtitle}>
//                             Максимальный размер файла <br />
//                             ***** MB
//                         </h4>
//                     </div>
//                     <Button
//                         className={styles.button_small}
//                     >
//                         Выбрать файлы
//                     </Button>
//                 </div>
//                 <div
//                     className={`${styles.form__uploadArea} ${styles.form__uploadArea_secondary}`}
//                 >
//                     <div className={`${styles.form__titleWrapper} ${styles.form__titleWrapper_secondary}`}>
//                         <h3 className={styles.form__titleUpload}>
//                             Фотографии наград и другие <br />
//                             материалы
//                         </h3>
//                         <h4 className={styles.form__subtitle}>
//                             Максимальный размер <br />
//                             файлов ***** MB
//                         </h4>
//                     </div>
//                     <Button
//                         className={styles.button_small}
//                     >
//                         Выбрать файлы
//                     </Button>
//                 </div>
//             </div>
//             <div className={styles.form__basicInformation}>
//                 <h3 className={styles.form__title}>
//                     Основные сведения
//                 </h3>
//                 <div className={styles.form__wrapper_firstLine}>
//                     <Input
//                         className={styles.form__input_date}
//                         label="Дата рождения"
//                         placeholder="ДД.ММ.ГГ"
//                         required
//                     />
//                     <Input
//                         className={styles.form__input_date}
//                         label="Дата смерти"
//                         placeholder="ДД.ММ.ГГ"
//                     />
//                     <Input
//                         className={styles.form__input_birthplace}
//                         label="Место рождения"
//                         placeholder="Место рождения"
//                         required
//                     />
//                 </div>
//                 <div className={styles.form__wrapper_secondLine}>
//                     <Input
//                         className={styles.form__input_hero}
//                         label="Введите ФИО героя"
//                         placeholder="Введите Ф.И.О."
//                         required
//                     />
//                 </div>
//                 <div className={styles.form__wrapper_thirdLine}>
//                     <Input
//                         className={styles.form__input_user}
//                         label="ФИО и класс автора карточки"
//                         placeholder="Введите Ф.И.О. и класс"
//                         required
//                     />
//                     <Input
//                         className={styles.form__input_email}
//                         label="Почта"
//                         placeholder="Почта"
//                     />
//                 </div>
//                 <div className={styles.form__wrapper_fourthLine}>
//                     <Textarea
//                         label="Описание материала"
//                         placeholder="Введите описание"
//                         variant="_primary"
//                         size="large"
//                         labelPosition="top"
//                         required
//                     />
//                 </div>
//             </div>
//             <div className={styles.form__additionalInformation}>
//                 <h3 className={styles.form__title}>
//                     Дополнительные сведения
//                 </h3>
//                 <Input
//                     className={styles.form__input_additional}
//                     label="Воинское звание"
//                     placeholder="Введите описание"
//                 />
//                 <Input
//                     className={styles.form__input_additional}
//                     label="Место службы"
//                     placeholder="Введите описание"
//                 />
//                 <Input
//                     className={styles.form__input_additional}
//                     label="Место призыва"
//                     placeholder="Введите описание"
//                 />
//                 <CustomSelect
//                     className={styles.select}
//                 />
//                 <div className={styles.agreementContainer}>
//                     <div className={styles.checkboxWrapper}>
//                         <Checkbox
//                             label="Согласие на обработку персональных данных"
//                             checked={isAgreed}
//                             onChange={setIsAgreed}
//                             required
//                         />
//                         <a href="">Согласен(а) на обработку персональных данных</a>
//                     </div>
//                     <div className={styles.checkboxWrapper}>
//                         <Checkbox
//                             label="Политика обработки персональных данных "
//                             checked={isPolicyAgreed}
//                             onChange={setIsPolicyAgreed}
//                             required
//                         />
//                         <a href="">Я ознакомлен(а) с Политикой обработки персональных данных</a>
//                     </div>

//                     <Button
//                         className={styles.button}
//                     >Отправить сведения о герое</Button>
//                 </div>
//             </div>
//         </form>
//     );
// }

// components/common/Form/NewCardForm.tsx
import { useState } from "react";
import Button from "../../common/Button/Button";
import styles from "./Form.module.scss";
import CustomSelect from "../Select/Select";
import { Checkbox } from "../Input/Checkox";
import { Textarea } from "../Textarea/Textarea";
import { Input } from "../Input/Input";
import { httpClient } from '../../../services/http.client';

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

export default function NewCardForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [isAgreed, setIsAgreed] = useState(false);
    const [isPolicyAgreed, setIsPolicyAgreed] = useState(false);

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
        setFormData(prev => ({ ...prev, chapter: value }));
        setError(null);
    };

    const handleCardTypeChange = (value: 'withPhoto' | 'withoutPhoto' | null) => {
        setFormData(prev => ({ ...prev, cardType: value }));
        setError(null);
    };

    const handlePhotoHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 4 * 1024 * 1024) {
                setError('Размер файла не должен превышать 4 MB');
                return;
            }
            setPhotoHero(file);
            setError(null);
        }
        e.target.value = '';
    };

    const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const oversizedFile = files.find(file => file.size > 4 * 1024 * 1024);
            if (oversizedFile) {
                setError(`Файл "${oversizedFile.name}" превышает 4 MB`);
                return;
            }
            const currentCount = additionalImages.length;
            const availableSlots = 9 - currentCount;
            if (files.length > availableSlots) {
                setError(`Можно загрузить не более 9 изображений. Осталось ${availableSlots} мест(а)`);
                return;
            }
            setAdditionalImages(prev => [...prev, ...files]);
            setError(null);
        }
        e.target.value = '';
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

        if (!isAgreed) {
            setError('Необходимо согласие на обработку персональных данных');
            return false;
        }

        if (!isPolicyAgreed) {
            setError('Необходимо ознакомиться с Политикой обработки персональных данных');
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
        setIsAgreed(false);
        setIsPolicyAgreed(false);
        setTouched({
            name: false,
            dateBirth: false,
            placeBirth: false,
            nameAndClass: false,
            description: false,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
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

        setLoading(true);

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
            // Не отправляем published - по умолчанию будет false

            if (formData.dateDeath) submitData.append('dateDeath', formData.dateDeath);
            if (formData.email) submitData.append('email', formData.email);
            if (formData.militaryRank) submitData.append('militaryRank', formData.militaryRank);
            if (formData.placeService) submitData.append('placeService', formData.placeService);
            if (formData.placeConscription) submitData.append('placeConscription', formData.placeConscription);

            if (formData.cardType === 'withPhoto' && photoHero) {
                submitData.append('photoHero', photoHero);
            }

            additionalImages.forEach((img, index) => {
                submitData.append(`additionalCardImages[${index}][image]`, img);
            });

            // Отправка без авторизации (skipAuth: true)
            const response = await httpClient<{ id: number }>('/api/card/create', {
                method: 'POST',
                skipAuth: true,
                body: submitData,
            });

            if (response?.id) {
                setSuccess(true);
                resetForm();
                setTimeout(() => {
                    setSuccess(false);
                }, 5000);
            } else {
                setError('Не удалось создать карточку');
            }

        } catch (err) {
            console.error('Ошибка при создании карточки:', err);
            setError(err instanceof Error ? err.message : 'Произошла ошибка при создании карточки');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            {success && <div className={styles.successMessage}>Карточка успешно создана! Она будет опубликована после проверки администратором.</div>}

            <div className={styles.form__upload}>
                <div className={`${styles.form__uploadArea} ${styles.form__uploadArea_primary}`}>
                    {!photoHero ? (
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
                                onChange={handlePhotoHeroChange}
                                style={{ display: 'none' }}
                            />
                            <Button
                                type="button"
                                className={styles.button_small}
                                onClick={() => document.getElementById('photoHero')?.click()}
                            >
                                Выбрать файл
                            </Button>
                        </>
                    ) : (
                        <div className={styles.previewContainer}>
                            <div className={styles.previewImageWrapper}>
                                <img
                                    src={URL.createObjectURL(photoHero)}
                                    alt="Превью фото героя"
                                    className={styles.previewImage}
                                />
                                <button
                                    type="button"
                                    className={styles.removeImageButton}
                                    onClick={() => setPhotoHero(null)}
                                    aria-label="Удалить фото"
                                >
                                    ×
                                </button>
                            </div>
                            <div className={styles.previewInfo}>
                                <p className={styles.previewFileName}>{photoHero.name}</p>
                                <p className={styles.previewFileSize}>
                                    {(photoHero.size / 1024).toFixed(2)} KB
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
                                onChange={handlePhotoHeroChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                    )}
                </div>

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
                        onChange={handleAdditionalImagesChange}
                        style={{ display: 'none' }}
                        disabled={additionalImages.length >= 9}
                    />
                    <Button
                        type="button"
                        className={styles.button_small}
                        onClick={() => document.getElementById('additionalImages')?.click()}
                        disabled={additionalImages.length >= 9}
                    >
                        Выбрать файлы ({additionalImages.length}/9)
                    </Button>

                    {additionalImages.length > 0 && (
                        <div className={styles.additionalImagesGrid}>
                            {additionalImages.map((file, index) => (
                                <div key={index} className={styles.additionalImageItem}>
                                    <div className={styles.additionalImageWrapper}>
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Дополнительное фото ${index + 1}`}
                                            className={styles.additionalImagePreview}
                                        />
                                        <button
                                            type="button"
                                            className={styles.removeAdditionalImageButton}
                                            onClick={() => removeAdditionalImage(index)}
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
                        placeholder="ГГГГ-ММ-ДД"
                        value={formData.dateBirth}
                        onChange={(e) => handleInputChange('dateBirth', e.target.value)}
                        onBlur={() => handleBlur('dateBirth')}
                        error={!!getFieldError('dateBirth')}
                        errorText={getFieldError('dateBirth')}
                        required
                    />
                    <Input
                        className={styles.form__input_date}
                        label="Дата смерти"
                        placeholder="ГГГГ-ММ-ДД"
                        value={formData.dateDeath}
                        onChange={(e) => handleInputChange('dateDeath', e.target.value)}
                    />
                    <Input
                        className={styles.form__input_birthplace}
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

                <div className={styles.form__wrapper_secondLine}>
                    <Input
                        className={styles.form__input_hero}
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

                <div className={styles.form__wrapper_thirdLine}>
                    <Input
                        className={styles.form__input_user}
                        label="ФИО и класс автора карточки"
                        placeholder="Введите Ф.И.О. и класс"
                        value={formData.nameAndClass}
                        onChange={(e) => handleInputChange('nameAndClass', e.target.value)}
                        onBlur={() => handleBlur('nameAndClass')}
                        error={!!getFieldError('nameAndClass')}
                        errorText={getFieldError('nameAndClass')}
                        required
                    />
                    <Input
                        className={styles.form__input_email}
                        label="Почта"
                        placeholder="Почта"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                </div>

                <div className={styles.form__wrapper_fourthLine}>
                    <Textarea
                        label="Описание материала"
                        placeholder="Введите описание"
                        variant="_primary"
                        size="large"
                        labelPosition="top"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        onBlur={() => handleBlur('description')}
                        error={!!getFieldError('description')}
                        errorText={getFieldError('description')}
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
                        value={formData.militaryRank}
                        onChange={(e) => handleInputChange('militaryRank', e.target.value)}
                    />
                    <Input
                        className={styles.form__input_additional}
                        label="Место службы"
                        placeholder="Место службы"
                        value={formData.placeService}
                        onChange={(e) => handleInputChange('placeService', e.target.value)}
                    />
                    <Input
                        className={styles.form__input_additional}
                        label="Место призыва"
                        placeholder="Место призыва"
                        value={formData.placeConscription}
                        onChange={(e) => handleInputChange('placeConscription', e.target.value)}
                    />
                </div>

                {/* <CustomSelect
                    className={styles.select}
                    onChapterChange={handleChapterChange}
                    onCardTypeChange={handleCardTypeChange}
                /> */}


<CustomSelect
className={styles.select}
    key={formData.chapter} // Это пересоздаст компонент при изменении chapter
    initialChapter={formData.chapter}
    initialCardType={formData.cardType}
    onChapterChange={handleChapterChange}
    onCardTypeChange={handleCardTypeChange}
/>

                <div className={styles.agreementContainer}>
                    <div className={styles.checkboxWrapper}>
                        <Checkbox
                            label="Согласие на обработку персональных данных"
                            checked={isAgreed}
                            onChange={setIsAgreed}
                            required
                        />
                        <a href="/privacy-policy" target="_blank">Согласен(а) на обработку персональных данных</a>
                    </div>
                    <div className={styles.checkboxWrapper}>
                        <Checkbox
                            label="Политика обработки персональных данных"
                            checked={isPolicyAgreed}
                            onChange={setIsPolicyAgreed}
                            required
                        />
                        <a href="/privacy-policy" target="_blank">Я ознакомлен(а) с Политикой обработки персональных данных</a>
                    </div>

                    <Button
                        type="submit"
                        className={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Отправка...' : 'Отправить сведения о герое'}
                    </Button>
                </div>
            </div>
        </form>
    );
}
