import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

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
      { threshold: 0.18 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return ref
}

function App() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const promiseRef = useReveal<HTMLElement>()
  const pillarsRef = useReveal<HTMLElement>()
  const comingRef = useReveal<HTMLElement>()
  const teamRef = useReveal<HTMLElement>()
  const ctaRef = useReveal<HTMLElement>()

  function onWaitlist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim()) return
    setSubmitted(true)
  }

  return (
    <div className="page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="topbar">
        <a className="brand-mark" href="#top" aria-label="Darboha home">
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
          <span>Darboha</span>
        </a>
        <nav className="topnav" aria-label="Primary">
          <a href="#promise">Promise</a>
          <a href="#pillars">Safety &amp; land</a>
          <a href="#coming">Coming</a>
          <a href="#waitlist" className="nav-cta">
            Early list
          </a>
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
            <p className="hero-welcome" lang="ar">
              مرحباً بكم في دربها
            </p>
            <h1 className="hero-brand">Darboha</h1>
            <p className="hero-tagline">Know the trail. Respect the land.</p>
            <p className="hero-lede">
              Adventure guidance for foreigners, travelers, and hikers exploring
              Oman — clearer routes, safer habits, gentler footprints.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#waitlist">
                Join the early list
              </a>
              <a className="btn btn-ghost" href="#promise">
                See the idea
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
            <p className="eyebrow">Why Darboha</p>
            <h2>Oman’s wild is generous — if you arrive prepared.</h2>
            <p className="section-lede">
              Too many trips begin with beautiful photos and end with guesswork:
              which path, which season, what to pack, when to turn back. Darboha
              is being built as a web companion that turns curiosity into a
              clearer plan.
            </p>
          </div>
        </section>

        <section
          className="section pillars reveal"
          id="pillars"
          ref={pillarsRef}
        >
          <div className="section-inner pillars-grid">
            <article>
              <h3>Trail clarity</h3>
              <p>
                Discover outdoor routes with plain-language difficulty, season
                notes, and what the day actually asks of you.
              </p>
            </article>
            <article>
              <h3>Safety as a feature</h3>
              <p>
                Heat, water, footwear, weather windows, and turn-back sense —
                guided by a dedicated health &amp; safety role on our team.
              </p>
            </article>
            <article>
              <h3>Leave the land whole</h3>
              <p>
                Eco habits baked into the experience: pack-out tips, fragile
                places, and respect for wadis, mountains, and wildlife.
              </p>
            </article>
          </div>
          <figure className="pillars-visual">
            <img
              src="/images/trail.jpg"
              alt="Ridges of Jebel Shams in Oman under open sky"
              width={1800}
              height={1200}
            />
            <figcaption>Jebel Shams — high ground, clear horizons.</figcaption>
          </figure>
        </section>

        <section className="section coming reveal" id="coming" ref={comingRef}>
          <div className="coming-split">
            <div>
              <p className="eyebrow">Prototype path</p>
              <h2>Marketing first. Product next.</h2>
              <p className="section-lede">
                This site is our public trailhead. The adventure app — maps,
                structured trail guidance, and practical prep — comes after we
                lock brand, audience, and safety tone.
              </p>
              <ul className="coming-list">
                <li>Web app first, ready to grow</li>
                <li>Built for Oman Wijhati: adventure tourism &amp; eco innovation</li>
                <li>Student-owned idea, prototype, and story</li>
              </ul>
            </div>
            <figure className="coming-visual">
              <img
                src="/images/coast.jpg"
                alt="Oman’s east coast cliffs meeting the sea"
                width={2000}
                height={1333}
              />
            </figure>
          </div>
        </section>

        <section className="section team reveal" id="team" ref={teamRef}>
          <div className="section-inner">
            <p className="eyebrow">Company of seven</p>
            <h2>A Grade 9 team building in public.</h2>
            <p className="section-lede">
              Darboha is a student company for Oman Wijhati 2026/2027 — field:
              سياحة المغامرات والابتكار البيئي.
            </p>
            <ul className="role-row">
              <li>CEO / Developer</li>
              <li>Data analysts ×2</li>
              <li>CFO / VP</li>
              <li>Social media ×2</li>
              <li>Health &amp; safety</li>
            </ul>
          </div>
        </section>

        <section
          className="section waitlist reveal"
          id="waitlist"
          ref={ctaRef}
        >
          <div className="waitlist-panel">
            <div>
              <p className="eyebrow light">Stay close</p>
              <h2>Be first when the trail guide opens.</h2>
              <p>
                Leave an email for prototype updates — or follow along as we
                share safety tips, eco notes, and build progress.
              </p>
            </div>
            {submitted ? (
              <p className="thanks" role="status">
                Thanks — you’re on the early list. We’ll be in touch as Darboha
                grows.
              </p>
            ) : (
              <form className="waitlist-form" onSubmit={onWaitlist}>
                <label className="sr-only" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <button className="btn btn-primary" type="submit">
                  Join early list
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
            <p>Know the trail. Respect the land.</p>
          </div>
          <div className="footer-links">
            <a href="#top">Top</a>
            <a href="#promise">Promise</a>
            <a href="#waitlist">Early list</a>
          </div>
          <p className="footer-note">
            Photos: Wikimedia Commons (Hajar Mountains / Nizwa area, Jebel
            Shams, Oman east coast). Marketing site only — adventure product app
            coming later.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
