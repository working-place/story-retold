import type { CardData, Hero } from "../../types/card.types";
import type {
  CardResponse,
  CardShowQueryParams,
  Chapter,
} from '../../types/api.types';
import { httpClient, ApiError } from '../http.client';
import { ENDPOINTS, buildImageUrl } from './api';

function transformCardToHero(card: CardResponse): Hero {
  console.log('🔄 card.additionalCardImages:', card.additionalCardImages);

  const photoHeroUrl =
    typeof card.photoHero === 'string'
      ? card.photoHero
      : (card.photoHero?.image || null);

  const imgUrl = buildImageUrl(photoHeroUrl);

  const additionalImages: string[] = (card.additionalCardImages || []).map(
    (img) => buildImageUrl(img.image)
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
    additionalCardImages: (card.additionalCardImages || []).map((img) => ({
      id: img.id,
      card_id: card.id,
      image: img.image,
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
 *
 * @param skipAuth Публичный список (listPublished) ид без токена и видит только
 *   опубликованные карточки. Админский список (list) шлёт токен — без него бэкенд
 *   игнорирует флаг published=0 и отдаёт только опубликованные, поэтому черновики
 *   не видны.
 */
async function list(
  params: CardShowQueryParams = {},
  skipAuth = true
): Promise<Hero[]> {
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
    { method: 'GET', skipAuth }
  );

  if (!cards || !Array.isArray(cards)) return [];
  return cards.map(transformCardToHero);
}

export const heroesApi = {
  /** Публичный список опубликованных героев раздела. */
  listPublished: (chapter: Chapter): Promise<Hero[]> =>
    list({ chapter, published: true }),

  /** Список карточек для админки (не опубликованные / все — по params). */
  list: (params?: CardShowQueryParams): Promise<Hero[]> => list(params, false),

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

    console.log('📸 Полный ответ от бэкенда:', card);
console.log('📸 card.additionalImages:', card.additionalCardImages);

    if (!card || !card.published) return null;
    return transformCardToHero(card);
  },

  create: (data: FormData): Promise<{ id: number }> => {
    console.log('📤 heroesApi.create вызван!');
    console.log('📤 data entries:');
    for (const pair of data.entries()) {
        console.log('  ', pair[0], pair[1] instanceof File ? `File: ${pair[1].name}` : pair[1]);
    }
    return httpClient<{ id: number }>(ENDPOINTS.CARD.CREATE, {
        method: 'POST',
        body: data,
        skipAuth: false,
    });
},

  // create: (data: FormData): Promise<{ id: number }> =>
  //   httpClient<{ id: number }>(ENDPOINTS.CARD.CREATE, {
  //     method: 'POST',
  //     body: data,
  //     skipAuth: false,
  //   }),

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
