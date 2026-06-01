import type { CardData, Hero, AdditionalCardImages } from "../../types/card.types";
import type {
  CardResponse,
  CardShowResponse,
  CardShowQueryParams,
} from '../../types/api.types';
import { httpClient } from '../http.client';

const API_BASE_URL = 'http://94.250.255.173:8000';

const ENDPOINTS = {
    CARD: {
        GET: (id: number): string => `/api/card/get/${id}`,
        SHOW: '/api/card/show',
    },
} as const;

interface GetCardsParams {
    chapter?: 'svo' | 'gpw';
    published?: boolean;
    paginate?: 25 | 50 | 100 | 250 | 500;
}

async function request<T>(endpoint: string): Promise<T | null> {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data as T;
    } catch (error) {
        console.error('API request failed:', error);
        return null;
    }
}

export async function getCard(id: number): Promise<CardData | null> {
    return request<CardData>(ENDPOINTS.CARD.GET(id));
}

export async function getCards(params?: GetCardsParams): Promise<CardData[] | null> {
    const queryParams = new URLSearchParams();
    if (params?.chapter) queryParams.append('chapter', params.chapter);
    if (params?.published !== undefined) queryParams.append('published', String(params.published));
    if (params?.paginate) queryParams.append('paginate', String(params.paginate));

    const queryString = queryParams.toString();
    const url = `${ENDPOINTS.CARD.SHOW}${queryString ? `?${queryString}` : ''}`;
    return request<CardData[]>(url);
}

function buildImageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
}

export function transformToHero(card: CardData): Hero {
    const additionalImages: string[] = card.additionalCardImages.map(
        (img: AdditionalCardImages) => buildImageUrl(img.image)
    );

    return {
        id: card.id,
        name: card.name,
        range: card.militaryRank,
        dateOfBirth: card.dateBirth,
        dateOfDeath: card.dateDeath,
        img: card.photoHero ? buildImageUrl(card.photoHero) : '',
        description: card.description,
        type: card.chapter === 'svo' ? 'SVO' : 'GPW',
        placeBirth: card.placeBirth,
        placeService: card.placeService,
        placeConscription: card.placeConscription,
        email: card.email,
        nameAndClass: card.nameAndClass,
        additionalImages,
        cardData: card,
    };
}

export async function getHeroes(chapter: 'svo' | 'gpw'): Promise<Hero[]> {
    const cards = await getCards({ chapter, published: true });
    if (!cards) return [];
    return cards.map((card: CardData) => transformToHero(card));
}

export async function getHeroById(id: number): Promise<Hero | null> {
    const card = await getCard(id);
    if (!card) return null;
    return transformToHero(card);
}

export const heroesApi = {
    // Создание карточки героя (публичная форма)
    create: (data: FormData): Promise<{ id: number }> => {
        return httpClient<{ id: number }>('/api/card/create', {
            method: 'POST',
            body: data,
            skipAuth: true,
        });
    },

    // Получение списка карточек (с фильтрацией)
    show: (params?: CardShowQueryParams): Promise<CardShowResponse> => {
        const searchParams = new URLSearchParams();
        if (params?.chapter) searchParams.append('chapter', params.chapter);
        if (params?.published !== undefined) searchParams.append('published', String(params.published));
        if (params?.perPage) searchParams.append('perPage', String(params.perPage));
        if (params?.page) searchParams.append('page', String(params.page));

        const query = searchParams.toString();
        return httpClient<CardShowResponse>(`/api/card/show${query ? `?${query}` : ''}`, {
            method: 'GET',
            skipAuth: !params?.published,
        });
    },

    // Получение одной карточки по ID
    get: (id: number): Promise<CardResponse> => {
        return httpClient<CardResponse>(`/api/card/get/${id}`, {
            method: 'GET',
        });
    },

    // Обновление карточки (только админ)
    update: (id: number, data: FormData): Promise<void> => {
        return httpClient<void>(`/api/card/update/${id}`, {
            method: 'PATCH',
            body: data,
        });
    },

    // Удаление карточки (только админ)
    delete: (id: number): Promise<void> => {
        return httpClient<void>(`/api/card/delete/${id}`, {
            method: 'DELETE',
        });
    },
};
