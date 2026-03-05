import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './modules/css/index.css'
import App from './modules/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
