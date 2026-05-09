import React, { useState } from 'react';
import Select, { type SingleValue, type ActionMeta, type StylesConfig } from 'react-select';

interface OptionType {
    value: string;
    label: string;
}

interface CustomSelectProps {
    label?: string;
    required?: boolean;
    error?: string;
    className?: string;
}

const heroOptions: OptionType[] = [
    { value: 'Герой СССР', label: 'Герой СССР' },
    { value: 'Герой СВО', label: 'Герой СВО' },
];

const cardsOptions: OptionType[] = [
    { value: 'Карточка с фотографией героя', label: 'Карточка с фотографией героя' },
    { value: 'Карточка без фотографии героя', label: 'Карточка без фотографии героя' },
];

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
}

const CustomSelect: React.FC<CustomSelectProps> = ({ required, className = '', }) => {
    const [hero, setHero] = useState<OptionType | null>(null);
    const [cards, setCards] = useState<OptionType | null>(null);
    const [touched, setTouched] = useState({ hero: false, cards: false });

    const handleHeroBlur = () => setTouched(prev => ({ ...prev, hero: true }));
    const handleCardsBlur = () => setTouched(prev => ({ ...prev, cards: true }));

    const getHeroError = () => {
        if (touched.hero && !hero) return 'Пожалуйста, выберите героя';
        return undefined;
    };

    const getCardsError = () => {
        if (touched.cards && !cards) return 'Пожалуйста, выберите тип карточки';
        return undefined;
    };

    const handleChangeHero = (
        newValue: SingleValue<OptionType>,
        actionMeta: ActionMeta<OptionType>
    ): void => {
        console.log(`Action: ${actionMeta.action}`);
        setHero(newValue);
    };

    const handleChangeCards = (
        newValue: SingleValue<OptionType>,
        actionMeta: ActionMeta<OptionType>
    ): void => {
        console.log(`Action: ${actionMeta.action}`);
        setCards(newValue);
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
                    isClearable
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
                    isClearable
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
