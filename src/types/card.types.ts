export interface AdditionalCardImages {
    id: number;
    card_id: number;
    image: string;
    created_at: string;
    updated_at: string;
}

export interface CardData {
    id: number;
    dateBirth: string;
    dateDeath: string;
    placeBirth: string;
    name: string;
    nameAndClass: string;
    email: string;
    description: string;
    militaryRank: string;
    placeService: string;
    placeConscription: string;
    chapter: 'svo' | 'gpw';
    photoHero: string | null;
    published: boolean;
    createdAt: string;
    updatedAt: string;
    additionalCardImages: AdditionalCardImages[];
}

export interface Hero {
    id: number;
    name: string;
    range: string;
    dateOfBirth: string;
    dateOfDeath: string;
    img: string;
    description: string;
    type: 'SVO' | 'GPW';
    placeBirth: string;
    placeService: string;
    placeConscription: string;
    email: string;
    nameAndClass: string;
    additionalImages: string[];
    cardData?: CardData;
}

export interface HeroesPageProps {
    path?: string;
    text?: string;
}
