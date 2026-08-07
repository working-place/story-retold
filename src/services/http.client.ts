import { getToken, removeToken } from '../utils/authStorage';
import { API_BASE_URL } from './api/api';

export interface FetchOptions extends Omit<RequestInit, 'body'> {
  skipAuth?: boolean;
  body?: BodyInit | Record<string, unknown> | null;
}

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

function isRawBody(body: unknown): body is BodyInit {
  return (
    typeof body === 'string' ||
    body instanceof FormData ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    body instanceof URLSearchParams
  );
}

export async function httpClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers);

  headers.set('Accept', 'application/json');

  if (!options.skipAuth) {
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  let body: BodyInit | null | undefined = undefined;

  if (options.body !== undefined && options.body !== null) {
    if (isRawBody(options.body)) {
      body = options.body;
    } else if (typeof options.body === 'object') {
      body = JSON.stringify(options.body);
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body,
  });

  if (!response.ok) {
    if (response.status === 401) {
      removeToken();
      if (!options.skipAuth && typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    if (response.status === 413) {
      throw new ApiError(
        'Размер загруженных данных слишком велик. Уменьшите размер изображений и попробуйте снова.',
        413
      );
    }

    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message ||
      (response.status === 401
        ? 'Ошибка авторизации'
        : `Request failed with status ${response.status}`),
      response.status,
      errorData.errors
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}
