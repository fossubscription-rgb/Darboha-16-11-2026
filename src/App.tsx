import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { joinWaitlistApi } from './admin/api'
import { isSupabaseConfigured } from './lib/supabase'
import { copy, type Lang } from './i18n'
import './App.css'

const LANG_KEY = 'darboha-lang'

function readInitialLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY)
    if (saved === 'ar' || saved === 'en') return saved
  } catch {
    /* ignore */
  }
  return 'en'
}

function App() {
  const [lang, setLang] = useState<Lang>(readInitialLang)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [waitlistError, setWaitlistError] = useState<string | null>(null)
  const [waitlistBusy, setWaitlistBusy] = useState(false)

  const t = copy[lang]
  const nextLang: Lang = lang === 'en' ? 'ar' : 'en'

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.title =
      lang === 'ar'
        ? 'دربها — قريباً'
        : 'Darboha — Coming soon'
    try {
      localStorage.setItem(LANG_KEY, lang)
    } catch {
      /* ignore */
    }
  }, [lang])

  function toggleLang() {
    setLang(nextLang)
    setSubmitted(false)
  }

  async function onWaitlist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim() || waitlistBusy) return
    setWaitlistError(null)
    if (!isSupabaseConfigured()) {
      setWaitlistError(
        lang === 'ar'
          ? 'الإعداد غير مكتمل — جرّب لاحقاً.'
          : 'Waitlist is not configured yet.',
      )
      return
    }
    setWaitlistBusy(true)
    try {
      await joinWaitlistApi(email)
      setSubmitted(true)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not join waitlist'
      if (/duplicate|unique/i.test(message)) {
        setSubmitted(true)
      } else {
        setWaitlistError(
          lang === 'ar' ? 'تعذّر التسجيل. حاول مرة أخرى.' : message,
        )
      }
    } finally {
      setWaitlistBusy(false)
    }
  }

  return (
    <div className="page coming-soon" data-lang={lang}>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>

      <header className="topbar">
        <a className="brand-mark" href="#top" aria-label="Darboha / دربها">
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <path
              className="path-stroke"
              d="M8 34c7-15 12-22 19-26 2 9 5 15 13 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="27" cy="8" r="2.4" fill="currentColor" />
          </svg>
          <span className="brand-en">Darboha</span>
          <span className="brand-sep" aria-hidden="true">
            /
          </span>
          <span className="brand-ar" lang="ar">
            دربها
          </span>
        </a>

        <button
          type="button"
          className="lang-toggle"
          onClick={toggleLang}
          aria-label={t.langToggleAria}
          lang={nextLang}
        >
          {t.langToggle}
        </button>
      </header>

      <main id="main">
        <section className="hero" id="top" aria-label="Darboha coming soon">
          <div className="hero-media" aria-hidden="true">
            <img
              src="/images/hero.jpg"
              alt=""
              className="hero-photo"
              width={2133}
              height={1600}
            />
            <div className="hero-wash" />
          </div>

          <div className="hero-content">
            <p className="hero-brand-ar" lang="ar">
              {t.hero.brandAr}
            </p>
            <h1 className="hero-brand">{t.hero.brandEn}</h1>
            <p className="hero-status">{t.hero.status}</p>
            <p className="hero-lede">{t.hero.lede}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#waitlist">
                {t.hero.cta}
              </a>
            </div>
          </div>
        </section>

        <section className="section note" id="note">
          <div className="section-inner">
            <h2>{t.note.title}</h2>
            <p className="section-lede">{t.note.body}</p>
          </div>
        </section>

        <section className="section waitlist" id="waitlist">
          <div className="waitlist-panel">
            <div>
              <h2>{t.waitlist.title}</h2>
              <p>{t.waitlist.lede}</p>
            </div>
            {submitted ? (
              <p className="thanks" role="status">
                {t.waitlist.thanks}
              </p>
            ) : (
              <form
                className="waitlist-form"
                onSubmit={(e) => void onWaitlist(e)}
              >
                <label className="sr-only" htmlFor="email">
                  {t.waitlist.emailLabel}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={t.waitlist.placeholder}
                  value={email}
                  disabled={waitlistBusy}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setWaitlistError(null)
                  }}
                />
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={waitlistBusy}
                >
                  {t.waitlist.submit}
                </button>
                {waitlistError && (
                  <p className="waitlist-error" role="alert">
                    {waitlistError}
                  </p>
                )}
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div>
            <strong>Darboha</strong>
            <span lang="ar"> · دربها</span>
            <p>{t.footer.tagline}</p>
          </div>
          <p className="footer-note">{t.footer.note}</p>
        </div>
      </footer>
    </div>
  )
}

export default App
