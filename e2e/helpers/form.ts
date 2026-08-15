import type { Page, Locator } from '@playwright/test';

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
  description: 'textarea[placeholder="Введите описание"]',
  submit: 'button:has-text("Отправить сведения о герое")',
  successPopup: 'text=Карточка успешно создана',
  consentCheckbox: 'label:has(input[type="checkbox"]) >> text=Согласие на обработку',
  policyCheckbox: 'label:has(input[type="checkbox"]) >> text=Политика обработки',
};

export interface TestCard {
  heroName: string;
  dateBirth: string;
  placeBirth: string;
  author: string;
  description: string;
}

/** Уникальные тестовые данные (таймстамп — чтобы не конфликтовать на реальном беке). */
export function makeTestCard(): TestCard {
  const stamp = Date.now().toString().slice(-8);
  return {
    heroName: `E2E Тестовый Герой ${stamp}`,
    dateBirth: '01.01.1920',
    placeBirth: `e2e-город-${stamp}`,
    author: `E2E Автор ${stamp}, 9А`,
    description: `E2E автотест карточки ${stamp}. Создан Playwright-ом, бек её почистит.`,
  };
}

/** Заполнить все обязательные поля + чекбоксы согласия. */
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

export function submitButton(page: Page): Locator {
  return page.locator(SELECTORS.submit);
}
