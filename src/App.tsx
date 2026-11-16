import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { copy, type Lang } from './i18n'
import './App.css'

const LANG_KEY = 'darboha-lang'

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible')
          observer.unobserve(node)
        }
      },
      { threshold: 0.14 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return ref
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

function App() {
  const [lang, setLang] = useState<Lang>(readInitialLang)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const promiseRef = useReveal<HTMLElement>()
  const trailsRef = useReveal<HTMLElement>()
  const safetyRef = useReveal<HTMLElement>()
  const howRef = useReveal<HTMLElement>()
  const ctaRef = useReveal<HTMLElement>()

  const t = copy[lang]
  const nextLang: Lang = lang === 'en' ? 'ar' : 'en'

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.title =
      lang === 'ar'
        ? 'دربها — اعرف الدرب. احترم الأرض.'
        : 'Darboha — Know the trail. Respect the land.'
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

  function onWaitlist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <div className="page" data-lang={lang}>
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

        <nav className="topnav" aria-label="Primary">
          <a href="#trails">{t.nav.trails}</a>
          <a href="#safety">{t.nav.safety}</a>
          <a href="#how">{t.nav.how}</a>
          <a href="#waitlist" className="nav-cta">
            {t.nav.join}
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
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="top" aria-label="Darboha hero">
          <div className="hero-media" aria-hidden="true">
            <img
              src="/images/hero.jpg"
              alt=""
              className="hero-photo"
              width={2133}
              height={1600}
            />
            <div className="hero-wash" />
            <div className="hero-glow" />
          </div>

          <div className="hero-content">
            <p className="hero-brand-ar" lang="ar">
              {t.hero.brandAr}
            </p>
            <h1 className="hero-brand">{t.hero.brandEn}</h1>
            <p className="hero-tagline">{t.hero.tagline}</p>
            <p className="hero-lede">{t.hero.lede}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#waitlist">
                {t.hero.ctaPrimary}
              </a>
              <a className="btn btn-ghost" href="#trails">
                {t.hero.ctaSecondary}
              </a>
            </div>
          </div>
        </section>

        <section
          className="section promise reveal"
          id="promise"
          ref={promiseRef}
        >
          <div className="section-inner">
            <p className="eyebrow">{t.promise.eyebrow}</p>
            <h2>{t.promise.title}</h2>
            <p className="section-lede">{t.promise.lede}</p>
          </div>
        </section>

        <section
          className="section trails reveal"
          id="trails"
          ref={trailsRef}
        >
          <div className="section-inner trails-intro">
            <p className="eyebrow">{t.trails.eyebrow}</p>
            <h2>{t.trails.title}</h2>
            <p className="section-lede">{t.trails.lede}</p>
          </div>

          <ul className="trail-list">
            {t.trails.items.map((trail, index) => (
              <li
                key={trail.id}
                className="trail-row"
                style={{ ['--i' as string]: index }}
              >
                <figure className="trail-visual">
                  <img
                    src={trail.image}
                    alt=""
                    width={1200}
                    height={800}
                    loading="lazy"
                  />
                </figure>
                <div className="trail-copy">
                  <p className="trail-region">{trail.region}</p>
                  <h3>{trail.name}</h3>
                  <p className="trail-blurb">{trail.blurb}</p>
                  <dl className="trail-meta">
                    <div>
                      <dt>{t.trails.metaDistance}</dt>
                      <dd>{trail.distance}</dd>
                    </div>
                    <div>
                      <dt>{t.trails.metaDifficulty}</dt>
                      <dd>{trail.difficulty}</dd>
                    </div>
                    <div>
                      <dt>{t.trails.metaSeason}</dt>
                      <dd>{trail.season}</dd>
                    </div>
                  </dl>
                  <p className="trail-placeholder">{t.trails.placeholderBadge}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="section safety reveal"
          id="safety"
          ref={safetyRef}
        >
          <div className="section-inner">
            <p className="eyebrow light">{t.safety.eyebrow}</p>
            <h2>{t.safety.title}</h2>
            <p className="section-lede">{t.safety.lede}</p>
            <ul className="safety-list">
              {t.safety.items.map((item) => (
                <li key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <figure className="safety-visual">
            <img
              src="/images/trail.jpg"
              alt=""
              width={1800}
              height={1200}
              loading="lazy"
            />
          </figure>
        </section>

        <section className="section how reveal" id="how" ref={howRef}>
          <div className="how-split">
            <div>
              <p className="eyebrow">{t.how.eyebrow}</p>
              <h2>{t.how.title}</h2>
              <p className="section-lede">{t.how.lede}</p>
              <ol className="how-steps">
                {t.how.steps.map((step) => (
                  <li key={step.title}>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </li>
                ))}
              </ol>
              <p className="how-note">{t.how.note}</p>
            </div>
            <figure className="how-visual">
              <img
                src="/images/coast.jpg"
                alt=""
                width={2000}
                height={1333}
                loading="lazy"
              />
              <div className="map-tease" aria-hidden="true">
                <svg viewBox="0 0 200 140" className="map-svg">
                  <path
                    className="map-route"
                    d="M22 112 C48 96, 58 70, 78 58 S120 40, 148 28 S178 18, 188 22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="22" cy="112" r="5" fill="currentColor" />
                  <circle cx="188" cy="22" r="5" fill="currentColor" />
                </svg>
              </div>
            </figure>
          </div>
        </section>

        <section
          className="section waitlist reveal"
          id="waitlist"
          ref={ctaRef}
        >
          <div className="waitlist-panel">
            <div>
              <p className="eyebrow light">{t.waitlist.eyebrow}</p>
              <h2>{t.waitlist.title}</h2>
              <p>{t.waitlist.lede}</p>
            </div>
            {submitted ? (
              <p className="thanks" role="status">
                {t.waitlist.thanks}
              </p>
            ) : (
              <form className="waitlist-form" onSubmit={onWaitlist}>
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
                  onChange={(event) => setEmail(event.target.value)}
                />
                <button className="btn btn-primary" type="submit">
                  {t.waitlist.submit}
                </button>
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
          <div className="footer-links">
            <a href="#top">{t.footer.top}</a>
            <a href="#trails">{t.nav.trails}</a>
            <a href="#safety">{t.nav.safety}</a>
            <a href="#waitlist">{t.nav.join}</a>
          </div>
          <p className="footer-note">{t.footer.note}</p>
        </div>
      </footer>
    </div>
  )
}

export default App
