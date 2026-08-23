import { useEffect, useMemo } from 'react';

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

export function useObjectUrls(files: File[]): string[] {
  const validFiles = files.filter(file => file instanceof File);

  const urls = useMemo(() => {
    return validFiles.map((file) => URL.createObjectURL(file));
  }, [validFiles]);

  useEffect(() => {
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [urls]);

  return urls;
}
