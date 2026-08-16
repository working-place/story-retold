import type { Page, Locator } from '@playwright/test';
import zlib from 'node:zlib';

/**
 * Общие селекторы и заполнение формы «Расскажите о герое».
 * Поля ищем по placeholder (уникальны) и тексту кнопок/подписей.
 */

export const SELECTORS = {
  dateBirth: 'input[placeholder="ДД.ММ.ГГГГ"] >> nth=0',
  dateDeath: 'input[placeholder="ДД.ММ.ГГГГ"] >> nth=1',
  placeBirth: 'input[placeholder="Место рождения"]',
  heroName: 'input[placeholder="Введите Ф.И.О."]',
  author: 'input[placeholder="Введите Ф.И.О. и класс"]',
  email: 'input[placeholder="Почта"]',
  description: 'textarea[placeholder="Введите описание"]',
  militaryRank: 'input[placeholder="Воинское звание"]',
  placeService: 'input[placeholder="Место службы"]',
  placeConscription: 'input[placeholder="Место призыва"]',
  pickHeroPhoto: 'button:has-text("Выбрать файл")',
  pickAdditionalPhotos: 'button:has-text("Выбрать файлы")',
  replaceHeroPhoto: 'button:has-text("Заменить фото")',
  submit: 'button:has-text("Отправить сведения о герое")',
  successPopup: 'text=Карточка успешно создана',
};

export interface TestCard {
  heroName: string;
  dateBirth: string;
  dateDeath: string;
  placeBirth: string;
  author: string;
  email: string;
  description: string;
  militaryRank: string;
  placeService: string;
  placeConscription: string;
}

/** Уникальные тестовые данные (таймстамп — чтобы не конфликтовать на реальном беке). */
export function makeTestCard(): TestCard {
  const stamp = Date.now().toString().slice(-8);
  return {
    heroName: `E2E Тестовый Герой ${stamp}`,
    dateBirth: '01.01.1920',
    dateDeath: '09.05.1985',
    placeBirth: `e2e-город-${stamp}`,
    author: `E2E Автор ${stamp}, 9А`,
    email: `e2e-${stamp}@example.com`,
    description: `E2E автотест карточки ${stamp}. Создан Playwright-ом, бек её почистит.`,
    militaryRank: `e2e-звание-${stamp}`,
    placeService: `e2e-служба-${stamp}`,
    placeConscription: `e2e-призыв-${stamp}`,
  };
}

/** Заполнить ВСЕ поля формы (обязательные и необязательные) + чекбоксы согласия. */
export async function fillAllFields(page: Page, card: TestCard): Promise<void> {
  // Основные сведения
  await page.locator(SELECTORS.dateBirth).fill(card.dateBirth);
  await page.locator(SELECTORS.dateDeath).fill(card.dateDeath);
  await page.locator(SELECTORS.placeBirth).fill(card.placeBirth);
  await page.locator(SELECTORS.heroName).fill(card.heroName);
  await page.locator(SELECTORS.author).fill(card.author);
  await page.locator(SELECTORS.email).fill(card.email);
  await page.locator(SELECTORS.description).fill(card.description);
  // Дополнительные сведения
  await page.locator(SELECTORS.militaryRank).fill(card.militaryRank);
  await page.locator(SELECTORS.placeService).fill(card.placeService);
  await page.locator(SELECTORS.placeConscription).fill(card.placeConscription);
  await checkConsent(page);
}

/** Заполнить только обязательные поля + чекбоксы (для негативных/минимальных сценариев). */
export async function fillRequired(page: Page, card: TestCard): Promise<void> {
  await page.locator(SELECTORS.dateBirth).fill(card.dateBirth);
  await page.locator(SELECTORS.placeBirth).fill(card.placeBirth);
  await page.locator(SELECTORS.heroName).fill(card.heroName);
  await page.locator(SELECTORS.author).fill(card.author);
  await page.locator(SELECTORS.description).fill(card.description);
  await checkConsent(page);
}

/** Отметить оба чекбокса согласия (клик по label, связанному с input). */
export async function checkConsent(page: Page): Promise<void> {
  const boxes = page.locator('label:has(input[type="checkbox"])');
  await boxes.first().click();
  await boxes.nth(1).click();
}

// ---------------------------------------------------------------
//  Генерация тестовых PNG (валидные файлы, без внешних ассетов)
// ---------------------------------------------------------------

function crc32(buf: Buffer): number {
  let c: number;
  const table: number[] = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}

/** Простой валидный PNG size×size (коричневый квадрат) для загрузки в форму. */
export function makeTestPng(size = 64): Buffer {
  const rgb = Buffer.alloc(size * (size * 3 + 1));
  for (let y = 0; y < size; y++) {
    const rowStart = y * (size * 3 + 1);
    rgb[rowStart] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const i = rowStart + 1 + x * 3;
      rgb[i] = 83; rgb[i + 1] = 64; rgb[i + 2] = 53; // #534035
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8-bit RGB
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(rgb)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

export function submitButton(page: Page): Locator {
  return page.locator(SELECTORS.submit);
}
