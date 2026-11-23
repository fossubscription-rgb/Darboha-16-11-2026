import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import MarketingApp from './App'
import BrandingPage from './BrandingPage'
import { ADMIN_LANG_KEY, adminCopy, type AdminLang } from './admin/i18n'
import { type Lang } from './i18n'

const AdminApp = lazy(() => import('./admin/AdminApp'))

const LANG_KEY = 'darboha-lang'

function adminLoadingLabel(): string {
  try {
    const saved = localStorage.getItem(ADMIN_LANG_KEY)
    if (saved === 'ar' || saved === 'en') {
      return adminCopy[saved as AdminLang].loadingAdmin
    }
  } catch {
    /* ignore */
  }
  return adminCopy.en.loadingAdmin
}

function readInitialLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY)
    if (saved === 'ar' || saved === 'en') return saved
  } catch {
    /* ignore */
  }
  return 'en'
}

function BrandingRoute() {
  const [lang, setLang] = useState<Lang>(readInitialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    try {
      localStorage.setItem(LANG_KEY, lang)
    } catch {
      /* ignore */
    }
  }, [lang])

  return (
    <BrandingPage
      lang={lang}
      onToggleLang={() => setLang((prev) => (prev === 'en' ? 'ar' : 'en'))}
    />
  )
}

export default function RootApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarketingApp />} />
        <Route path="/branding" element={<BrandingRoute />} />
        <Route
          path="/admin/*"
          element={
            <Suspense
              fallback={
                <div
                  style={{
                    minHeight: '100vh',
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: 'Figtree, sans-serif',
                    color: '#264653',
                  }}
                >
                  {adminLoadingLabel()}
                </div>
              }
            >
              <AdminApp />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <div style={{ padding: '2rem', fontFamily: 'Figtree, sans-serif' }}>
              <p>Not found.</p>
              <Link to="/">Back home</Link>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
