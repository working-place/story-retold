import { useState, useMemo } from "react";
import Button from "../Button/Button";
import { Input } from "../Input/Input";
import styles from "./Filter.module.scss";
import type { Hero } from "../../../types/hero.types";

interface FilterProps {
    title?: string;
    heroes?: Hero[];
    onSearchResults?: (results: Hero[]) => void;
}

export default function Filter({ title, heroes = [], onSearchResults }: FilterProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
    const [searchMode, setSearchMode] = useState<"exact" | "all">("all");

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
        return (query: string, letter: string | null, mode: "exact" | "all"): Hero[] => {
            if (!heroes.length) return [];

            let filteredHeroes: Hero[] = [...heroes];

            if (letter) {
                filteredHeroes = filteredHeroes.filter(hero =>
                    hero.name.charAt(0).toUpperCase() === letter
                );
            }

            if (query.trim()) {
                const searchTerm = query.toLowerCase().trim();
                if (mode === "exact") {
                    filteredHeroes = filteredHeroes.filter(hero =>
                        hero.name.toLowerCase() === searchTerm
                    );
                } else {
                    filteredHeroes = filteredHeroes.filter(hero =>
                        hero.name.toLowerCase().includes(searchTerm)
                    );
                }
            }

            return filteredHeroes;
        };
    }, [heroes]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchQuery(value);
        onSearchResults?.(searchHeroes(value, selectedLetter, searchMode));
    };

    const handleLetterClick = (letter: string) => {
        const newSelectedLetter = selectedLetter === letter ? null : letter;
        setSelectedLetter(newSelectedLetter);
        onSearchResults?.(searchHeroes(searchQuery, newSelectedLetter, searchMode));
    };

    const handleModeChange = (mode: "exact" | "all") => {
        setSearchMode(mode);
        onSearchResults?.(searchHeroes(searchQuery, selectedLetter, mode));
    };

    return (
        <div className={styles.filter}>
            <div className={styles.filter__variantsContainer}>
                <h2>{title}</h2>
                <Button
                    className={`${styles.filter__button} ${searchMode === "exact" ? styles.filter__button_active : ""}`}
                    onClick={() => handleModeChange("exact")}
                >
                    Точный поиск героя
                </Button>
                <Button
                    className={`${styles.filter__button} ${searchMode === "all" ? styles.filter__button_active : ""}`}
                    onClick={() => handleModeChange("all")}
                >
                    Все герои
                </Button>
            </div>

            <div className={styles.filter__filterContainer}>
                <h2>НАЙТИ СВОЕГО ГЕРОЯ</h2>
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
                    placeholder="Введите что-то для поиска"
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
        </div>
    );
}
