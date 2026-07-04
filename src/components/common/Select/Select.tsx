import React, { useState } from 'react';
import Select, { type SingleValue, type StylesConfig } from 'react-select';

interface OptionType {
    value: string;
    label: string;
}

interface CustomSelectProps {
    label?: string;
    required?: boolean;
    error?: string;
    className?: string;
    onChapterChange?: (value: 'svo' | 'gpw' | null) => void;
    onCardTypeChange?: (value: 'withPhoto' | 'withoutPhoto' | null) => void;
    initialChapter?: 'svo' | 'gpw' | null;
    initialCardType?: 'withPhoto' | 'withoutPhoto' | null;
}

const heroOptions: OptionType[] = [
    { value: 'Герой СССР', label: 'Герой СССР' },
    { value: 'Герой СВО', label: 'Герой СВО' },
];

const cardsOptions: OptionType[] = [
    { value: 'Карточка с фотографией героя', label: 'Карточка с фотографией героя' },
    { value: 'Карточка без фотографии героя', label: 'Карточка без фотографии героя' },
];

const chapterMap: Record<string, 'svo' | 'gpw'> = {
    'Герой СВО': 'svo',
    'Герой СССР': 'gpw',
};

const cardTypeMap: Record<string, 'withPhoto' | 'withoutPhoto'> = {
    'Карточка с фотографией героя': 'withPhoto',
    'Карточка без фотографии героя': 'withoutPhoto',
};

const chapterMapReverse: Record<string, string> = {
    'svo': 'Герой СВО',
    'gpw': 'Герой СССР',
};

const cardTypeMapReverse: Record<string, string> = {
    'withPhoto': 'Карточка с фотографией героя',
    'withoutPhoto': 'Карточка без фотографии героя',
};

const getInitialHero = (initialChapter?: 'svo' | 'gpw' | null): OptionType | null => {
    if (!initialChapter) return null;
    const label = chapterMapReverse[initialChapter];
    return label ? { value: label, label } : null;
};

const getInitialCards = (initialCardType?: 'withPhoto' | 'withoutPhoto' | null): OptionType | null => {
    if (!initialCardType) return null;
    const label = cardTypeMapReverse[initialCardType];
    return label ? { value: label, label } : null;
};

const commonSelectStyles: StylesConfig<OptionType> = {
    control: (baseStyles) => ({
        ...baseStyles,
        padding: '4px 12px 4px 12px',
        borderRadius: '12px',
        backgroundColor: '#F1E6D0',
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
        '&:hover': {
            border: 'none',
            backgroundColor: '#F1E6D0',
        },
        '&:focus-within': {
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
        },
    }),
    menu: (baseStyles) => ({
        ...baseStyles,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#F1E6D0',
        borderRadius: '20px',
        overflow: 'hidden',
        marginTop: '-45px',
        padding: '10px 10px 10px 10px',
        height: 'fit-content',
        opacity: 1,
    }),
    menuList: (baseStyles) => ({
        ...baseStyles,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center',
        padding: '8px',
        backgroundColor: '#F1E6D0',
    }),
    option: (baseStyles, { isFocused }) => ({
        ...baseStyles,
        fontSize: '18px',
        padding: '10px 20px 10px 20px',
        borderRadius: '20px',
        width: '100%',
        textAlign: 'center',
        color: isFocused ? '#F1E6D0' : '#534035',
        backgroundColor: isFocused ? '#534035' : 'transparent',
        '&:active': {
            backgroundColor: '#534035',
            color: '#F1E6D0',
        },
    }),
    indicatorSeparator: (baseStyles) => ({
        ...baseStyles,
        backgroundColor: 'transparent',
        width: '1px',
        padding: '0px',
    }),
    dropdownIndicator: (baseStyles) => ({
        ...baseStyles,
        color: 'transparent',
        width: '1px',
        padding: '0px',
        '&:hover': {
            color: 'transparent',
        },
    }),
    clearIndicator: (baseStyles) => ({
        ...baseStyles,
        color: 'transparent',
        opacity: 1,
        width: '1px',
        padding: '0px',
        '&:hover': {
            color: 'transparent',
        },
    }),
    singleValue: (baseStyles) => ({
        ...baseStyles,
        color: '#534035',
        opacity: 1,
    }),
    placeholder: (baseStyles) => ({
        ...baseStyles,
        color: '#534035',
        opacity: 1,
    }),
    menuPortal: (baseStyles) => ({
        ...baseStyles,
        backgroundColor: '#F1E6D0',
    }),
};

const CustomSelect: React.FC<CustomSelectProps> = ({
    required,
    className = '',
    onChapterChange,
    onCardTypeChange,
    initialChapter,
    initialCardType,
}) => {
    const [hero, setHero] = useState<OptionType | null>(() => getInitialHero(initialChapter));
    const [cards, setCards] = useState<OptionType | null>(() => getInitialCards(initialCardType));
    const [touched, setTouched] = useState({ hero: false, cards: false });

    const handleHeroBlur = () => setTouched(prev => ({ ...prev, hero: true }));
    const handleCardsBlur = () => setTouched(prev => ({ ...prev, cards: true }));

    const getHeroError = () => {
        if (touched.hero && required && !hero) return 'Пожалуйста, выберите героя';
        return undefined;
    };

    const getCardsError = () => {
        if (touched.cards && required && !cards) return 'Пожалуйста, выберите тип карточки';
        return undefined;
    };

    const handleChangeHero = (newValue: SingleValue<OptionType>): void => {
        setHero(newValue);
        if (onChapterChange) {
            const chapterValue = newValue ? chapterMap[newValue.value] : null;
            onChapterChange(chapterValue);
        }
    };

    const handleChangeCards = (newValue: SingleValue<OptionType>): void => {
        setCards(newValue);
        if (onCardTypeChange) {
            const cardTypeValue = newValue ? cardTypeMap[newValue.value] : null;
            onCardTypeChange(cardTypeValue);
        }
    };

    return (
        <>
            <div className={className} style={{ width: '100%' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                    Выберете из списка раздел
                    {required && <span style={{ color: '#F1E6D0', marginLeft: '4px' }}>*</span>}
                </label>
                <Select<OptionType>
                    value={hero}
                    onChange={handleChangeHero}
                    options={heroOptions}
                    placeholder="Выпадающий список"
                    isClearable={false}
                    isSearchable
                    isLoading={false}
                    isDisabled={false}
                    onBlur={handleHeroBlur}
                    styles={commonSelectStyles}
                />
                {getHeroError() && (
                    <span style={{ fontSize: '12px', color: '#f44336', marginTop: '4px', display: 'block' }}>
                        {getHeroError()}
                    </span>
                )}
            </div>

            <div className={className} style={{ width: '100%' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                    Выберете из списка тип карточки
                    {required && <span style={{ color: '#F1E6D0', marginLeft: '4px' }}>*</span>}
                </label>
                <Select<OptionType>
                    value={cards}
                    onChange={handleChangeCards}
                    options={cardsOptions}
                    placeholder="Выпадающий список"
                    isClearable={false}
                    isSearchable
                    isLoading={false}
                    isDisabled={false}
                    onBlur={handleCardsBlur}
                    styles={commonSelectStyles}
                />
                {getCardsError() && (
                    <span style={{ fontSize: '12px', color: '#f44336', marginTop: '4px', display: 'block' }}>
                        {getCardsError()}
                    </span>
                )}
            </div>
        </>
    );
};

export default CustomSelect;
