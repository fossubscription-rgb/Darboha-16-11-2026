import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  adminCopy,
  formatAdmin,
  readAdminLang,
  writeAdminLang,
  type AdminCopy,
  type AdminLang,
} from './i18n'

type AdminLocaleValue = {
  lang: AdminLang
  dir: 'ltr' | 'rtl'
  t: AdminCopy
  setLang: (lang: AdminLang) => void
  toggleLang: () => void
  format: (template: string, vars: Record<string, string | number>) => string
}

const AdminLocaleContext = createContext<AdminLocaleValue | null>(null)

export function AdminLocaleProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<AdminLang>(readAdminLang)

  function setLang(next: AdminLang) {
    setLangState(next)
    writeAdminLang(next)
  }

  function toggleLang() {
    setLang(lang === 'en' ? 'ar' : 'en')
  }

  useEffect(() => {
    const prevLang = document.documentElement.lang
    const prevDir = document.documentElement.dir
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    return () => {
      document.documentElement.lang = prevLang || 'en'
      document.documentElement.dir = prevDir || 'ltr'
    }
  }, [lang])

  const value = useMemo<AdminLocaleValue>(
    () => ({
      lang,
      dir: lang === 'ar' ? 'rtl' : 'ltr',
      t: adminCopy[lang],
      setLang,
      toggleLang,
      format: formatAdmin,
    }),
    [lang],
  )

  return (
    <AdminLocaleContext.Provider value={value}>
      <div className="admin-root" dir={value.dir} lang={lang} data-admin-lang={lang}>
        {children}
      </div>
    </AdminLocaleContext.Provider>
  )
}

export function useAdminLocale() {
  const ctx = useContext(AdminLocaleContext)
  if (!ctx) {
    throw new Error('useAdminLocale must be used within AdminLocaleProvider')
  }
  return ctx
}

export function LangToggleButton({ className }: { className?: string }) {
  const { t, toggleLang, lang } = useAdminLocale()
  const next: AdminLang = lang === 'en' ? 'ar' : 'en'
  return (
    <button
      type="button"
      className={className ?? 'admin-lang-toggle'}
      onClick={toggleLang}
      aria-label={t.langToggleAria}
      lang={next}
    >
      {t.langToggle}
    </button>
  )
}
