
import styles from "./HeroDetailPage.module.scss";
import { useState } from "react";
import Gallery from "../../../components/common/Gallery/Gallery";
import { formatDateDisplay } from "../../../utils/date";
import type { Hero } from "../../../types/card.types";

export default function PreviewHeroPage() {

    const [hero] = useState<Hero | null>(() => {
        const previewData = localStorage.getItem('previewHeroData');
        if (previewData) {
            try {
                const parsed = JSON.parse(previewData);
                localStorage.removeItem('previewHeroData');
                return parsed;
            } catch (error) {
                console.error('Ошибка парсинга данных предпросмотра:', error);
                localStorage.removeItem('previewHeroData');
                return null;
            }
        }
        return null;
    });

    const hasPhoto = hero?.img && hero.img.trim() !== '';

    const handleGoBack = () => {
        window.close();
    };

    if (!hero) {
        return (
            <div className={styles.heroDetailPage}>
                <div className={styles.notFound}>
                    <h2>Нет данных для предпросмотра</h2>
                    <button onClick={handleGoBack} className={styles.backButton}>
                        Вернуться назад
                    </button>
                </div>
            </div>
        );
    }

    const additionalImageUrls = (hero.cardData?.additionalCardImages ?? [])
        .map(img => img.image)
        .filter(Boolean);

    if (!hasPhoto) {
        return (
            <div className={`${styles.heroDetailPage} ${styles.heroDetailPage_noPhoto}`}>
                <section className={styles.heroDetailPage__pathContainer}>
                    <h2>Предпросмотр карточки</h2>
                </section>

                <div className={styles.heroDetailPage__wrapper}>
                    <section className={styles.heroDetailPage__heroContent_noPhoto}>
                        <div className={styles.heroDetailPage__infoWrapper_noPhoto}>
                            <h1>Карточка героя</h1>
                            <h3 className={styles.heroDetailPage__heroName}>{hero.name}</h3>

                            <div className={styles.heroDetailPage__columnWrapper_noPhoto}>
                                <div className={styles.heroDetailPage__column_noPhoto}>
                                    <div className={styles.heroDetailPage__infoRow}>
                                        <p className={styles.heroDetailPage__infoLabel}>Звание:</p>
                                        <p className={styles.heroDetailPage__infoValue}>{hero.range}</p>
                                    </div>

                                    <div className={styles.heroDetailPage__infoRow}>
                                        <p className={styles.heroDetailPage__infoLabel}>Дата рождения:</p>
                                        <p className={styles.heroDetailPage__infoValue}>{formatDateDisplay(hero.dateOfBirth)}</p>
                                    </div>

                                    <div className={styles.heroDetailPage__infoRow}>
                                        <p className={styles.heroDetailPage__infoLabel}>Дата смерти:</p>
                                        <p className={styles.heroDetailPage__infoValue}>{formatDateDisplay(hero.dateOfDeath)}</p>
                                    </div>
                                </div>

                                <div className={styles.heroDetailPage__column_noPhoto}>
                                    <div className={styles.heroDetailPage__infoRow}>
                                        <span className={styles.heroDetailPage__infoLabel}>Место службы:</span>
                                        <span className={styles.heroDetailPage__infoValue}>{hero.placeService || "Внести Место службы"}</span>
                                    </div>

                                    <div className={styles.heroDetailPage__infoRow}>
                                        <span className={styles.heroDetailPage__infoLabel}>Место призыва:</span>
                                        <span className={styles.heroDetailPage__infoValue}>{hero.placeConscription || "Внести Место призыва"}</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>

                    <section className={styles.description}>
                        <h2>История героя</h2>
                        <pre className={styles.description__box}>
                            {hero.description || "Если в вашей семье есть человек, прошедший войну - его история должна быть сохранена."}
                            <img className={styles.description__pin1} src="/green-group-1.png" alt="" />
                            <img className={styles.description__pin2} src="/green-group-1.png" alt="" />
                            <img className={styles.description__pin3} src="/green-group-1.png" alt="" />
                            <img className={styles.description__pin4} src="/green-group-1.png" alt="" />
                        </pre>
                    </section>

                    <section className={styles.gallery}>
                        <Gallery
                            images={additionalImageUrls}
                            title="Награды и архивные материалы"
                            authorInfo={hero.nameAndClass}
                            cardData={hero.cardData}
                        />
                    </section>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.heroDetailPage}>
            <section className={styles.heroDetailPage__pathContainer}>
                <h3>Предпросмотр карточки</h3>
            </section>

            <div className={styles.heroDetailPage__wrapper}>
                <section className={styles.heroDetailPage__heroContent}>
                    <div className={styles.heroDetailPage__infoWrapper}>
                        <h1>Карточка героя</h1>
                        <h3 className={styles.heroDetailPage__heroName}>{hero.name}</h3>

                        <div className={styles.heroDetailPage__infoRow}>
                            <p className={styles.heroDetailPage__infoLabel}>Звание:</p>
                            <p className={styles.heroDetailPage__infoValue}>{hero.range}</p>
                        </div>

                        <div className={styles.heroDetailPage__infoRow}>
                            <p className={styles.heroDetailPage__infoLabel}>Дата рождения:</p>
                            <p className={styles.heroDetailPage__infoValue}>{formatDateDisplay(hero.dateOfBirth)}</p>
                        </div>

                        <div className={styles.heroDetailPage__infoRow}>
                            <p className={styles.heroDetailPage__infoLabel}>Дата смерти:</p>
                            <p className={styles.heroDetailPage__infoValue}>{formatDateDisplay(hero.dateOfDeath)}</p>
                        </div>

                        <div className={styles.heroDetailPage__infoRow}>
                            <span className={styles.heroDetailPage__infoLabel}>Место службы:</span>
                            <span className={styles.heroDetailPage__infoValue}>{hero.placeService || "Внести Место службы"}</span>
                        </div>

                        <div className={styles.heroDetailPage__infoRow}>
                            <span className={styles.heroDetailPage__infoLabel}>Место призыва:</span>
                            <span className={styles.heroDetailPage__infoValue}>{hero.placeConscription || "Внести Место призыва"}</span>
                        </div>
                    </div>

                    <img
                        className={styles.heroDetailPage__bgImage}
                        src="/bg-image.png"
                        alt="фон бумага"
                    />
                    <img
                        className={styles.heroDetailPage__bgPaper}
                        src="/bg-paper.png"
                        alt="фон бумага"
                    />

                    <div className={styles.heroDetailPage__heroImage}>
                        <img src={hero.img} alt={hero.name} />
                    </div>
                </section>

                <section className={styles.description}>
                    <h2>История героя</h2>
                    <pre className={styles.description__box}>
                        {hero.description || "Если в вашей семье есть человек, прошедший войну - его история должна быть сохранена."}
                        <img className={styles.description__pin1} src="/group-1.png" alt="" />
                        <img className={styles.description__pin2} src="/group-1.png" alt="" />
                        <img className={styles.description__pin3} src="/group-1.png" alt="" />
                        <img className={styles.description__pin4} src="/group-1.png" alt="" />
                    </pre>
                </section>

                <section className={styles.gallery}>
                    <Gallery
                        images={additionalImageUrls}
                        title="Награды и архивные материалы"
                        authorInfo={hero.nameAndClass}
                        cardData={hero.cardData}
                    />
                </section>
            </div>
        </div>
    );
}
