import { MOCK_CARD_DATA, type CardData } from "../../../types/card.types";
import styles from "./Gallery.module.scss";
import { useState } from 'react';

interface GalleryProps {
  cardData?: CardData;
  title?: string;
  authorInfo?: string;
}

export default function Gallery({
  cardData = MOCK_CARD_DATA,
  title,
  authorInfo
}: GalleryProps) {

  const actualTitle = title || cardData.title;
  const actualAuthorInfo = authorInfo || `${cardData.author.lastName} ${cardData.author.firstName} ${cardData.author.patronymic || ''}, ${cardData.author.className} класс`;
  const actualImages = cardData.images || [];

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const getVisibleImages = (): {
    prev: string;
    current: string;
    next: string;
  } => {
    const total = actualImages.length;
    if (total === 0) {
      return { prev: '', current: '', next: '' };
    }

    const prevIndex = (currentIndex - 1 + total) % total;
    const nextIndex = (currentIndex + 1) % total;

    return {
      prev: actualImages[prevIndex],
      current: actualImages[currentIndex],
      next: actualImages[nextIndex],
    };
  };

  const { prev, current, next } = getVisibleImages();

  const handlePrev = (): void => {
    if (actualImages.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + actualImages.length) % actualImages.length);
  };

  const handleNext = (): void => {
    if (actualImages.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % actualImages.length);
  };

  if (actualImages.length === 0) {
    return (
      <section className={styles.gallery}>
        <h2 className={styles.gallery__title}>{actualTitle}</h2>
        <div className={styles.authorInfo}>
          <p>Информация о том, кто создал данную карточку</p>
          <p className={styles.authorName}>{actualAuthorInfo}</p>
        </div>
        <p className={styles.noImages}>Нет доступных изображений</p>
      </section>
    );
  }

  return (
    <section className={styles.gallery}>
      <h2 className={styles.gallery__title}>{actualTitle}</h2>

      <div className={styles.gallery__carousel}>
        <button
          className={`${styles.navButton} ${styles.prevButton}`}
          onClick={handlePrev}
          aria-label="Предыдущее фото"
          type="button"
        >
          <svg width="31" height="53" viewBox="0 0 31 53" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M27.5098 3L3.00028 26.3954L27.5098 49.7908" stroke="#F1E6D0" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

        </button>

        <div className={styles.gallery__imagesContainer}>
          <div className={`${styles.gallery__imageWrapper} ${styles.gallery__sideImage}`}>
            <img src={prev} alt="Предыдущее фото" />
          </div>

          <div className={`${styles.gallery__imageWrapper} ${styles.gallery__centerImage}`}>
            <img src={current} alt="Текущее фото" />
          </div>

          <div className={`${styles.gallery__imageWrapper} ${styles.gallery__sideImage}`}>
            <img src={next} alt="Следующее фото" />
          </div>
        </div>

        <button
          className={`${styles.gallery__navButton} ${styles.nextButton}`}
          onClick={handleNext}
          aria-label="Следующее фото"
          type="button"
        >
          <svg width="31" height="53" viewBox="0 0 31 53" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 49.791L27.5095 26.3956L3 3.00017" stroke="#F1E6D0" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

        </button>
      </div>

      <div className={styles.gallery__authorInfoBox}>
        <span className={styles.gallery__authorInfo}>Информация о том, кто создал данную карточку</span>
        <span className={styles.gallery__authorInfo}>{actualAuthorInfo}</span>
      </div>

    </section>
  );
}
