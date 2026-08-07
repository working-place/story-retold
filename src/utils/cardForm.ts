export type ChapterType = 'svo' | 'gpw';
export type CardType = 'withPhoto' | 'withoutPhoto';

export interface CardFormData {
  dateBirth: string;
  dateDeath?: string;
  placeBirth: string;
  name: string;
  nameAndClass: string;
  email?: string;
  description: string;
  militaryRank?: string;
  placeService?: string;
  placeConscription?: string;
  chapter: ChapterType;
  cardType?: CardType;
  consent?: boolean | number | string;
  privacyPolicy?: boolean | number | string;
}

export interface CardFilesInput {
  photoHero?: File | null;
  additionalImages?: File[];
}

export interface ExistingAdditionalImage {
  id: number;
  url: string;
  deleted?: boolean;
}

export const MAX_ADDITIONAL_IMAGES = 9; // Синхронизировано с UI (9 фото)
export const MAX_FILE_SIZE_MB = 4;

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
  chapter: 'svo',
  cardType: 'withoutPhoto',
};

export const REQUIRED_FIELDS: (keyof CardFormData)[] = [
  'name',
  'dateBirth',
  'placeBirth',
  'nameAndClass',
  'description',
  'chapter',
];

export const validateFileSize = (file: File): string | null => {
  const maxSizeInBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return `Размер файла "${file.name}" превышает ${MAX_FILE_SIZE_MB} МБ`;
  }
  return null;
};

export const getFieldError = (
  formData: CardFormData,
  touched: Record<string, boolean>,
  field: string
): string | undefined => {
  if (!touched[field]) return undefined;

  const key = field as keyof CardFormData;
  const value = formData[key];

  if (REQUIRED_FIELDS.includes(key) && (!value || String(value).trim() === '')) {
    return 'Это поле обязательно для заполнения';
  }

  return undefined;
};

export interface ValidateOptions {
  requireConsent?: boolean;
  isAgreed?: boolean;
  isPolicyAgreed?: boolean;
  hasPhoto?: boolean;
  existingPhoto?: boolean;
}

export const validateCardForm = (
  formData: CardFormData,
  options: ValidateOptions = {}
): { valid: boolean; error?: string } => {
  for (const field of REQUIRED_FIELDS) {
    const val = formData[field];
    if (!val || String(val).trim() === '') {
      return { valid: false, error: 'Пожалуйста, заполните все обязательные поля' };
    }
  }

  if (options.requireConsent) {
    if (!options.isAgreed || !options.isPolicyAgreed) {
      return {
        valid: false,
        error: 'Необходимо согласие с условиями и политикой конфиденциальности',
      };
    }
  }

  return { valid: true };
};

export const buildCardFormData = (
  formData: CardFormData,
  files: CardFilesInput,
  deletedImageIds: number[] = [],
  existingPhotoHero: string | null = null
): FormData => {
  const formDataObj = new FormData();

  const hasPhoto = Boolean(files.photoHero || existingPhotoHero);
  const cardType: CardType = hasPhoto ? 'withPhoto' : 'withoutPhoto';
  formDataObj.append('cardType', cardType);

  Object.entries(formData).forEach(([key, value]) => {
    if (
      key !== 'cardType' &&
      key !== 'consent' &&
      key !== 'privacyPolicy' &&
      value !== undefined &&
      value !== null
    ) {
      formDataObj.append(key, String(value));
    }
  });

  if (formData.consent) formDataObj.append('consent', '1');
  if (formData.privacyPolicy) formDataObj.append('privacyPolicy', '1');

  if (files.photoHero instanceof File) {
    formDataObj.append('photoHero', files.photoHero);
  }

  if (Array.isArray(files.additionalImages)) {
    files.additionalImages.forEach((file, index) => {
      if (file instanceof File) {
        formDataObj.append(`additionalCardImages[${index}][image]`, file);
      }
    });
  }

  if (deletedImageIds.length > 0) {
    deletedImageIds.forEach((id) => {
      formDataObj.append('deleted_images[]', String(id));
      formDataObj.append('deleted_image_ids[]', String(id));
    });
  }

  return formDataObj;
};
