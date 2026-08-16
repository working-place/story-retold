import type { APIRequestContext } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * API-хелперы для @real-тестов: логин и чтение карточки от имени админа.
 * Креды берём из .env (E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD) — .env в
 * gitignore, в репо только .env.example с плейсхолдерами.
 */

// Воркеры Playwright получают снапшот env ДО исполнения конфига, поэтому
// .env читаем здесь — прямо в worker-процессе. Ничего не перезаписываем.
try {
  const envPath = resolve(process.cwd(), '.env');
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch {
  // .env отсутствует — тесты @real без кредов сами пометятся skip
}

export const API_BASE = process.env.VITE_API_BASE_URL || 'https://digital-memory.ru/api';

export interface AdminAuth {
  token: string;
}

/** POST /api/login {email,password} → access_token (контракт фронта, auth.ts). */
export async function loginAdmin(request: APIRequestContext): Promise<AdminAuth> {
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;

  const response = await request.post(`${API_BASE}/api/login`, {
    data: { email, password },
  });

  if (!response.ok()) {
    throw new Error(`login упал: HTTP ${response.status()} — проверь E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD в .env`);
  }

  const body = (await response.json()) as { access_token?: string };
  if (!body.access_token) {
    throw new Error('login не вернул access_token — контракт бека изменился?');
  }
  return { token: body.access_token };
}

/**
 * GET /api/card/get/{id} с Bearer — админский просмотр карточки
 * (публично этот эндпоинт отдаёт 401 «Access close»).
 */
export async function getCardAsAdmin(
  request: APIRequestContext,
  token: string,
  id: number | string
): Promise<Record<string, unknown>> {
  const response = await request.get(`${API_BASE}/api/card/get/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok()) {
    throw new Error(`GET /api/card/get/${id} с токеном упал: HTTP ${response.status()}`);
  }

  const body = (await response.json()) as Record<string, unknown>;
  // бек может отдавать {data: {...}} или саму запись — нормализуем
  const card = (body.data && typeof body.data === 'object' ? body.data : body) as Record<string, unknown>;
  if (!card || typeof card !== 'object') {
    throw new Error('GET /api/card/get вернул неожиданную структуру (нет объекта карточки)');
  }
  return card;
}
