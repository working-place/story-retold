export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? '';

export const BACKEND_ORIGIN: string =
  import.meta.env.VITE_BACKEND_URL || 'https://digital-memory.ru/api';

export function buildImageUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;

  return `${BACKEND_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
}

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/login',
    SEND_RESTORE_CODE: '/api/send-restore-code',
    RESTORE: (token: string) => `/api/restore/${token}`,
    CHANGE_PASSWORD: '/api/change-admin-password',
  },
  CARD: {
    SHOW: '/api/card/show',
    GET: (id: number) => `/api/card/get/${id}`,
    CREATE: '/api/card/create',
    UPDATE: (id: number) => `/api/card/update/${id}`,
    DELETE: (id: number) => `/api/card/delete/${id}`,
  },
} as const;
