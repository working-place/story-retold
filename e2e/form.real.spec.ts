import { test, expect } from '@playwright/test';
import { fillRequired, makeTestCard, SELECTORS, submitButton } from './helpers/form';

/**
 * @real — ГЛАВНЫЙ режим разработки: форма против реального бека
 * (https://digital-memory.ru/api). Ловит «ложный контракт»: если бек
 * изменит ответ (нет id, другой статус, другая форма ошибок) — тест упадёт.
 * Мусорные карточки ок — бек базу чистит (подтверждено командой).
 */

const CREATE_URL = '**/api/card/create';

test.describe('Форма «Расскажите о герое» [REAL API]', () => {
  test('@real позитив: заполнить → отправить → бек ответил контрактом {id} → попап успеха', async ({ page }) => {
    const card = makeTestCard();

    // перехватываем ТОЛЬКО для чтения ответа (не подменяем) — проверка контракта бека
    let responseStatus = 0;
    let responseBody: unknown = null;
    page.on('response', async (response) => {
      if (response.url().includes('/api/card/create') && response.request().method() === 'POST') {
        responseStatus = response.status();
        try {
          responseBody = await response.json();
        } catch {
          responseBody = null;
        }
      }
    });

    await page.goto('/');
    await fillRequired(page, card);
    await submitButton(page).click();

    // попап успеха (фронт показывает его только если в ответе есть id)
    await expect(page.locator(SELECTORS.successPopup)).toBeVisible({ timeout: 30_000 });

    // --- проверка контракта бека ---
    expect(responseStatus, 'POST /api/card/create должен вернуть 2xx').toBeGreaterThanOrEqual(200);
    expect(responseStatus).toBeLessThan(300);
    expect(responseBody, 'тело ответа должно быть JSON').not.toBeNull();
    const body = responseBody as Record<string, unknown>;
    expect(body, 'в ответе обязательно поле id (на него завязан попап успеха)').toHaveProperty('id');
    expect(Number.isFinite(Number(body.id)), 'id должен быть числом').toBe(true);
  });

  test('@real позитив: бек сохранил карточку — echo-ответ create совпадает с отправленным', async ({ page }) => {
    const card = makeTestCard();

    let responseBody: Record<string, unknown> | null = null;
    page.on('response', async (response) => {
      if (response.url().includes('/api/card/create') && response.request().method() === 'POST') {
        try { responseBody = await response.json(); } catch { responseBody = null; }
      }
    });

    await page.goto('/');
    await fillRequired(page, card);
    await submitButton(page).click();
    await expect(page.locator(SELECTORS.successPopup)).toBeVisible({ timeout: 30_000 });

    // Публичные GET-эндпоинты непубликованные карточки не отдают
    // (/card/show — только published, /card/get/:id — 401 без админа),
    // поэтому сверяем echo-ответ create: бек возвращает сохранённую запись.
    expect(responseBody, 'create должен вернуть JSON-запись').not.toBeNull();
    const saved = responseBody!;
    expect(saved.name).toBe(card.heroName);
    expect(saved.placeBirth).toBe(card.placeBirth);
    expect(saved.nameAndClass).toBe(card.author);
    expect(saved.description).toBe(card.description);
    expect(saved.chapter).toBe('svo');
    // фронт конвертирует DD.MM.YYYY → Y-m-d, бек хранит дату в этом формате
    expect(saved.dateBirth).toBe('1920-01-01');
    expect(saved.published).toBeNull(); // новая карточка уходит на модерацию
  });

  test('@real смоук: форма на странице рендерится целиком', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h2', { hasText: 'Расскажите о герое' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Основные сведения' })).toBeVisible();
    await expect(page.locator('h3', { hasText: 'Дополнительные сведения' })).toBeVisible();
    await expect(page.locator(SELECTORS.heroName)).toBeVisible();
    await expect(page.locator(SELECTORS.description)).toBeVisible();
    await expect(submitButton(page)).toBeVisible();
    await expect(page.locator('label:has(input[type="checkbox"])')).toHaveCount(2);
  });
});
