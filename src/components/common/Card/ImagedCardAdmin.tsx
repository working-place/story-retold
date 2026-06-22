import styles from "../Card/ImagedCardAdmin.module.scss"
import type { Hero } from "../../../types/card.types"
import { Link } from "react-router-dom";
import { useState } from "react";
import { heroesApi } from "../../../services/api/heroes";
import DeleteConfirmPopup from "../../admin/Popups/DeleteConfirmPopup";

interface CardProps {
    heroes?: Hero[];
    onDelete?: (id: number) => void;
}

export default function ImagedCardAdmin({ heroes = [], onDelete }: CardProps) {
    const [deletePopupOpen, setDeletePopupOpen] = useState(false);
    const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const formatDate = (dateString: string | number | Date | null) => {
        if (!dateString) return 'неизвестно';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const handleDeleteClick = (hero: Hero, e: React.MouseEvent) => {
        e.preventDefault();
        setSelectedHero(hero);
        setDeletePopupOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedHero) return;

        setIsDeleting(true);
        try {
            await heroesApi.delete(selectedHero.id);
            setDeletePopupOpen(false);
            if (onDelete) {
                onDelete(selectedHero.id);
            }
        } catch (error) {
            console.error('Ошибка при удалении карточки:', error);
            alert('Не удалось удалить карточку. Попробуйте позже.');
        } finally {
            setIsDeleting(false);
            setSelectedHero(null);
        }
    };

    const handleCancelDelete = () => {
        setDeletePopupOpen(false);
        setSelectedHero(null);
    };

    return (
        <>
            {heroes.map((hero) => {
                return (
                    <div
                        key={hero.id}
                        className={styles.container}>
                        <img
                            src={hero.img}
                            alt={hero.name}
                            className={styles.img} />

                        <div className={styles.infoWrapper}>
                            <div className={styles.infoContainer}>
                                <Link to={`/hero/${hero.id}`} className={styles.cardLink}>
                                    <p className={styles.text}>
                                        {hero.name}
                                    </p>
                                    <p className={`${styles.text} ${styles.text_block}`}>
                                        {formatDate(hero.dateOfBirth)} - {formatDate(hero.dateOfDeath)}
                                    </p>
                                    <p className={styles.text}>
                                        {hero.range}
                                    </p>
                                </Link>
                            </div>

                            <div className={styles.buttonContainer}>
                                <button
                                    className={styles.deleteButton}
                                    onClick={(e) => handleDeleteClick(hero, e)}
                                    type="button"
                                >
                                    <svg width="21" height="26" viewBox="0 0 21 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.27979 7.79785H7.84976V20.3576H6.27979V7.79785Z" fill="#F2E7D1" />
                                        <path d="M9.41968 7.79785H10.9897V20.3576H9.41968V7.79785Z" fill="#F2E7D1" />
                                        <path d="M12.5596 7.79785H14.1295V20.3576H12.5596V7.79785Z" fill="#F2E7D1" />
                                        <path d="M0 3.08789H20.4097V4.65787H0V3.08789Z" fill="#F2E7D1" />
                                        <path d="M14.0772 3.8726H12.6119V2.30263C12.6119 1.83163 12.2456 1.46531 11.7746 1.46531H8.63466C8.16367 1.46531 7.79733 1.83163 7.79733 2.30263V3.8726H6.33203V2.30263C6.33203 1.04665 7.37868 0 8.63466 0H11.7746C13.0306 0 14.0772 1.04665 14.0772 2.30263V3.8726Z" fill="#F2E7D1" />
                                        <path d="M14.9151 25.0673H5.49525C4.23927 25.0673 3.14029 24.0206 3.03562 22.7647L1.57031 3.92498L3.14029 3.82031L4.6056 22.66C4.65793 23.131 5.07659 23.4973 5.49525 23.4973H14.9151C15.3861 23.4973 15.8047 23.0787 15.8047 22.66L17.2701 3.82031L18.84 3.92498L17.3747 22.7647C17.2701 24.073 16.1711 25.0673 14.9151 25.0673Z" fill="#F2E7D1" />
                                    </svg>
                                </button>
                                <Link className={styles.button} to={`/admin-heroes/edit/${hero.id}`}>
                                    Редактировать
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            })}

            <DeleteConfirmPopup
                isOpen={deletePopupOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
                heroName={selectedHero?.name}
                isLoading={isDeleting}
            />
        </>
    )
}
