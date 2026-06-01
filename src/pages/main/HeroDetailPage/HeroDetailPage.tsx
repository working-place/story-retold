import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MainLayout from "../../../components/layout/MainLayout/MainLayout";
import styles from "./HeroDetailPage.module.scss";
import Gallery from "../../../components/common/Gallery/Gallery";
import { getHeroById } from "../../../services/api/heroes";
import type { Hero } from "../../../types/card.types";

export default function HeroDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [hero, setHero] = useState<Hero | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHero = async () => {
            if (!id) return;
            setLoading(true);
            setError(null);
            const heroData = await getHeroById(Number(id));
            if (heroData) {
                setHero(heroData);
            } else {
                setError('Герой не найден');
            }
            setLoading(false);
        };

        fetchHero();
    }, [id]);

    const hasPhoto = hero?.img && hero.img.trim() !== '';

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'неизвестно';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <MainLayout>
                <div className={styles.heroDetailPage}>
                    <div className={styles.loading}>Загрузка...</div>
                </div>
            </MainLayout>
        );
    }

    if (error || !hero) {
        return (
            <MainLayout>
                <div className={styles.heroDetailPage}>
                    <div className={styles.notFound}>
                        <h2>{error || 'Герой не найден'}</h2>
                        <button onClick={handleGoBack} className={styles.backButton}>
                            Вернуться назад
                        </button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (!hasPhoto) {
        return (
            <MainLayout>
                <div className={`${styles.heroDetailPage} ${styles.heroDetailPage_noPhoto}`}>
                    <section className={styles.heroDetailPage__pathContainer}>
                        <h3>Герои СССР/Все Герои/ Карточка героя</h3>
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
                                            <p className={styles.heroDetailPage__infoValue}>{formatDate(hero.dateOfBirth)}</p>
                                        </div>

                                        <div className={styles.heroDetailPage__infoRow}>
                                            <p className={styles.heroDetailPage__infoLabel}>Дата смерти:</p>
                                            <p className={styles.heroDetailPage__infoValue}>{formatDate(hero.dateOfDeath)}</p>
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
                            <Gallery cardData={hero.cardData} />
                        </section>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className={styles.heroDetailPage}>
                <section className={styles.heroDetailPage__pathContainer}>
                    <h3>Герои СССР/Все Герои/ Карточка героя</h3>
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
                                <p className={styles.heroDetailPage__infoValue}>{formatDate(hero.dateOfBirth)}</p>
                            </div>

                            <div className={styles.heroDetailPage__infoRow}>
                                <p className={styles.heroDetailPage__infoLabel}>Дата смерти:</p>
                                <p className={styles.heroDetailPage__infoValue}>{formatDate(hero.dateOfDeath)}</p>
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
                        <Gallery cardData={hero.cardData} />
                    </section>
                </div>
            </div>
        </MainLayout>
    );
}
