export const API_BASE_URL = '';

export const ENDPOINTS = {
    CARD: {
        GET: (id: number): string => `/api/card/get/${id}`,
        SHOW: '/api/card/show',
    },
} as const;
