import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { joinWaitlistApi } from './admin/api'
import { isSupabaseConfigured } from './lib/supabase'
import { copy, type Lang } from './i18n'
import './App.css'

const LANG_KEY = 'darboha-lang'

type DifficultyFilter = 'all' | 'easy' | 'moderate' | 'varies'
type SeasonFilter = 'all' | 'cool' | 'shoulder'

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

function matchesSeason(months: number[], filter: SeasonFilter): boolean {
  if (filter === 'all') return true
  if (filter === 'cool') {
    return months.some((m) => m === 11 || m === 12 || m === 1 || m === 2)
  }
  return months.some((m) => m === 3 || m === 4 || m === 9 || m === 10)
}

function App() {
  const [lang, setLang] = useState<Lang>(readInitialLang)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [waitlistError, setWaitlistError] = useState<string | null>(null)
  const [waitlistBusy, setWaitlistBusy] = useState(false)
  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilter>('all')
  const [seasonFilter, setSeasonFilter] = useState<SeasonFilter>('all')

  const promiseRef = useReveal<HTMLElement>()
  const trailsRef = useReveal<HTMLElement>()
  const safetyRef = useReveal<HTMLElement>()
  const howRef = useReveal<HTMLElement>()
  const teamRef = useReveal<HTMLElement>()
  const ctaRef = useReveal<HTMLElement>()

  const t = copy[lang]
  const nextLang: Lang = lang === 'en' ? 'ar' : 'en'

  const filteredTrails = useMemo(() => {
    return t.trails.items.filter((trail) => {
      const difficultyOk =
        difficultyFilter === 'all' || trail.difficultyKey === difficultyFilter
      const seasonOk = matchesSeason(trail.seasonMonths, seasonFilter)
      return difficultyOk && seasonOk
    })
  }, [t.trails.items, difficultyFilter, seasonFilter])

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
    setWaitlistError(null)
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
    <div className="page" data-lang={lang}>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>

      <header className="topbar">
        <a className="brand-mark" href="#top" aria-label="Darboha / دربها">
          <img
            className="brand-logo brand-logo--nav"
            src="/branding/darboha-logo-dark.png"
            alt=""
            width={180}
            height={212}
            decoding="async"
          />
        </a>

        <nav className="topnav" aria-label="Primary">
          <a href="#trails">{t.nav.trails}</a>
          <a href="#safety">{t.nav.safety}</a>
          <a href="#how">{t.nav.how}</a>
          <a href="#about">{t.nav.about}</a>
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
            <h1 className="hero-brand">
              <img
                className="brand-logo brand-logo--hero"
                src="/branding/darboha-logo-dark.png"
                alt="Darboha / دربها"
                width={420}
                height={494}
                decoding="async"
              />
            </h1>
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
            {t.trails.items.length > 0 ? (
              <div className="trail-filters" role="group" aria-label="Trail filters">
                <label>
                  <span>{t.trails.filterDifficulty}</span>
                  <select
                    value={difficultyFilter}
                    onChange={(e) =>
                      setDifficultyFilter(e.target.value as DifficultyFilter)
                    }
                  >
                    <option value="all">{t.trails.filterAll}</option>
                    <option value="easy">
                      {lang === 'ar' ? 'سهل' : 'Easy'}
                    </option>
                    <option value="moderate">
                      {lang === 'ar' ? 'متوسط' : 'Moderate'}
                    </option>
                    <option value="varies">
                      {lang === 'ar' ? 'متفاوت' : 'Varies'}
                    </option>
                  </select>
                </label>
                <label>
                  <span>{t.trails.filterSeason}</span>
                  <select
                    value={seasonFilter}
                    onChange={(e) =>
                      setSeasonFilter(e.target.value as SeasonFilter)
                    }
                  >
                    <option value="all">{t.trails.filterAll}</option>
                    <option value="cool">
                      {lang === 'ar' ? 'أشهر باردة' : 'Cool months'}
                    </option>
                    <option value="shoulder">
                      {lang === 'ar' ? 'موسم انتقالي' : 'Shoulder'}
                    </option>
                  </select>
                </label>
              </div>
            ) : null}
          </div>

          {t.trails.items.length === 0 ? (
            <p className="trail-empty">{t.trails.emptyCatalog}</p>
          ) : filteredTrails.length === 0 ? (
            <p className="trail-empty">{t.trails.emptyFiltered}</p>
          ) : (
            <ul className="trail-list">
              {filteredTrails.map((trail, index) => (
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
                  </div>
                </li>
              ))}
            </ul>
          )}
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

        <section className="section team reveal" id="about" ref={teamRef}>
          <div className="section-inner">
            <p className="eyebrow">{t.team.eyebrow}</p>
            <h2>{t.team.title}</h2>
            <p className="section-lede">{t.team.lede}</p>
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
                  disabled={waitlistBusy}
                />
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={waitlistBusy}
                >
                  {waitlistBusy
                    ? lang === 'ar'
                      ? 'جارٍ…'
                      : 'Joining…'
                    : t.waitlist.submit}
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
          <div className="footer-brand">
            <img
              className="brand-logo brand-logo--footer"
              src="/branding/darboha-logo-dark.png"
              alt="Darboha / دربها"
              width={140}
              height={165}
              decoding="async"
            />
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
