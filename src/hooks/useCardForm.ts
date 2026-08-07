import { useState, useCallback } from 'react';
import {
  type CardFormData,
  EMPTY_CARD_FORM,
  REQUIRED_FIELDS,
  getFieldError as getFieldErrorUtil,
  validateCardForm,
  buildCardFormData,
  validateFileSize,
  MAX_ADDITIONAL_IMAGES,
} from '../utils/cardForm';
import { formatDateForApi, formatDateMask, formatApiDateForInput } from '../utils/date';
import { compressImage } from '../utils/imageCompression';
import type { CardResponse } from '../types/api.types';

export type CardFormMode = 'create-public' | 'create-admin' | 'edit';

export interface UseCardFormOptions {
  mode: CardFormMode;
}

export interface ExistingAdditionalImage {
  id: number;
  url: string;
  deleted?: boolean;
}

export interface UseCardFormReturn {
  formData: CardFormData;
  setFormData: React.Dispatch<React.SetStateAction<CardFormData>>;
  displayDateBirth: string;
  displayDateDeath: string;
  setDisplayDateBirth: React.Dispatch<React.SetStateAction<string>>;
  setDisplayDateDeath: React.Dispatch<React.SetStateAction<string>>;

  photoHero: File | null;
  setPhotoHero: (file: File | null) => void;
  additionalImages: File[];

  existingPhotoHero: string | null;
  setExistingPhotoHero: (url: string | null) => void;
  existingAdditionalImages: ExistingAdditionalImage[];
  setExistingAdditionalImages: React.Dispatch<React.SetStateAction<ExistingAdditionalImage[]>>;

  touched: Record<string, boolean>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  isCompressing: boolean;

  isAgreed: boolean;
  setIsAgreed: (v: boolean) => void;
  isPolicyAgreed: boolean;
  setIsPolicyAgreed: (v: boolean) => void;

  getFieldError: (field: string) => string | undefined;
  handleBlur: (field: string) => void;
  handleInputChange: (field: keyof CardFormData, value: string | boolean) => void;
  handleDateBirthChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDateDeathChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChapterChange: (value: CardFormData['chapter']) => void;
  handleCardTypeChange: (value: CardFormData['cardType']) => void;
  handlePhotoHeroChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAdditionalImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeAdditionalImage: (index: number, isExisting?: boolean) => void;
  validate: () => boolean;
  buildSubmitData: () => FormData;
  resetForm: () => void;
  hydrateFromCard: (card: CardResponse) => void;
  getDeletedImageIds: () => number[];
}

