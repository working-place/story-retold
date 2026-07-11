import imageCompression from 'browser-image-compression';

/**
 * Сжатие изображений перед отправкой на сервер.
 *
 * Бэкенд (Laravel + nginx) режет multipart-запрос по размеру и отдаёт 413 ещё
 * до серверной валидации, причём лимит меньше 2 MB — поэтому даже один PNG на
 * ~1.9 MB проваливается. Чтобы не зависеть от серверного лимита и не гонять
 * лишний трафик, пережимаем картинку на клиенте: ужимаем по большей стороне до
 * 1920px (серверная валидация разрешает max 2000px) и цель в ~1 MB.
 *
 * Сжатие идёт в Web Worker, основной поток не блокируется.
 */

/** Целевой максимальный размер сжатого файла (MB). */
export const COMPRESSION_TARGET_MB = 1;

/**
 * Максимальная сторона после ресайза. Берём с запасом под серверный
 * max_width/max_height = 2000, чтобы пережатое фото гарантированно прошло
 * dimensions-валидацию бэкенда.
 */
export const COMPRESSION_MAX_DIMENSION = 1920;

/**
 * Сжимает изображение перед отправкой.
 *
 * Файлы, которые уже меньше цели и без превышения по стороне, библиотека
 * пропустит максимально нетравматично. При ошибке сжатия возвращается оригинал —
 * в этом случае серверная валидация/413 отработают как обычно.
 */
export async function compressImage(file: File): Promise<File> {
  try {
    return await imageCompression(file, {
      maxSizeMB: COMPRESSION_TARGET_MB,
      maxWidthOrHeight: COMPRESSION_MAX_DIMENSION,
      useWebWorker: true,
      initialQuality: 0.8,
    });
  } catch {
    return file;
  }
}
