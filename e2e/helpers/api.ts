import type { APIRequestContext } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';
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

// Бек лимитирует логины (HTTP 429) — кэшируем access_token на диск между
// прогонами (Sanctum-токены долгоживущие). Файл в .gitignore.
const TOKEN_CACHE_FILE = resolve(process.cwd(), '.e2e-token-cache.json');
const TOKEN_TTL_MS = 55 * 60 * 1000; // 55 минут

interface TokenCache {
  token: string;
  ts: number;
}

function readCachedToken(): string | null {
  try {
    const cache = JSON.parse(readFileSync(TOKEN_CACHE_FILE, 'utf8')) as TokenCache;
    if (cache?.token && Date.now() - cache.ts < TOKEN_TTL_MS) return cache.token;
  } catch { /* нет кэша/протух — логинимся заново */ }
  return null;
}

function writeCachedToken(token: string): void {
  try {
    writeFileSync(TOKEN_CACHE_FILE, JSON.stringify({ token, ts: Date.now() }));
  } catch { /* кэш не критичен */ }
}

/**
 * POST /api/login {email,password} → access_token (контракт фронта, auth.ts).
 * force: true — игнорировать кэш и логиниться заново (для теста самого логина).
 */
export async function loginAdmin(request: APIRequestContext, force = false): Promise<AdminAuth> {
  if (!force) {
    const cached = readCachedToken();
    if (cached) return { token: cached };
  }

  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;

  // Параллельные воркеры могут логиниться одновременно и ловить 429 —
  // одна повторная попытка с паузой.
  let response = await request.post(`${API_BASE}/api/login`, {
    data: { email, password },
  });
  if (response.status() === 429) {
    await new Promise((r) => setTimeout(r, 5000));
    response = await request.post(`${API_BASE}/api/login`, {
      data: { email, password },
    });
  }

  if (!response.ok()) {
    if (response.status() === 429) {
      throw new Error('login: HTTP 429 — бек лимитирует логины, подожди пару минут и перезапусти (кэш токена смягчает, но не отменяет лимит)');
    }
    throw new Error(`login упал: HTTP ${response.status()} — проверь E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD в .env`);
  }

  const body = (await response.json()) as { access_token?: string };
  if (!body.access_token) {
    throw new Error('login не вернул access_token — контракт бека изменился?');
  }
  writeCachedToken(body.access_token);
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
