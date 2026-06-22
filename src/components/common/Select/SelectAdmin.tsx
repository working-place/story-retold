import React, { useState } from 'react';
import Select, { type SingleValue, type StylesConfig, type DropdownIndicatorProps, components } from 'react-select';

interface OptionType {
    value: string;
    label: string;
}

interface CustomSelectAdminProps {
    required?: boolean;
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

const CustomDropdownIndicatorFirst = (props: DropdownIndicatorProps<OptionType>) => {
    return (
        <components.DropdownIndicator {...props}>
            <svg width="24" height="24" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.3611 6.2499V3.47212C17.3611 1.93799 16.1175 0.694336 14.5834 0.694336H3.47223C1.9381 0.694336 0.694443 1.93799 0.694443 3.47212V14.861C0.694443 16.3952 1.9381 17.6388 3.47223 17.6388H6.11112" stroke="#534035" strokeWidth="1.38889" />
                <rect x="9.72232" y="9.86095" width="15.2778" height="15.5556" rx="2.08334" stroke="#534035" strokeWidth="1.38889" />
                <path d="M21.7362 12.4995L21.8622 12.5132C22.147 12.5779 22.3612 12.8583 22.3612 13.1938C22.3612 13.5294 22.147 13.8098 21.8622 13.8745L21.7362 13.8882H12.8475V13.8696C12.5693 13.7994 12.3612 13.5243 12.3612 13.1938C12.3613 12.8634 12.5692 12.5872 12.8475 12.5171V12.4995H21.7362Z" fill="#534035" />
                <path d="M21.7362 21.3892L21.8622 21.4028C22.147 21.4676 22.3612 21.7479 22.3612 22.0835C22.3612 22.4191 22.147 22.6994 21.8622 22.7642L21.7362 22.7778H12.8475V22.7593C12.5692 22.6891 12.3612 22.414 12.3612 22.0835C12.3613 21.7531 12.5693 21.4779 12.8475 21.4077V21.3892H21.7362Z" fill="#534035" />
                <path d="M21.7362 16.9448L21.8622 16.9595C22.1468 17.0243 22.3611 17.3037 22.3612 17.6392C22.3612 17.9747 22.147 18.255 21.8622 18.3198L21.7362 18.3335H12.8475V18.3149C12.5692 18.2447 12.3612 17.9696 12.3612 17.6392C12.3612 17.3086 12.5691 17.0325 12.8475 16.9624V16.9448H21.7362Z" fill="#534035" />
            </svg>
        </components.DropdownIndicator>
    );
};

const CustomDropdownIndicatorSecond = (props: DropdownIndicatorProps<OptionType>) => {
    return (
        <components.DropdownIndicator {...props}>
            <svg width="22" height="24" viewBox="0 0 23 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.695" y="6.43182" width="11.1564" height="17.1287" rx="0.945051" stroke="#534035" strokeWidth="1.39" />
                <path d="M8.28271 7.54883H8.61072C9.5165 7.54883 10.2508 8.2831 10.2508 9.18888V9.28249" stroke="#534035" strokeWidth="0.574018" />
                <path d="M8.46752 5.93376L9.93498 1.80652C10.2335 0.967059 11.1518 0.503517 12.0038 0.762218L20.2173 3.25604C21.084 3.51919 21.5573 4.43006 21.2744 5.29052L16.5016 19.8072C16.2154 20.6776 15.2665 21.1611 14.3946 20.8807L11.8413 20.0599" stroke="#534035" strokeWidth="1.39" />
                <path d="M17.8091 4.42529L18.1164 4.5186C18.9831 4.78175 19.4564 5.69262 19.1735 6.55308L19.1422 6.64819" stroke="#534035" strokeWidth="0.574018" />
            </svg>
        </components.DropdownIndicator>
    );
};

const CustomClearIndicator = () => null;

const commonSelectStyles: StylesConfig<OptionType> = {
    control: (baseStyles) => ({
        ...baseStyles,
        padding: '12px 12px 12px 12px',
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
        marginTop: '4px',
        padding: '10px',
        height: 'fit-content',
        opacity: 1,
        zIndex: 999,
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
        fontSize: '20px',
        padding: '12px 22px',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '437px',
        textAlign: 'center',
        cursor: 'pointer',
        color: isFocused ? '#F1E6D0' : '#534035',
        backgroundColor: isFocused ? '#534035' : 'transparent',
        '&:active': {
            backgroundColor: '#534035',
            color: '#F1E6D0',
        },
    }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: (baseStyles) => ({
        ...baseStyles,
        padding: '0',
        '&:hover': {
            color: '#534035',
        },
    }),
    clearIndicator: () => ({ display: 'none' }),
    singleValue: (baseStyles) => ({
        ...baseStyles,
        color: '#534035',
        textAlign: 'left',
        opacity: 1,
    }),
    placeholder: (baseStyles) => ({
        ...baseStyles,
        color: '#534035',
        textAlign: 'left',
        opacity: 0.7,
    }),
    valueContainer: (baseStyles) => ({
        ...baseStyles,
        textAlign: 'left',
        padding: 0,
    }),
    input: (baseStyles) => ({
        ...baseStyles,
        textAlign: 'left',
        margin: 0,
        padding: 0,
    }),
    menuPortal: (baseStyles) => ({
        ...baseStyles,
        backgroundColor: '#F1E6D0',
    }),
};

const CustomSelectAdmin: React.FC<CustomSelectAdminProps> = ({
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
        <div style={{ display: 'flex', gap: '24px', width: '100%', marginBottom: '15px' }}>
            <div className={className} style={{ width: '100%' }}>
                <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 600,
                    textAlign: 'left',
                    fontSize: '20px',
                    color: '#534035'
                }}>
                    Выберите из списка раздел
                    {required && <span style={{ color: '#f44336', marginLeft: '4px' }}>*</span>}
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
                    components={{
                        DropdownIndicator: CustomDropdownIndicatorFirst,
                        ClearIndicator: CustomClearIndicator,
                        IndicatorSeparator: () => null,
                    }}
                />
                {getHeroError() && (
                    <span style={{ fontSize: '12px', color: '#f44336', marginTop: '4px', display: 'block', textAlign: 'left' }}>
                        {getHeroError()}
                    </span>
                )}
            </div>

            <div className={className} style={{ width: '100%' }}>
                <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 600,
                    textAlign: 'left',
                    fontSize: '20px',
                    color: '#534035'
                }}>
                    Выберите из списка тип карточки
                    {required && <span style={{ color: '#f44336', marginLeft: '4px' }}>*</span>}
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
                    components={{
                        DropdownIndicator: CustomDropdownIndicatorSecond,
                        ClearIndicator: CustomClearIndicator,
                        IndicatorSeparator: () => null,
                    }}
                />
                {getCardsError() && (
                    <span style={{ fontSize: '12px', color: '#f44336', marginTop: '4px', display: 'block', textAlign: 'left' }}>
                        {getCardsError()}
                    </span>
                )}
            </div>
        </div>
    );
};

export default CustomSelectAdmin;
