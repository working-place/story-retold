import { getToken, removeToken } from '../utils/authStorage';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://94.250.255.173:8000';

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

  // ⚠️ КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: редирект на логин только если skipAuth === false
  if (response.status === 401) {
    removeToken();
    // Если запрос не помечен как skipAuth, значит это защищённый запрос,
    // и истекшая сессия требует редиректа.
    if (!options.skipAuth && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    // Пробрасываем ошибку, чтобы её можно было обработать на уровне компонента
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Ошибка авторизации');
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