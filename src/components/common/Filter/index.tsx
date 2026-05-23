import { useState, useMemo } from "react";
import Button from "../Button/Button";
import { Input } from "../Input/Input";
import styles from "./Filter.module.scss";
import type { Hero } from "../../../types/hero.types";

interface ExtendedHero extends Hero {
    placeOfBirth?: string;
}

interface FilterProps {
    title?: string;
    heroes?: Hero[];
    onSearchResults?: (results: Hero[]) => void;
}

export default function Filter({ title, heroes = [], onSearchResults }: FilterProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
    const [searchMode, setSearchMode] = useState<"all" | "advanced">("all");

    const [advancedFilters, setAdvancedFilters] = useState({
        name: "",
        dateOfBirth: "",
        dateOfDeath: "",
        placeOfBirth: "",
        rank: "",
        placeOfService: ""
    });

    const russianAlphabet = useMemo(() => {
        const start = 'А'.charCodeAt(0);
        const end = 'Я'.charCodeAt(0);
        const alphabet: string[] = [];

        for (let i = start; i <= end; i++) {
            alphabet.push(String.fromCharCode(i));
        }

        alphabet.splice(5, 0, 'Ё');
        return alphabet;
    }, []);

    const searchHeroes = useMemo(() => {
        return (query: string, letter: string | null, mode: "all" | "advanced", advancedData?: typeof advancedFilters): Hero[] => {
            if (!heroes.length) return [];

            let filteredHeroes: Hero[] = [...heroes];

            if (letter) {
                filteredHeroes = filteredHeroes.filter(hero =>
                    hero.name.charAt(0).toUpperCase() === letter
                );
            }

            if (mode === "advanced" && advancedData) {
                filteredHeroes = filteredHeroes.filter(hero => {
                    let matches = true;
                    const extendedHero = hero as ExtendedHero;

                    if (advancedData.name.trim()) {
                        matches = matches && hero.name.toLowerCase().includes(advancedData.name.toLowerCase().trim());
                    }

                    if (advancedData.dateOfBirth.trim()) {
                        matches = matches && hero.dateOfBirth.toLowerCase().includes(advancedData.dateOfBirth.toLowerCase().trim());
                    }

                    if (advancedData.dateOfDeath.trim()) {
                        matches = matches && (hero.dateOfDeath?.toLowerCase().includes(advancedData.dateOfDeath.toLowerCase().trim()) ?? false);
                    }

                    if (advancedData.placeOfBirth.trim()) {
                        matches = matches && (extendedHero.placeOfBirth?.toLowerCase().includes(advancedData.placeOfBirth.toLowerCase().trim()) ?? false);
                    }

                    if (advancedData.rank.trim()) {
                        matches = matches && hero.range.toLowerCase().includes(advancedData.rank.toLowerCase().trim());
                    }

                    if (advancedData.placeOfService.trim()) {
                        matches = matches && hero.type.toLowerCase().includes(advancedData.placeOfService.toLowerCase().trim());
                    }

                    return matches;
                });
            } else if (query.trim()) {
                const searchTerm = query.toLowerCase().trim();
                filteredHeroes = filteredHeroes.filter(hero =>
                    hero.name.toLowerCase().includes(searchTerm)
                );
            }

            return filteredHeroes;
        };
    }, [heroes]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchQuery(value);
        if (searchMode !== "advanced") {
            onSearchResults?.(searchHeroes(value, selectedLetter, searchMode));
        }
    };

    const handleLetterClick = (letter: string) => {
        const newSelectedLetter = selectedLetter === letter ? null : letter;
        setSelectedLetter(newSelectedLetter);
        if (searchMode !== "advanced") {
            onSearchResults?.(searchHeroes(searchQuery, newSelectedLetter, searchMode));
        }
    };

    const handleModeChange = (mode: "all" | "advanced") => {
        setSearchMode(mode);

        if (mode === "advanced") {
            onSearchResults?.(searchHeroes("", selectedLetter, mode, advancedFilters));
        } else {
            onSearchResults?.(searchHeroes(searchQuery, selectedLetter, mode));
        }
    };

    const handleAdvancedFilterChange = (field: keyof typeof advancedFilters, value: string) => {
        const updatedFilters = { ...advancedFilters, [field]: value };
        setAdvancedFilters(updatedFilters);

        if (searchMode === "advanced") {
            onSearchResults?.(searchHeroes("", selectedLetter, "advanced", updatedFilters));
        }
    };

    const handleAdvancedSearch = () => {
        if (searchMode === "advanced") {
            onSearchResults?.(searchHeroes("", selectedLetter, "advanced", advancedFilters));
        }
    };

    // const handleResetAdvanced = () => {
    //     const resetFilters = {
    //         name: "",
    //         dateOfBirth: "",
    //         dateOfDeath: "",
    //         placeOfBirth: "",
    //         rank: "",
    //         placeOfService: ""
    //     };
    //     setAdvancedFilters(resetFilters);

    //     if (searchMode === "advanced") {
    //         onSearchResults?.(searchHeroes("", selectedLetter, "advanced", resetFilters));
    //     }
    // };

    return (
        <div className={styles.filter}>
            <div className={styles.filter__variantsContainer}>
                <h2>{title}</h2>
                <Button
                    className={`${styles.filter__button} ${searchMode === "all" ? styles.filter__button_active : ""}`}
                    onClick={() => handleModeChange("all")}
                >
                    Все герои
                </Button>
                <Button
                    className={`${styles.filter__button} ${searchMode === "advanced" ? styles.filter__button_active : ""}`}
                    onClick={() => handleModeChange("advanced")}
                >
                    Точный поиск героя
                </Button>
            </div>

            <div className={styles.filter__filterContainer}>
                <h2>НАЙТИ СВОЕГО ГЕРОЯ</h2>

                {searchMode !== "advanced" ? (
                    <div className={styles.simpleFilter}>
                        <Input
                            className={styles.filter__input}
                            type='text'
                            size='large'
                            value={searchQuery}
                            onChange={handleSearchChange}
                            iconRight={
                                <img
                                    className={styles.filter__searchIcon}
                                    src="/search.png"
                                    alt="Поиск"
                                    width={46}
                                    height={46}
                                />
                            }
                            placeholder="Введите имя героя для поиска"
                        />
                        <div className={styles.filter__alphabet}>
                            {russianAlphabet.map((letter, index) => (
                                <button
                                    key={letter}
                                    className={`${styles.filter__letter} ${selectedLetter === letter ? styles.filter__letter_active : ""}`}
                                    onClick={() => handleLetterClick(letter)}
                                >
                                    {letter}
                                    {index < russianAlphabet.length - 1 && (
                                        <span className={styles.filter__comma}>, </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className={styles.advancedFilter}>

                        <div className={styles.advancedFilter__mainInfoBox}>
                        <h3>Основные сведения</h3>

                            <Input
                                className={styles.advancedFilter__input}
                                type='text'
                                size='extraLarge'
                                value={advancedFilters.name}
                                onChange={(e) => handleAdvancedFilterChange("name", e.target.value)}
                                placeholder="ФИО героя"
                                label="Введите ФИО героя"
                                required
                            />

                            <div className={styles.advancedFilter__inputBox}>
                            <Input
                                className={`${styles.advancedFilter__input} ${styles.advancedFilter__input_extraSmall}`}
                                type='text'
                                size='extraSmall'
                                value={advancedFilters.dateOfBirth}
                                onChange={(e) => handleAdvancedFilterChange("dateOfBirth", e.target.value)}
                                placeholder="Дата рождения"
                                label="Дата рождения"
                                required
                            />
                            <Input
                                className={`${styles.advancedFilter__input} ${styles.advancedFilter__input_extraSmall}`}
                                type='text'
                                size='extraSmall'
                                value={advancedFilters.dateOfDeath}
                                onChange={(e) => handleAdvancedFilterChange("dateOfDeath", e.target.value)}
                                placeholder="Дата смерти"
                                label="Окончание"
                            />
                            <Input
                                className={`${styles.advancedFilter__input} ${styles.advancedFilter__input_extraSmall}`}
                                type='text'
                                size='extraSmall'
                                value={advancedFilters.placeOfBirth}
                                onChange={(e) => handleAdvancedFilterChange("placeOfBirth", e.target.value)}
                                placeholder="Место рождения"
                                label="Место рождения"
                                required
                            />
                            </div>
                        </div>

                        <div className={styles.advancedFilter__additionalInfoBox}>
                        <h3>Дополнительные сведения</h3>
                            <Input
                                className={`${styles.advancedFilter__input} ${styles.advancedFilter__input_small}`}
                                type='text'
                                size="small"
                                label="Военское звание"
                                value={advancedFilters.rank}
                                onChange={(e) => handleAdvancedFilterChange("rank", e.target.value)}
                                placeholder="Воинское звание"
                            />
                            <Input
                                className={`${styles.advancedFilter__input} ${styles.advancedFilter__input_small}`}
                                type='text'
                                size="small"
                                label="Место службы"
                                value={advancedFilters.placeOfService}
                                onChange={(e) => handleAdvancedFilterChange("placeOfService", e.target.value)}
                                placeholder="Место службы"
                            />
                            <Button
                                className={styles.advancedFilter__searchButton}
                                onClick={handleAdvancedSearch}
                            >
                                Найти героя
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
