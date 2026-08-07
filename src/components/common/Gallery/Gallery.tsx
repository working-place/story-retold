import { buildImageUrl } from "../../../services/api/api";
import type { CardData } from "../../../types/card.types";
import styles from "./Gallery.module.scss";
import { useState } from 'react';

interface GalleryProps {
  cardData?: CardData;
  images?: string[];
  title?: string;
  authorInfo?: string;
}

export default function Gallery({
  cardData,
  images,
  title,
  authorInfo
}: GalleryProps) {

  // console.log('📸 Gallery cardData:', cardData);
  // console.log('📸 Gallery images (preview):', images);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const actualImages: string[] = images ?? (
    (cardData?.additionalCardImages || []).map(img => buildImageUrl(img.image))
  );

  if (actualImages.length === 0) {
    return null;
  }

  if (!cardData) {
    return null;
  }

  const actualTitle: string = title || "Награды и архивные материалы";
  const actualAuthorInfo: string = authorInfo || cardData.nameAndClass || "ФИО, Класс";

  const displayImages = actualImages;

  const handleImageError = (index: number) => {
    setImgErrors(prev => ({ ...prev, [index]: true }));
  };

  const getImageUrl = (index: number): string => {
    if (imgErrors[index]) {
      return '/fallback-img.png';
    }
    return displayImages[index];
  };

  const getVisibleImages = (): {
    prev: string;
    current: string;
    next: string;
  } => {
    const total = displayImages.length;

    if (actualImages.length > 0) {
      const prevIndex = (currentIndex - 1 + total) % total;
      const nextIndex = (currentIndex + 1) % total;
      return {
        prev: getImageUrl(prevIndex),
        current: getImageUrl(currentIndex),
        next: getImageUrl(nextIndex),
      };
    }

    return {
      prev: '/fallback-img.png',
      current: '/fallback-img.png',
      next: '/fallback-img.png',
    };
  };

  const { prev, current, next } = getVisibleImages();

  const handlePrev = (): void => {
    if (displayImages.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const handleNext = (): void => {
    if (displayImages.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const hasRealImages = actualImages.length > 0;

  return (
    <section className={styles.gallery}>
      <h2 className={styles.gallery__title}>{actualTitle}</h2>

      <div className={styles.gallery__carousel}>
        <button
          className={`${styles.gallery__navButton} ${styles.prevButton}`}
          onClick={handlePrev}
          aria-label="Предыдущее фото"
          type="button"
          disabled={!hasRealImages}
          style={{ opacity: !hasRealImages ? 0.5 : 1, cursor: !hasRealImages ? 'not-allowed' : 'pointer' }}
        >
          <svg width="31" height="53" viewBox="0 0 31 53" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M27.5098 3L3.00028 26.3954L27.5098 49.7908" stroke="#F1E6D0" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className={styles.gallery__imagesContainer}>
          <div className={`${styles.gallery__imageWrapper} ${styles.gallery__sideImage}`}>
            <img
              src={prev}
              alt="Предыдущее фото"
              onError={() => handleImageError((currentIndex - 1 + displayImages.length) % displayImages.length)}
            />
          </div>

          <div className={`${styles.gallery__imageWrapper} ${styles.gallery__centerImage}`}>
            <img
              src={current}
              alt="Текущее фото"
              onError={() => handleImageError(currentIndex)}
            />
          </div>

          <div className={`${styles.gallery__imageWrapper} ${styles.gallery__sideImage}`}>
            <img
              src={next}
              alt="Следующее фото"
              onError={() => handleImageError((currentIndex + 1) % displayImages.length)}
            />
          </div>
        </div>

        <button
          className={`${styles.gallery__navButton} ${styles.nextButton}`}
          onClick={handleNext}
          aria-label="Следующее фото"
          type="button"
          disabled={!hasRealImages}
          style={{ opacity: !hasRealImages ? 0.5 : 1, cursor: !hasRealImages ? 'not-allowed' : 'pointer' }}
        >
          <svg width="31" height="53" viewBox="0 0 31 53" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 49.791L27.5095 26.3956L3 3.00017" stroke="#F1E6D0" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className={styles.gallery__authorInfoBox}>
        <span className={styles.gallery__authorInfo}>{actualAuthorInfo}</span>
      </div>
    </section>
  );
}
