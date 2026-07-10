import { useEffect, useMemo } from 'react';

/**
 * Создаёт object URL для файла и автоматически освобождает его
 * (revokeObjectURL) при размонтировании или смене файла.
 *
 * Решает проблему утечки памяти, когда `URL.createObjectURL(file)`
 * вызывается прямо в JSX при каждом рендере.
 */
export function useObjectUrl(file: File | null | undefined): string {
  const url = useMemo(() => {
    if (!file) return '';
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  return url;
}

/**
 * Возвращает object URL для каждого файла в массиве.
 * При смене списка освобождает URL'ы удалённых файлов.
 */
export function useObjectUrls(files: File[]): string[] {
  const urls = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files]
  );

  useEffect(() => {
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [urls]);

  return urls;
}
