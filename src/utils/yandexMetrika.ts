/**
 * Интеграция счётчика Яндекс Метрики по официальной документации:
 * https://yandex.ru/support/metrica/ru/code/counter-initialize.html
 *
 * Скрипт tag.js подгружается асинхронно: вызовы ym() до его загрузки
 * попадают в очередь window.ym.a и обрабатываются после инициализации.
 */

const METRIKA_TAG_SRC = 'https://mc.yandex.ru/metrika/tag.js';

type Ym = ((...args: unknown[]) => void) & {
  a?: unknown[][];
  l?: number;
};

declare global {
  interface Window {
    ym?: Ym;
  }
}

let counterId: number | null = null;

/** Инициализирует счётчик и подключает скрипт tag.js. Повторный вызов игнорируется. */
export function initYandexMetrika(id: number): void {
  if (counterId !== null) return;
  counterId = id;

  if (!window.ym) {
    window.ym = (...args: unknown[]) => {
      const ym = window.ym!;
      (ym.a = ym.a || []).push(args);
      ym.l = Date.now();
    };
  }

  if (!document.querySelector<HTMLScriptElement>(`script[src="${METRIKA_TAG_SRC}"]`)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = METRIKA_TAG_SRC;
    document.head.prepend(script);
  }

  window.ym(id, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
  });
}

/** Отправляет виртуальный просмотр страницы (для SPA-навигации без перезагрузки). */
export function sendMetrikaHit(url: string, options?: { referer?: string }): void {
  if (counterId === null || !window.ym) return;

  const params: { title: string; referer?: string } = { title: document.title };
  if (options?.referer) params.referer = options.referer;

  window.ym(counterId, 'hit', url, params);
}

/** Отправляет достижение цели, созданной в интерфейсе Метрики. */
export function reachMetrikaGoal(target: string, goalParams?: Record<string, unknown>): void {
  if (counterId === null || !window.ym) return;
  window.ym(counterId, 'reachGoal', target, goalParams);
}
