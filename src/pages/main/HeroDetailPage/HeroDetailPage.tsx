import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import MainLayout from "../../../components/layout/MainLayout/MainLayout";
import styles from "./HeroDetailPage.module.scss";
import { heroesData } from "../../../data/data";
import Gallery from "../../../components/common/Gallery/Gallery";

interface HeroDetailPageProps {
    text?: string | undefined;
}

export default function HeroDetailPage({ text }: HeroDetailPageProps) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const hero = useMemo(() => {
        const heroId = Number(id);
        return heroesData.find(h => h.id === heroId);
    }, [id]);

    const formatDate = (dateString: string | number | Date | null) => {
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

    if (!hero) {
        return (
            <MainLayout>
                <div className={styles.heroDetailPage}>
                    <div className={styles.notFound}>
                        <h2>Герой не найден</h2>
                        <button onClick={handleGoBack} className={styles.backButton}>
                            Вернуться назад
                        </button>
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
                                <span className={styles.heroDetailPage__infoValue}>Внести Место призыва Внести Место призыва Внести Место призыва Внести Место призыва</span>
                            </div>

                            <div className={styles.heroDetailPage__infoRow}>
                                <span className={styles.heroDetailPage__infoLabel}>Место призыва:</span>
                                <span className={styles.heroDetailPage__infoValue}>Внести Место призыва Внести Место призыва Внести Место призыва Внести Место призыва</span>
                            </div>

                        </div>

                        <img
                            className={styles.heroDetailPage__bgImage}
                            src="/bg-image.png"
                            alt="фон бумага" />
                        <img
                            className={styles.heroDetailPage__bgPaper}
                            src="/bg-paper.png"
                            alt="фон бумага" />
                        <div className={styles.heroDetailPage__heroImage}>
                            {hero.img && hero.img.trim() !== '' ? (
                                <img src={hero.img} alt={hero.name} />
                            ) : (
                                <div className={styles.noImage}>Нет фото</div>
                            )}
                        </div>
                    </section>

                    <section className={styles.description}>
                        <h2>История героя</h2>

                        <pre className={styles.description__box}>
                            Если в вашей семье есть человек, прошедший войну - его история должна быть сохранена.Если в вашей семье есть человек, прошедший войну - его история должна быть сохранена. Если в вашей семье есть человек, прошедший войну - его история должна быть сохранена.Если в вашей семье есть человек, прошедший войну - его история должна быть сохранена.Если в вашей семье есть человек, прошедший войну - его история должна быть сохранена.
                            
                            Если в вашей семье есть человек, прошедший войну - его история должна быть сохранена.Если в вашей семье есть человек, прошедший войну - его история должна быть сохранена. Если в вашей семье есть человек, прошедший войну - его история должна быть сохранена.Если в вашей семье есть человек, прошедший войну - его история должна быть сохранена.Если в вашей семье есть человек, прошедший войну - его история должна быть сохранена.

                            Если в вашей семье есть человек, прошедший войну - его история должна быть сохранена.Если в вашей семье есть человек, прошедший войну - его история должна быть сохранена. Если в вашей семье есть человек.
                        </pre>
                    </section>

                    <section className={styles.heroDetailPage__gallery}>
                        <Gallery />
                    </section>

                    <section className={styles.heroDetailPage__aboutAvtor}>

                    </section>

                    {/* --------- */}

                    {/* <div className={styles.heroDetailPage}>
                <button onClick={handleGoBack} className={styles.backButton}>
                    ← Назад
                </button>

                <div className={styles.heroContent}>
                    <div className={styles.heroImage}>
                        {hero.img && hero.img.trim() !== '' ? (
                            <img src={hero.img} alt={hero.name} />
                        ) : (
                            <div className={styles.noImage}>Нет фото</div>
                        )}
                    </div>

                    <div className={styles.heroInfo}>
                        <h1 className={styles.heroName}>{hero.name}</h1>

                        <div className={styles.infoBlock}>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Дата рождения:</span>
                                <span className={styles.infoValue}>{formatDate(hero.dateOfBirth)}</span>
                            </div>

                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Дата смерти:</span>
                                <span className={styles.infoValue}>{formatDate(hero.dateOfDeath)}</span>
                            </div>

                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Воинское звание:</span>
                                <span className={styles.infoValue}>{hero.range}</span>
                            </div>

                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Тип:</span>
                                <span className={styles.infoValue}>{hero.type}</span>
                            </div>
                        </div>

                        {text && <p className={styles.additionalText}>{text}</p>}
                    </div>
                </div>
            </div> */}

                    {/* ---------------- */}

                </div>
            </div>
        </MainLayout>
    );
}
