/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  /** Номер счётчика Яндекс Метрики; пустое значение — счётчик не подключается */
  readonly VITE_METRIKA_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
