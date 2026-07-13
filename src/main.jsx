import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import './i18n.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <Suspense fallback={<div className="min-h-screen bg-[#1A1A1C] flex items-center justify-center text-white">Loading...</div>}>
          <App />
        </Suspense>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
)
