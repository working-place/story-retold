import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { sendMetrikaHit } from '../../../utils/yandexMetrika';

/**
 * Отправляет в Яндекс Метрику виртуальный хит при каждом изменении маршрута.
 * Первый просмотр не дублируется — его счётчик засчитывает сам при инициализации.
 * Монтируется внутри <Router> в App.tsx.
 */
export default function MetrikaRouteTracker() {
  const location = useLocation();
  const prevUrl = useRef<string | null>(null);

  useEffect(() => {
    const url = location.pathname + location.search;
    // первый рендер пропускаем (просмотр засчитывает сам счётчик при init),
    // повтор с тем же URL — двойной монтаж эффекта в StrictMode
    if (prevUrl.current !== null && prevUrl.current !== url) {
      sendMetrikaHit(url, { referer: prevUrl.current });
    }
    prevUrl.current = url;
  }, [location.pathname, location.search]);

  return null;
}
