export interface Hero {
    id: number;
    name: string;
    img: string;
    dateOfBirth: string;
    dateOfDeath: string | null;
    range: string;
    type: string;
}

export interface HeroesPageProps {
    path?: string;
    text?: string;
}
