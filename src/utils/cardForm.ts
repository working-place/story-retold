import type { Chapter, CardType } from '../types/api.types';

/** Форма карточки героя — общая для создания (публичная/админ) и редактирования. */
export interface CardFormData {
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
  chapter: Chapter | null;
  cardType: CardType | null;
}

export const EMPTY_CARD_FORM: CardFormData = {
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
};

/** Поля, обязательные к заполнению во всех режимах. */
export const REQUIRED_FIELDS = ['name', 'dateBirth', 'placeBirth', 'nameAndClass', 'description'] as const;
export type RequiredField = (typeof REQUIRED_FIELDS)[number];

/** Человекочитаемые сообщения об ошибках для обязательных полей. */
export const FIELD_ERROR_MESSAGES: Record<RequiredField, string> = {
  name: 'Введите ФИО героя',
  dateBirth: 'Введите дату рождения',
  placeBirth: 'Введите место рождения',
  nameAndClass: 'Введите ФИО и класс автора',
  description: 'Введите описание материала',
};

export const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB
export const MAX_ADDITIONAL_IMAGES = 9;

export function getFieldError(
  formData: CardFormData,
  touched: Record<string, boolean>,
  field: string
): string | undefined {
  if (!touched[field]) return undefined;

  const requiredField = REQUIRED_FIELDS.find((f) => f === field);
  if (requiredField && !formData[requiredField]) {
    return FIELD_ERROR_MESSAGES[requiredField];
  }
  return undefined;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Валидация формы карточки. Логика общая для всех режимов.
 * `requireConsent` — публичная форма требует согласий, админская — нет.
 * `photoHero` / `existingPhotoHero` — нужны, чтобы проверить фото для карточки с фото.
 */
export function validateCardForm(
  formData: CardFormData,
  options: {
    requireConsent?: boolean;
    isAgreed?: boolean;
    isPolicyAgreed?: boolean;
    hasPhoto?: boolean;
    existingPhoto?: boolean;
  } = {}
): ValidationResult {
  const { requireConsent = false, isAgreed, isPolicyAgreed, hasPhoto, existingPhoto } = options;

  for (const field of REQUIRED_FIELDS) {
    if (!formData[field]) {
      return { valid: false, error: 'Пожалуйста, заполните все обязательные поля' };
    }
  }

  if (!formData.chapter) {
    return { valid: false, error: 'Выберите раздел (Герой СССР или Герой СВО)' };
  }

  if (!formData.cardType) {
    return { valid: false, error: 'Выберите тип карточки' };
  }

  if (formData.cardType === 'withPhoto' && !hasPhoto && !existingPhoto) {
    return { valid: false, error: 'Для карточки с фото необходимо загрузить фотографию героя' };
  }

  if (requireConsent && !isAgreed) {
    return { valid: false, error: 'Необходимо согласие на обработку персональных данных' };
  }

  if (requireConsent && !isPolicyAgreed) {
    return { valid: false, error: 'Необходимо ознакомиться с Политикой обработки персональных данных' };
  }

  return { valid: true };
}

/** Строит FormData для отправки на сервер из состояния формы. */
export function buildCardFormData(
  formData: CardFormData,
  options: {
    photoHero?: File | null;
    additionalImages?: File[];
  } = {}
): FormData {
  const { photoHero, additionalImages = [] } = options;
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

  if (formData.cardType === 'withPhoto' && photoHero) {
    submitData.append('photoHero', photoHero);
  }

  additionalImages.forEach((img, index) => {
    submitData.append(`additionalCardImages[${index}][image]`, img);
  });

  return submitData;
}

/** Проверка размера файла. Возвращает текст ошибки или null. */
export function validateFileSize(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return 'Размер файла не должен превышать 4 MB';
  }
  return null;
}
