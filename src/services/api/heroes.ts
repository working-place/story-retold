import type { CardData, Hero } from "../../types/card.types";
import type { CardResponse, CardShowResponse, CardShowQueryParams } from '../../types/api.types';
import { httpClient } from '../http.client';

// const API_BASE_URL = 'http://94.250.255.173:8000';
const API_BASE_URL = 'https://digital-memory.ru/api';

function buildImageUrl(path: string | null | undefined): string {

    if (!path) return '';
    if (path.startsWith('http')) return path;

    const fullUrl = `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;

    return fullUrl;
}

function transformCardToHero(card: CardResponse): Hero {

    const photoHeroUrl = typeof card.photoHero === 'string'
        ? card.photoHero
        : (card.photoHero?.url || null);

    const imgUrl = buildImageUrl(photoHeroUrl);

    const additionalImages: string[] = (card.additionalImages || []).map(
        (img) => buildImageUrl(img.url)
    );

    const cardData: CardData = {
        id: card.id,
        dateBirth: card.dateBirth,
        dateDeath: card.dateDeath || '',
        placeBirth: card.placeBirth,
        name: card.name,
        nameAndClass: card.nameAndClass || '',
        email: card.email || '',
        description: card.description,
        militaryRank: card.militaryRank || '',
        placeService: card.placeService || '',
        placeConscription: card.placeConscription || '',
        chapter: card.chapter,
        photoHero: photoHeroUrl,
        published: card.published,
        createdAt: card.created_at,
        updatedAt: card.updated_at,
        additionalCardImages: (card.additionalImages || []).map(img => ({
            id: img.id,
            card_id: card.id,
            image: img.url,
            created_at: '',
            updated_at: '',
        })),
    };

    return {
        id: card.id,
        name: card.name,
        range: card.militaryRank || '',
        dateOfBirth: card.dateBirth,
        dateOfDeath: card.dateDeath || '',
        img: imgUrl,
        description: card.description,
        type: card.chapter === 'svo' ? 'SVO' : 'GPW',
        placeBirth: card.placeBirth,
        placeService: card.placeService || '',
        placeConscription: card.placeConscription || '',
        email: card.email || '',
        nameAndClass: card.nameAndClass || '',
        additionalImages,
        cardData,
    };
}

export async function getHeroes(chapter: 'svo' | 'gpw'): Promise<Hero[]> {
    try {
        const response = await httpClient<CardResponse[]>(
            '/api/card/show',
            {
                method: 'GET',
                skipAuth: true,
            }
        );

        if (!response || !Array.isArray(response)) return [];

        const filteredCards = response.filter(
            card => card.chapter === chapter && card.published === true
        );

        return filteredCards.map(transformCardToHero);
    } catch (error) {
        console.error('Failed to fetch heroes:', error);
        return [];
    }
}

export async function publishCard(id: number): Promise<void> {
    return httpClient<void>(`/api/card/update/${id}`, {
        method: 'PATCH',
        skipAuth: false,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            published: true,
        }),
    });
}

export async function getHeroById(id: number): Promise<Hero | null> {
    try {
        const card = await httpClient<CardResponse>(`/api/card/get/${id}`, {
            method: 'GET',
            skipAuth: true,
        });

        if (!card) return null;

        if (!card.published) return null;

        return transformCardToHero(card);
    } catch (error) {
        console.error('Failed to fetch hero:', error);
        return null;
    }
}

export const heroesApi = {
    create: (data: FormData): Promise<{ id: number }> => {
        return httpClient<{ id: number }>('/api/card/create', {
            method: 'POST',
            body: data,
            skipAuth: false,
        });
    },

    show: (params?: CardShowQueryParams): Promise<CardShowResponse> => {
        const searchParams = new URLSearchParams();
        if (params?.chapter) searchParams.append('chapter', params.chapter);

        if (params?.published !== undefined) {
            const publishedValue = typeof params.published === 'boolean'
                ? (params.published ? '1' : '0')
                : String(params.published);
            searchParams.append('published', publishedValue);
        }

        if (params?.perPage) searchParams.append('perPage', String(params.perPage));
        if (params?.page) searchParams.append('page', String(params.page));

        const query = searchParams.toString();
        return httpClient<CardShowResponse>(`/api/card/show${query ? `?${query}` : ''}`, {
            method: 'GET',
            skipAuth: false,
        });
    },

    get: (id: number): Promise<CardResponse> => {
        return httpClient<CardResponse>(`/api/card/get/${id}`, {
            method: 'GET',
            skipAuth: false,
        });
    },

    update: (id: number, data: FormData): Promise<void> => {
        return httpClient<void>(`/api/card/update/${id}`, {
            method: 'PATCH',
            body: data,
            skipAuth: false,
        });
    },

    delete: (id: number): Promise<void> => {
        return httpClient<void>(`/api/card/delete/${id}`, {
            method: 'DELETE',
        });
    },

};
