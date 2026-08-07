import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from "./FeedBackPage.module.scss";
import { InputAdmin } from '../../../components/common/Input/InputAdmin';
import { Textarea } from '../../../components/common/Textarea/Textarea';
import Button from '../../../components/common/Button/Button';
import { heroesApi, ApiError } from '../../../services/api/heroes';
import { buildImageUrl } from '../../../services/api/api';
import { formatDateDisplay } from '../../../utils/date';
import type { Hero } from '../../../types/card.types';

export default function FeedBackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const cardId = searchParams.get('cardId');

    const [hero, setHero] = useState<Hero | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [email, setEmail] = useState<string>('');
    const [subject, setSubject] = useState<string>('');
    const [comment, setComment] = useState<string>('');

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchHero = async () => {
            if (!cardId) {
                setError('ID карточки не указан');
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const rawHero = await heroesApi.get(Number(cardId));

                const photoHeroUrl =
                    typeof rawHero.photoHero === 'string'
                        ? rawHero.photoHero
                        : (rawHero.photoHero?.image || null);

                setHero({
                    id: rawHero.id,
                    name: rawHero.name,
                    range: rawHero.militaryRank || '',
                    dateOfBirth: rawHero.dateBirth,
                    dateOfDeath: rawHero.dateDeath || '',
                    img: buildImageUrl(photoHeroUrl),
                    description: rawHero.description,
                    type: rawHero.chapter === 'svo' ? 'SVO' : 'GPW',
                    placeBirth: rawHero.placeBirth,
                    placeService: rawHero.placeService || '',
                    placeConscription: rawHero.placeConscription || '',
                    email: rawHero.email || '',
                    nameAndClass: rawHero.nameAndClass || '',
                    additionalImages: (rawHero.additionalCardImages || []).map((img) => buildImageUrl(img.image)),
                    cardData: {
                        id: rawHero.id,
                        dateBirth: rawHero.dateBirth,
                        dateDeath: rawHero.dateDeath || '',
                        placeBirth: rawHero.placeBirth,
                        name: rawHero.name,
                        nameAndClass: rawHero.nameAndClass || '',
                        email: rawHero.email || '',
                        description: rawHero.description,
                        militaryRank: rawHero.militaryRank || '',
                        placeService: rawHero.placeService || '',
                        placeConscription: rawHero.placeConscription || '',
                        chapter: rawHero.chapter,
                        photoHero: photoHeroUrl,
                        published: rawHero.published,
                        createdAt: rawHero.created_at,
                        updatedAt: rawHero.updated_at,
                        additionalCardImages: (rawHero.additionalCardImages || []).map((img) => ({
                            id: img.id,
                            card_id: rawHero.id,
                            image: img.image || '',
                            created_at: rawHero.created_at,
                            updated_at: rawHero.updated_at,
                        }))
                    }
                });
            } catch (err) {
                setError(
                    err instanceof ApiError
                        ? `Ошибка сервера: ${err.message}`
                        : 'Не удалось загрузить карточку'
                );
            } finally {
                setLoading(false);
            }
        };

        void fetchHero();
    }, [cardId]);

    const handleExit = () => {
        navigate(-1);
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitError(null);
        setSuccessMessage(null);

        try {
            await heroesApi.sendFeedback(email, subject, comment);
            setSuccessMessage('Комментарий успешно отправлен!');
            setEmail('');
            setSubject('');
            setComment('');
        } catch (err) {
            setSubmitError(
                err instanceof ApiError ? err.message : 'Не удалось отправить сообщение'
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className={styles.feedbackCard}><p>Загрузка данных...</p></div>;
    }

    if (error || !hero) {
        return (
            <div className={styles.feedbackCard}>
                <p>{error || 'Герой не найден'}</p>
                <Button onClick={handleExit}>Назад</Button>
            </div>
        );
    }

    const hasPhoto = hero.img && hero.img.trim() !== '';

    return (
        <div className={styles.feedbackCard}>
            <div className={styles.feedbackCard_titleContainer}>
                <h1 className={styles.feedbackCard_title}>Направить комментарии</h1>
                <Button className={styles.feedbackCard_exitButton} onClick={handleExit}>
                    Выйти
                </Button>
            </div>

            <div className={styles.feedbackCard_container}>
                <div className={styles.feedbackCard_card}>
                    <div className={styles.feedbackCard_wrapper}>
                        {hasPhoto && (
                            <div className={styles.feedbackCard_imageWrapper}>
                                <img src={hero.img} alt={hero.name} className={styles.feedbackCard_image} />
                            </div>
                        )}

                        <div className={styles.feedbackCard_infoContainer}>
                            <div className={styles.feedbackCard_infoRow}>
                                <span className={styles.feedbackCard_name}>{hero.name}</span>
                            </div>

                            <div className={styles.feedbackCard_dateWrapper}>
                                <div className={styles.feedbackCard_infoRow}>
                                    <span className={styles.feedbackCard_label}>Дата рождения:</span>
                                    <span className={styles.feedbackCard_value}>{formatDateDisplay(hero.dateOfBirth)}</span>
                                </div>

                                <div className={styles.feedbackCard_infoRow}>
                                    <span className={styles.feedbackCard_label}>Дата смерти:</span>
                                    <span className={styles.feedbackCard_value}>{formatDateDisplay(hero.dateOfDeath)}</span>
                                </div>
                            </div>

                            <div className={styles.feedbackCard_infoRow}>
                                <span className={styles.feedbackCard_label}>Место призыва:</span>
                                <span className={styles.feedbackCard_value}>{hero.placeConscription || 'Не указано'}</span>
                            </div>

                            <div className={styles.feedbackCard_infoRow}>
                                <span className={styles.feedbackCard_label}>Место службы:</span>
                                <span className={styles.feedbackCard_value}>{hero.placeService || 'Не указано'}</span>
                            </div>

                            <div className={styles.feedbackCard_infoRow}>
                                <span className={styles.feedbackCard_label}>Звание:</span>
                                <span className={styles.feedbackCard_value}>{hero.range || 'Не указано'}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.feedbackCard_infoRow}>
                        <p className={styles.feedbackCard_description}>{hero.description || 'Нет описания'}</p>
                    </div>
                </div>

                <form className={styles.feedbackCard_form} onSubmit={handleSubmitComment}>
                    <InputAdmin
                        type="email"
                        label="Адрес почты"
                        placeholder="Введите email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        labelClassName={styles.customLabel}
                        className={styles.customInput}
                        required
                    />
                    <InputAdmin
                        label="Тема письма"
                        placeholder="Введите тему"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        labelClassName={styles.customLabel}
                        className={styles.customInput}
                        required
                    />
                    <Textarea
                        label="Описание материала"
                        placeholder="Введите комментарий..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        resize="none"
                        size="large"
                        labelClassName={styles.customLabel}
                        className={styles.feedbackCard_textarea}
                        required
                    />

                    {submitError && <p className={styles.errorText}>{submitError}</p>}
                    {successMessage && <p className={styles.successText}>{successMessage}</p>}

                    <div className={styles.feedbackCard_buttonWrapper}>
                        <Button
                            type="submit"
                            variant='bright'
                            disabled={submitting}
                            className={styles.feedbackCard_submitButton}
                        >
                            {submitting ? 'Отправка...' : 'Отправить'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
