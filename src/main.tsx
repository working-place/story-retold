import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import './globals.scss'
import App from './App.tsx'
import { initYandexMetrika } from './utils/yandexMetrika'

const metrikaId = Number(import.meta.env.VITE_METRIKA_ID)
if (Number.isInteger(metrikaId) && metrikaId > 0) {
  initYandexMetrika(metrikaId)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
