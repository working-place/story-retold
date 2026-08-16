import { test, expect } from '@playwright/test';
import { fillRequired, makeTestCard, SELECTORS, submitButton } from './helpers/form';

/**
 * @mock — форма с перехваченным POST /api/card/create (бек не нужен).
 * Проверяем: рендер, валидация, payload уходит с правильными полями,
 * попап успеха показывается.
 */

test.describe('Форма «Расскажите о герое» [MOCK]', () => {
  test('@mock позитив: обязательные поля → payload корректный → попап успеха', async ({ page }) => {
    let createCalls = 0;
    const sentBody: Record<string, string> = {};

    await page.route('**/api/card/create', async (route) => {
      createCalls++;
      const request = route.request();
      if (request.method() === 'POST') {
        // тело — multipart: у route.request() нет formData(), парсим вручную
        const raw = request.postData() ?? '';
        for (const m of raw.matchAll(/name="([^"]+)"\r\n\r\n([\s\S]*?)\r\n--/g)) {
          sentBody[m[1]] = m[2];
        }
        // эмулируем контракт, который ждёт фронт: { id: number }
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 1 }) });
      } else {
        await route.continue();
      }
    });

    const card = makeTestCard();
    await page.goto('/');
    await fillRequired(page, card);
    await submitButton(page).click();

    // попап успеха
    await expect(page.locator(SELECTORS.successPopup)).toBeVisible({ timeout: 15_000 });

    // запрос ушёл ровно один раз и с правильными полями
    expect(createCalls).toBe(1);
    expect(sentBody.name).toBe(card.heroName);
    expect(sentBody.placeBirth).toBe(card.placeBirth);
    expect(sentBody.nameAndClass).toBe(card.author);
    expect(sentBody.description).toBe(card.description);
    // согласия обязаны уходить в payload (без них бек отвечает validation.required)
    expect(sentBody.consent).toBe('1');
    expect(sentBody.privacyPolicy).toBe('1');
  });

  test('@mock негатив: пустая форма → запрос НЕ уходит, попапа успеха нет', async ({ page }) => {
    let createCalls = 0;
    await page.route('**/api/card/create', async (route) => {
      createCalls++;
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 1 }) });
    });

    await page.goto('/');
    // ни одного поля не заполняем — сабмит должен быть заблокирован валидацией
    await submitButton(page).click();
    await page.waitForTimeout(1500);

    expect(createCalls).toBe(0);
    await expect(page.locator(SELECTORS.successPopup)).toHaveCount(0);
  });

  test('@mock негатив: без чекбоксов согласия запрос НЕ уходит', async ({ page }) => {
    let createCalls = 0;
    await page.route('**/api/card/create', async (route) => {
      createCalls++;
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 1 }) });
    });

    const card = makeTestCard();
    await page.goto('/');
    await page.locator(SELECTORS.dateBirth).fill(card.dateBirth);
    await page.locator(SELECTORS.placeBirth).fill(card.placeBirth);
    await page.locator(SELECTORS.heroName).fill(card.heroName);
    await page.locator(SELECTORS.author).fill(card.author);
    await page.locator(SELECTORS.description).fill(card.description);
    // чекбоксы НЕ отмечаем
    await submitButton(page).click();
    await page.waitForTimeout(1500);

    expect(createCalls).toBe(0);
    await expect(page.locator(SELECTORS.successPopup)).toHaveCount(0);
  });
});
