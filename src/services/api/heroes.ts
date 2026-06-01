import type {
  CardResponse,
  CardShowResponse,
  CardShowQueryParams,
} from '../../types/api.types';
import { httpClient } from '../http.client';

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