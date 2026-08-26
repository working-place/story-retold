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

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const rawImages: string[] = images ?? (
    (cardData?.additionalCardImages || []).map(img => buildImageUrl(img.image))
  );

  const actualImages = rawImages.length > 0 ? rawImages : ['/fallback-img.png'];
  const hasRealImages = rawImages.length > 0;

  const actualTitle: string = title || "Награды и архивные материалы";
  const actualAuthorInfo: string = authorInfo || cardData?.nameAndClass || "ФИО, Класс";

  const handleImageError = (index: number) => {
    setImgErrors(prev => ({ ...prev, [index]: true }));
  };

  const getImageUrl = (index: number): string => {
    if (imgErrors[index] || !hasRealImages) {
      return '/fallback-img.png';
    }
    return actualImages[index];
  };

  const getVisibleImages = (): {
    prev: string;
    current: string;
    next: string;
  } => {
    const total = actualImages.length;
    const prevIndex = (currentIndex - 1 + total) % total;
    const nextIndex = (currentIndex + 1) % total;

    return {
      prev: getImageUrl(prevIndex),
      current: getImageUrl(currentIndex),
      next: getImageUrl(nextIndex),
    };
  };

  const { prev, current, next } = getVisibleImages();

  const handlePrev = (): void => {
    if (!hasRealImages) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + actualImages.length) % actualImages.length);
  };

  const handleNext = (): void => {
    if (!hasRealImages) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % actualImages.length);
  };

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
              onError={() => handleImageError((currentIndex - 1 + actualImages.length) % actualImages.length)}
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
              onError={() => handleImageError((currentIndex + 1) % actualImages.length)}
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
