import { test, expect } from '@playwright/test';
import { fillAllFields, makeTestCard, makeTestPng, SELECTORS, submitButton } from './helpers/form';
import { loginAdmin, getCardAsAdmin } from './helpers/api';

/**
 * @real — ГЛАВНЫЙ режим разработки: форма против реального бека
 * (https://digital-memory.ru/api). Ловит «ложный контракт»: если бек
 * изменит ответ (нет id, другой статус, другая форма ошибок) — тест упадёт.
 * Мусорные карточки ок — бек базу чистит (подтверждено командой).
 */

test.describe('Форма «Расскажите о герое» [REAL API]', () => {
  test('@real позитив: ВСЕ поля → отправить → бек ответил контрактом {id} → попап успеха', async ({ page }) => {
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
    await fillAllFields(page, card);
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

  test('@real позитив: бек сохранил ВСЕ отправленные поля (echo-ответ create)', async ({ page }) => {
    const card = makeTestCard();

    let responseBody: Record<string, unknown> | null = null;
    page.on('response', async (response) => {
      if (response.url().includes('/api/card/create') && response.request().method() === 'POST') {
        try { responseBody = await response.json(); } catch { responseBody = null; }
      }
    });

    await page.goto('/');
    await fillAllFields(page, card);
    await submitButton(page).click();
    await expect(page.locator(SELECTORS.successPopup)).toBeVisible({ timeout: 30_000 });

    // Публичные GET-эндпоинты непубликованные карточки не отдают
    // (/card/show — только published, /card/get/:id — 401 без админа),
    // поэтому сверяем echo-ответ create: бек возвращает сохранённую запись.
    expect(responseBody, 'create должен вернуть JSON-запись').not.toBeNull();
    const saved = responseBody!;
    // обязательные
    expect(saved.name).toBe(card.heroName);
    expect(saved.placeBirth).toBe(card.placeBirth);
    expect(saved.nameAndClass).toBe(card.author);
    expect(saved.description).toBe(card.description);
    // необязательные — тоже должны дойти и сохраниться
    expect(saved.email).toBe(card.email);
    expect(saved.militaryRank).toBe(card.militaryRank);
    expect(saved.placeService).toBe(card.placeService);
    expect(saved.placeConscription).toBe(card.placeConscription);
    expect(saved.chapter).toBe('svo');
    // фронт конвертирует DD.MM.YYYY → Y-m-d, бек хранит дату в этом формате
    expect(saved.dateBirth).toBe('1920-01-01');
    expect(saved.dateDeath).toBe('1985-05-09');
    expect(saved.published).toBeNull(); // новая карточка уходит на модерацию
  });

  test('@real ФОТО: фото героя + 2 доп. изображения → превью → отправка → бек сохранил файлы', async ({ page }) => {
    const card = makeTestCard();

    let responseBody: Record<string, unknown> | null = null;
    let sentMultipart = '';
    // Инспекция multipart без подмены: route + fallback (тело доступно
    // гарантированно, в отличие от событий request/response на cross-origin)
    await page.route('**/api/card/create', async (route) => {
      if (route.request().method() === 'POST') {
        const buf = route.request().postDataBuffer();
        if (buf) sentMultipart = buf.toString('latin1');
      }
      await route.fallback();
    });
    page.on('response', async (response) => {
      if (response.url().includes('/api/card/create') && response.request().method() === 'POST') {
        try { responseBody = await response.json(); } catch { responseBody = null; }
      }
    });

    await page.goto('/');
    await fillAllFields(page, card);

    // --- фото героя (primary): скрытый input#photoHero ---
    await page.setInputFiles('#photoHero', {
      name: 'e2e-hero.png',
      mimeType: 'image/png',
      buffer: makeTestPng(64),
    });
    // после загрузки зона превращается в превью с кнопкой «Заменить фото»
    await expect(page.locator(SELECTORS.replaceHeroPhoto)).toBeVisible({ timeout: 20_000 });

    // --- доп. изображения (secondary): input#additionalImages, multiple ---
    await page.setInputFiles('#additionalImages', [
      { name: 'e2e-award-1.png', mimeType: 'image/png', buffer: makeTestPng(64) },
      { name: 'e2e-award-2.png', mimeType: 'image/png', buffer: makeTestPng(64) },
    ]);
    // счётчик в кнопке должен показать 2/9
    await expect(page.locator('button:has-text("Выбрать файлы (2/9)")')).toBeVisible({ timeout: 20_000 });

    await submitButton(page).click();
    await expect(page.locator(SELECTORS.successPopup)).toBeVisible({ timeout: 60_000 });

    // multipart-запрос реально содержит файловые части и cardType=withPhoto
    expect(sentMultipart).toContain('name="cardType"');
    expect(sentMultipart).toContain('withPhoto');
    // имя файла после компрессии может отличаться от исходного — важно,
    // что часть файловая (есть filename)
    expect(sentMultipart).toContain('name="photoHero"; filename="');
    expect(sentMultipart).toContain('name="additionalCardImages[0][image]"; filename="');
    expect(sentMultipart).toContain('name="additionalCardImages[1][image]"; filename="');

    // бек сохранил и вернул файлы: photoHero — URL, доп. — массив из 2
    const saved = responseBody!;
    expect(String(saved.photoHero), 'бек должен вернуть URL фото героя').toContain('/');
    const additional = (saved.additionalCardImages ?? []) as unknown[];
    expect(additional.length, 'доп. изображения должны сохраниться (2 шт.)').toBe(2);
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

  /**
   * Админ-проверка: карточка ДЕЙСТВИТЕЛЬНО лежит на беке, и в ней ровно те
   * поля, что отправляли из формы.
   *
   * Цепочка: форма → POST /api/card/create (берём id из echo) →
   * POST /api/login (креды из .env: E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD) →
   * GET /api/card/get/{id} с Bearer → сверка полей.
   *
   * ⚠️ Тест «может быть неверным из-за работы бека» — и это фича: если бек
   * изменит контракт (login без access_token, get/{id} с другой структурой,
   * модерация не отдаёт новые карточки, поля режутся) — упадёт здесь и укажет
   * конкретное расхождение.
   */
  test('@real админ: карточка на беке содержит отправленные поля (login → get/{id})', async ({ page, request }) => {
    test.skip(
      !process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD,
      'задай E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD в .env (см. .env.example)'
    );

    const card = makeTestCard();

    // 1) создаём карточку через форму, id берём из echo-ответа
    let createdId: number | null = null;
    page.on('response', async (response) => {
      if (response.url().includes('/api/card/create') && response.request().method() === 'POST') {
        try {
          const body = await response.json();
          if (body && typeof body.id !== 'undefined') createdId = Number(body.id);
        } catch { /* тело не JSON — тест упадёт ниже на createdId */ }
      }
    });

    await page.goto('/');
    await fillAllFields(page, card);
    await submitButton(page).click();
    await expect(page.locator(SELECTORS.successPopup)).toBeVisible({ timeout: 30_000 });
    expect(createdId, 'create должен вернуть id').not.toBeNull();

    // 2) логинимся тестовым админом
    const auth = await loginAdmin(request);

    // 3) читаем карточку админским эндпоинтом и сверяем поля
    const fetched = await getCardAsAdmin(request, auth.token, createdId!);

    expect(Number(fetched.id)).toBe(createdId!);
    // обязательные
    expect(fetched.name).toBe(card.heroName);
    expect(fetched.placeBirth).toBe(card.placeBirth);
    expect(fetched.nameAndClass).toBe(card.author);
    expect(fetched.description).toBe(card.description);
    // необязательные
    expect(fetched.email).toBe(card.email);
    expect(fetched.militaryRank).toBe(card.militaryRank);
    expect(fetched.placeService).toBe(card.placeService);
    expect(fetched.placeConscription).toBe(card.placeConscription);
    expect(fetched.chapter).toBe('svo');
    // даты хранятся в Y-m-d
    expect(fetched.dateBirth).toBe('1920-01-01');
    expect(fetched.dateDeath).toBe('1985-05-09');
    // свежая карточка ещё на модерации. ⚠️ бек непоследователен: create-echo
    // отдаёт published: null, а админский get/{id} — false. Ловим оба.
    expect(fetched.published).toBeFalsy();
  });
});
