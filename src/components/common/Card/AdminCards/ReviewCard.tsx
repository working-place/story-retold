// // import { useState } from "react";
// import styles from "./ReviewCard.module.scss";
// import type { CardData } from "../../../../types/card.types";
// import { Link } from "react-router-dom";

// interface ReviewCardProps {
//     cards?: CardData[];
//     onPublish?: (id: number) => void; // Колбэк после публикации
//     onDelete?: (id: number) => void; // Колбэк после удаления
// }

// export default function ReviewCard({
//     cards = [],
//     // onPublish,
//     // onDelete
// }: ReviewCardProps) {
//     // const [publishingId, setPublishingId] = useState<number | null>(null);
//     // const [deletingId, setDeletingId] = useState<number | null>(null);

//     const formatDate = (dateString: string | null) => {
//         if (!dateString) return 'неизвестно';
//         const date = new Date(dateString);
//         return date.toLocaleDateString('ru-RU', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric',
//         });
//     };

//     const getImageUrl = (path: string | null) => {
//         if (!path) return '';
//         if (path.startsWith('http')) return path;
//         return `http://94.250.255.173:8000${path}`;
//     };

//     // const handlePublish = async (id: number) => {
//     //     setPublishingId(id);
//     //     try {
//     //         // Отправляем JSON с published: true
//     //         const response = await fetch(`http://94.250.255.173:8000/api/card/update/${id}`, {
//     //             method: 'PATCH',
//     //             headers: {
//     //                 'Content-Type': 'application/json',
//     //                 'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
//     //             },
//     //             body: JSON.stringify({ published: true }),
//     //         });

//     //         if (response.ok) {
//     //             if (onPublish) onPublish(id);
//     //         } else {
//     //             const errorData = await response.json();
//     //             console.error('Ошибка публикации:', errorData);
//     //             alert('Не удалось опубликовать карточку');
//     //         }
//     //     } catch (error) {
//     //         console.error('Ошибка публикации:', error);
//     //         alert('Произошла ошибка при публикации');
//     //     } finally {
//     //         setPublishingId(null);
//     //     }
//     // };

//     // const handleDelete = async (id: number) => {
//     //     if (!confirm('Вы уверены, что хотите удалить эту карточку?')) return;

//     //     setDeletingId(id);
//     //     try {
//     //         const response = await fetch(`http://94.250.255.173:8000/api/card/delete/${id}`, {
//     //             method: 'DELETE',
//     //             headers: {
//     //                 'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
//     //             },
//     //         });

//     //         if (response.ok) {
//     //             if (onDelete) onDelete(id);
//     //         } else {
//     //             const errorData = await response.json();
//     //             console.error('Ошибка удаления:', errorData);
//     //             alert('Не удалось удалить карточку');
//     //         }
//     //     } catch (error) {
//     //         console.error('Ошибка удаления:', error);
//     //         alert('Произошла ошибка при удалении');
//     //     } finally {
//     //         setDeletingId(null);
//     //     }
//     // };

//     return (
//         <>
//             {cards.map((card) => (
//                 <div key={card.id} className={styles.reviewCard}>

//                     <div className={styles.reviewCard__infoContainer}>
//                         <div className={styles.reviewCard__imageContainer}>
//                             {card.photoHero ? (
//                                 <img
//                                     src={getImageUrl(card.photoHero)}
//                                     alt={card.name}
//                                     className={styles.reviewCard__image}
//                                 />
//                             ) : (
//                                 <div className={styles.reviewCard__imagePlaceholder}>
//                                     <img src="/star.png" alt="Звезда" />
//                                 </div>
//                             )}
//                         </div>

//                         <div className={styles.reviewCard__info}>
//                             <h3 className={styles.reviewCard__name}>
//                                 {card.name}
//                             </h3>
//                             <span className={styles.reviewCard__author}>
//                                 Автор: {card.nameAndClass || 'не указан'}
//                             </span>

//                             <span className={styles.reviewCard__date}>
//                                 Дата: {formatDate(card.createdAt)}
//                             </span>
//                         </div>
//                     </div>


//                     <div className={styles.reviewCard__actions}>
//                         <Link
//                             to={`/admin-heroes/edit/${card.id}`}
//                             className={styles.reviewCard__button}
//                         >
//                             Перейти к редактированию
//                         </Link>
//                         <Link
//                             to={``}
//                             className={styles.reviewCard__button}
//                         >
//                             Направить комментарии
//                         </Link>
//                         {/* <button
//                             className={styles.reviewCard__publishButton}
//                             onClick={() => handlePublish(card.id)}
//                             disabled={publishingId === card.id}
//                             type="button"
//                         >
//                             {publishingId === card.id ? 'Публикация...' : 'Опубликовать'}
//                         </button> */}
//                         {/* <button
//                             className={styles.reviewCard__button}
//                             onClick={() => handleDelete(card.id)}
//                             disabled={deletingId === card.id}
//                             type="button"
//                         >
//                             {deletingId === card.id ? 'Удаление...' : 'Удалить'}
//                         </button> */}
//                     </div>
//                 </div>
//             ))}
//         </>
//     );
// }

// components/common/Card/AdminCards/ReviewCard.tsx
import styles from "./ReviewCard.module.scss";
import type { CardData } from "../../../../types/card.types";
import { Link } from "react-router-dom";

interface ReviewCardProps {
    cards?: CardData[];
    onPublish?: (id: number) => void;
    onDelete?: (id: number) => void;
}

export default function ReviewCard({
    cards = [],
}: ReviewCardProps) {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'неизвестно';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const getImageUrl = (path: string | null) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        return `http://94.250.255.173:8000${path}`;
    };

    return (
        <>
            {cards.map((card) => {
                const hasImage = card.photoHero && card.photoHero.trim() !== '';

                return (
                    <div
                        key={card.id}
                        className={`${styles.reviewCard} ${!hasImage ? styles.reviewCard_noImage : ''}`}
                    >
                        <div className={styles.reviewCard__infoContainer}>
                            {/* Блок с изображением - показываем только если есть фото */}
                            {hasImage && (
                                <div className={styles.reviewCard__imageContainer}>
                                    <img
                                        src={getImageUrl(card.photoHero)}
                                        alt={card.name}
                                        className={styles.reviewCard__image}
                                    />
                                </div>
                            )}

                            <div className={styles.reviewCard__info}>
                                <h3 className={styles.reviewCard__name}>
                                    {card.name}
                                </h3>
                                <span className={styles.reviewCard__author}>
                                    Автор: {card.nameAndClass || 'не указан'}
                                </span>
                                <span className={styles.reviewCard__date}>
                                    Дата: {formatDate(card.createdAt)}
                                </span>
                            </div>
                        </div>

                        <div className={styles.reviewCard__actions}>
                            <Link
                                to={`/admin-heroes/edit/${card.id}`}
                                className={styles.reviewCard__button}
                            >
                                Перейти к редактированию
                            </Link>
                            <Link
                                to={``}
                                className={styles.reviewCard__button}
                            >
                                Направить комментарии
                            </Link>
                        </div>
                    </div>
                );
            })}
        </>
    );
}