export function useCardForm({ mode }: UseCardFormOptions): UseCardFormReturn {
  const [formData, setFormData] = useState<CardFormData>(() => EMPTY_CARD_FORM);
  const [displayDateBirth, setDisplayDateBirth] = useState<string>('');
  const [displayDateDeath, setDisplayDateDeath] = useState<string>('');

  const [photoHero, setPhotoHero] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);

  const [existingPhotoHero, setExistingPhotoHero] = useState<string | null>(null);
  const [existingAdditionalImages, setExistingAdditionalImages] = useState<ExistingAdditionalImage[]>([]);

  const [touched, setTouched] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(REQUIRED_FIELDS.map((f) => [f, false]))
  );

  const [error, setError] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  const isPublic = mode === 'create-public';
  const [isAgreed, setIsAgreed] = useState<boolean>(false);
  const [isPolicyAgreed, setIsPolicyAgreed] = useState<boolean>(false);

  const hydrateFromCard = useCallback((card: CardResponse) => {
    const photoUrl = card.photoHero?.url || card.photoHero?.image || null;
    const hasPhoto = Boolean(photoUrl);

    setFormData({
      dateBirth: card.dateBirth || '',
      dateDeath: card.dateDeath || '',
      placeBirth: card.placeBirth || '',
      name: card.name || '',
      nameAndClass: card.nameAndClass || '',
      email: card.email || '',
      description: card.description || '',
      militaryRank: card.militaryRank || '',
      placeService: card.placeService || '',
      placeConscription: card.placeConscription || '',
      chapter: card.chapter,
      cardType: hasPhoto ? 'withPhoto' : (card.cardType || 'withoutPhoto'),
    });

    setDisplayDateBirth(formatApiDateForInput(card.dateBirth));
    setDisplayDateDeath(formatApiDateForInput(card.dateDeath));
    setExistingPhotoHero(photoUrl);

    const extraImages = card.additionalCardImages || [];
    setExistingAdditionalImages(
      extraImages.map((img) => ({
        id: img.id,
        url: img.image || img.url || '',
        deleted: false,
      }))
    );
  }, []);

  const getFieldError = useCallback(
    (field: string) => getFieldErrorUtil(formData, touched, field),
    [formData, touched]
  );

  const handleBlur = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleInputChange = useCallback(
    (field: keyof CardFormData, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setError(null);
    },
    []
  );

  const handleDateBirthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = formatDateMask(e.target.value);
    setDisplayDateBirth(maskedValue);
    setFormData((prev) => ({ ...prev, dateBirth: formatDateForApi(maskedValue) }));
    setError(null);
  }, []);

  const handleDateDeathChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = formatDateMask(e.target.value);
    setDisplayDateDeath(maskedValue);
    setFormData((prev) => ({ ...prev, dateDeath: formatDateForApi(maskedValue) }));
    setError(null);
  }, []);

  const handleChapterChange = useCallback((value: CardFormData['chapter']) => {
    setFormData((prev) => ({ ...prev, chapter: value }));
    setError(null);
  }, []);

  const handleCardTypeChange = useCallback((value: CardFormData['cardType']) => {
    setFormData((prev) => ({ ...prev, cardType: value }));
    setError(null);
  }, []);

  const handlePhotoHeroChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeError = validateFileSize(file);
      if (sizeError) {
        setError(sizeError);
        e.target.value = '';
        return;
      }
      setIsCompressing(true);
      try {
        const compressed = await compressImage(file);
        setPhotoHero(compressed);
        setFormData((prev) => ({ ...prev, cardType: 'withPhoto' }));
        setError(null);
      } finally {
        setIsCompressing(false);
      }
    }
    e.target.value = '';
  }, []);

  const handleAdditionalImagesChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);

        const oversized = files.find((f) => validateFileSize(f));
        if (oversized) {
          setError(`Файл "${oversized.name}" превышает 4 MB`);
          e.target.value = '';
          return;
        }

        const activeExistingImages = existingAdditionalImages.filter((img) => !img.deleted);
        const currentCount = additionalImages.length + activeExistingImages.length;
        const availableSlots = MAX_ADDITIONAL_IMAGES - currentCount;

        if (files.length > availableSlots) {
          setError(
            `Можно загрузить не более ${MAX_ADDITIONAL_IMAGES} изображений. Осталось ${availableSlots} мест(а)`
          );
          e.target.value = '';
          return;
        }

        setIsCompressing(true);
        try {
          const compressed = await Promise.all(files.map(compressImage));
          setAdditionalImages((prev) => [...prev, ...compressed]);
          setError(null);
        } finally {
          setIsCompressing(false);
        }
      }
      e.target.value = '';
    },
    [additionalImages.length, existingAdditionalImages]
  );

  const removeAdditionalImage = useCallback((index: number, isExisting = false) => {
    if (isExisting) {
      setExistingAdditionalImages((prev) => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index] = { ...updated[index], deleted: true };
        }
        return updated;
      });
    } else {
      setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
    }
  }, []);

  const getDeletedImageIds = useCallback((): number[] => {
    return existingAdditionalImages
      .filter((img) => img.deleted)
      .map((img) => img.id);
  }, [existingAdditionalImages]);

  const validate = useCallback((): boolean => {
    setTouched(Object.fromEntries(REQUIRED_FIELDS.map((f) => [f, true])));

    const result = validateCardForm(formData, {
      requireConsent: isPublic,
      isAgreed,
      isPolicyAgreed,
      hasPhoto: Boolean(photoHero),
      existingPhoto: Boolean(existingPhotoHero),
    });

    if (!result.valid) {
      setError(result.error || 'Проверьте обязательные поля');
      return false;
    }
    return true;
  }, [formData, isPublic, isAgreed, isPolicyAgreed, photoHero, existingPhotoHero]);

const buildSubmitData = useCallback(() => {
    return buildCardFormData(
      formData,
      { photoHero, additionalImages },
      getDeletedImageIds(),
      existingPhotoHero
    );
  }, [formData, photoHero, additionalImages, getDeletedImageIds, existingPhotoHero]);

  const resetForm = useCallback(() => {
    setFormData(EMPTY_CARD_FORM);
    setDisplayDateBirth('');
    setDisplayDateDeath('');
    setPhotoHero(null);
    setAdditionalImages([]);
    setExistingPhotoHero(null);
    setExistingAdditionalImages([]);
    setTouched(Object.fromEntries(REQUIRED_FIELDS.map((f) => [f, false])));
    setIsAgreed(false);
    setIsPolicyAgreed(false);
    setError(null);
  }, []);

  return {
    formData,
    setFormData,
    displayDateBirth,
    displayDateDeath,
    setDisplayDateBirth,
    setDisplayDateDeath,
    photoHero,
    setPhotoHero,
    additionalImages,
    existingPhotoHero,
    setExistingPhotoHero,
    existingAdditionalImages,
    setExistingAdditionalImages,
    touched,
    error,
    setError,
    isCompressing,
    isAgreed,
    setIsAgreed,
    isPolicyAgreed,
    setIsPolicyAgreed,
    getFieldError,
    handleBlur,
    handleInputChange,
    handleDateBirthChange,
    handleDateDeathChange,
    handleChapterChange,
    handleCardTypeChange,
    handlePhotoHeroChange,
    handleAdditionalImagesChange,
    removeAdditionalImage,
    validate,
    buildSubmitData,
    resetForm,
    hydrateFromCard,
    getDeletedImageIds,
  };
}
