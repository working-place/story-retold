import { getToken, removeToken } from '../utils/authStorage';
import { API_BASE_URL } from './api/api';

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
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

  let body = options.body;
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    body = JSON.stringify(body);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body,
  });

  if (response.status === 401) {
    removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Сессия истекла. Пожалуйста, войдите снова.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
