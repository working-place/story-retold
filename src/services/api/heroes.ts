import type { CardData, Hero } from "../../types/card.types";
import type {
  CardResponse,
  CardShowQueryParams,
  Chapter,
} from '../../types/api.types';
import { httpClient, ApiError } from '../http.client';
import { ENDPOINTS, buildImageUrl } from './api';

function transformCardToHero(card: CardResponse): Hero {
  const photoHeroUrl =
    typeof card.photoHero === 'string'
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
    additionalCardImages: (card.additionalImages || []).map((img) => ({
      id: img.id,
      card_id: card.id,
      image: img.url,
      created_at: card.created_at,
      updated_at: card.updated_at,
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

/**
 * Список карточек с серверной фильтрацией.
 * Возвращает только то, что вернул бэкенд — фильтрация по published/chapter
 * выполняется на сервере, чтобы не утекали черновики на клиент.
 */
async function list(params: CardShowQueryParams = {}): Promise<Hero[]> {
  const searchParams = new URLSearchParams();

  if (params.chapter) searchParams.append('chapter', params.chapter);
  if (params.published !== undefined) {
    searchParams.append('published', params.published ? '1' : '0');
  }
  if (params.perPage) searchParams.append('perPage', String(params.perPage));
  if (params.page) searchParams.append('page', String(params.page));

  const query = searchParams.toString();
  const cards = await httpClient<CardResponse[]>(
    `${ENDPOINTS.CARD.SHOW}${query ? `?${query}` : ''}`,
    { method: 'GET', skipAuth: true }
  );

  if (!cards || !Array.isArray(cards)) return [];
  return cards.map(transformCardToHero);
}

export const heroesApi = {
  /** Публичный список опубликованных героев раздела. */
  listPublished: (chapter: Chapter): Promise<Hero[]> =>
    list({ chapter, published: true }),

  /** Список карточек для админки (не опубликованные / все — по params). */
  list: (params?: CardShowQueryParams): Promise<Hero[]> => list(params),

  get: (id: number): Promise<CardResponse> =>
    httpClient<CardResponse>(ENDPOINTS.CARD.GET(id), {
      method: 'GET',
      skipAuth: false,
    }),

  /** Публичная карточка героя по id — только если опубликована. */
  async getPublishedHero(id: number): Promise<Hero | null> {
    const card = await httpClient<CardResponse>(ENDPOINTS.CARD.GET(id), {
      method: 'GET',
      skipAuth: true,
    });
    if (!card || !card.published) return null;
    return transformCardToHero(card);
  },

  create: (data: FormData): Promise<{ id: number }> =>
    httpClient<{ id: number }>(ENDPOINTS.CARD.CREATE, {
      method: 'POST',
      body: data,
      skipAuth: false,
    }),

  update: (id: number, data: FormData | Record<string, unknown>): Promise<void> => {
    const isFormData = data instanceof FormData;
    return httpClient<void>(ENDPOINTS.CARD.UPDATE(id), {
      method: 'PATCH',
      body: isFormData ? data : (data as Record<string, unknown>),
      skipAuth: false,
    });
  },

  /** Публикация карточки (частный случай update). */
  publish: (id: number): Promise<void> =>
    heroesApi.update(id, { published: true }),

  delete: (id: number): Promise<void> =>
    httpClient<void>(ENDPOINTS.CARD.DELETE(id), {
      method: 'DELETE',
    }),
};

export { ApiError };
