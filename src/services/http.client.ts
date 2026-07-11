import { getToken, removeToken } from '../utils/authStorage';
import { API_BASE_URL } from './api/api';

export interface FetchOptions extends Omit<RequestInit, 'body'> {
  /** Не добавлять Authorization-заголовок и не редиректить на /login при 401. */
  skipAuth?: boolean;
  /**
   * Тело запроса. Объекты, не являющиеся FormData, сериализуются в JSON
   * автоматически (см. реализацию ниже).
   */
  body?: BodyInit | Record<string, unknown> | null;
}

/** Ошибка API с распарсенным телом ответа. */
export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

export async function httpClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers);

  headers.set('Accept', 'application/json');

  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (!options.skipAuth) {
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  let body: BodyInit | null | undefined = options.body as BodyInit | null | undefined;
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    body = JSON.stringify(options.body);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body,
  });

  if (response.status === 401) {
    removeToken();
    const errorData = await response.json().catch(() => ({}));
    // Редирект на логин только если запрос был защищённым — значит,
    // сессия истекла и её нужно восстановить.
    if (!options.skipAuth && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new ApiError(
      errorData.message || 'Ошибка авторизации',
      401,
      errorData.errors
    );
  }

  if (!response.ok) {
    // 413 приходит от nginx/PHP до серверной валидации, когда payload
    // превысил серверный лимит размера тела. Тела у такого ответа нет, поэтому
    // показываем осмысленное сообщение вместо «Request failed with status 413».
    if (response.status === 413) {
      throw new ApiError(
        'Размер загруженных данных слишком велик. Уменьшите размер изображений и попробуйте снова.',
        413
      );
    }
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `Request failed with status ${response.status}`,
      response.status,
      errorData.errors
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
