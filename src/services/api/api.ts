export const API_BASE_URL = 'http://94.250.255.173:8000';

export const ENDPOINTS = {
    CARD: {
        GET: (id: number): string => `/api/card/get/${id}`,
        SHOW: '/card/show',
    },
} as const;
