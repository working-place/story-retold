import styles from "./TextCard.module.scss"

// interface CardProps {
// }

const heroes = [
    {
        id: 1,
        name: 'Иванов Иван Иванович',
        dateOfBirth: '2024-01-15',
        dateOfDeath: '2024-03-20',
        range: 'Рядовой',
    },
    {
        id: 2,
        name: 'Васильев Василий',
        dateOfBirth: '2024-02-01',
        dateOfDeath: '2024-12-31',
        range: 'Прапорщик',
    },
    {
        id: 3,
        name: 'Михайлов Михаил',
        dateOfBirth: '2024-03-10',
        dateOfDeath: null,
        range: 'Майор',
    },
    {
        id: 4,
        name: 'Сергеев Сергей Сергеевич',
        dateOfBirth: '01.10.1920',
        dateOfDeath: '2024-01-10',
        range: 'Сержант',
    },
    {
        id: 5,
        name: 'Антонов Антон Антонович',
        dateOfBirth: '2024-04-01',
        dateOfDeath: null,
        range: 'Водитель',
    },
    {
        id: 6,
        name: 'Александров Александр',
        dateOfBirth: '2024-05-20',
        dateOfDeath: '2024-08-15',
        range: 'Музыкант',
    },
    {
        id: 7,
        name: 'Кузнецов Антон Антонович',
        dateOfBirth: '2024-04-01',
        dateOfDeath: null,
        range: 'Водитель',
    },
    {
        id: 8,
        name: 'Александров Александр',
        dateOfBirth: '2024-05-20',
        dateOfDeath: '2024-08-15',
        range: 'Музыкант',
    },
];

export default function TextCard() {

    const formatDate = (dateString: string | number | Date | null) => {
        if (!dateString) return 'неизвестно';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <>
            {heroes.map((hero) => {
                return (
                    <div
                        key={hero.id}
                        className={styles.textCard}>

                        <div className={styles.textCard__imgContainer}>
                            <img
                                src="/star.png"
                                alt='Звезда'
                                className={styles.textCard__img} />
                        </div>
                        <div className={styles.textCard__infoContainer}>
                            <p className={styles.textCard__name}>{hero.name}</p>
                            <span className={styles.textCard__date}>
                                {formatDate(hero.dateOfBirth)}&nbsp;-&nbsp;{formatDate(hero.dateOfDeath)}
                            </span>
                            <p className={styles.textCard__range}>{hero.range}</p>
                        </div>
                        <div className={styles.textCard__buttonContainer}>
                            <button className={styles.textCard__button}>Подробнее</button>
                        </div>
                    </div>
                )
            })
            }
        </>
    )
}
