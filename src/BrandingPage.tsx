import './BrandingPage.css'

type BrandingPageProps = {
  lang: 'en' | 'ar'
  onToggleLang: () => void
}

const colors = [
  { name: 'Canyon ink', hex: '#0C1F1A', varName: '--ink', on: '#E7F0EA' },
  { name: 'Oasis teal', hex: '#1F8A7A', varName: '--teal', on: '#FFFFFF' },
  { name: 'Sunlit sand', hex: '#E6C989', varName: '--sand', on: '#0C1F1A' },
  { name: 'Mist', hex: '#E7F0EA', varName: '--mist', on: '#0C1F1A' },
  { name: 'Stone', hex: '#6E7A72', varName: '--stone', on: '#FFFFFF' },
  { name: 'Foam', hex: '#F5FAF7', varName: '--foam', on: '#0C1F1A' },
]

export default function BrandingPage({ lang, onToggleLang }: BrandingPageProps) {
  const isAr = lang === 'ar'

  return (
    <div className="branding-page" data-lang={lang}>
      <header className="branding-bar">
        <a className="branding-mark" href="#/branding">
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <path
              d="M8 34c7-15 12-22 19-26 2 9 5 15 13 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="27" cy="8" r="2.4" fill="currentColor" />
          </svg>
          <span>Darboha / دربها</span>
        </a>
        <div className="branding-bar-actions">
          <button type="button" className="branding-lang" onClick={onToggleLang}>
            {isAr ? 'English' : 'العربية'}
          </button>
          <a className="branding-to-site" href="#/">
            {isAr ? 'الموقع التسويقي' : 'Marketing site'}
          </a>
        </div>
      </header>

      <main className="branding-main">
        <section className="branding-hero">
          <p className="branding-eyebrow">
            {isAr ? 'لوحة الهوية' : 'Brand board'}
          </p>
          <h1 lang="ar" className="branding-wordmark-ar">
            دربها
          </h1>
          <p className="branding-wordmark-en">Darboha</p>
          <p className="branding-tagline">
            {isAr ? 'اعرف الدرب. احترم الأرض.' : 'Know the trail. Respect the land.'}
          </p>
          <p className="branding-note">
            {isAr
              ? 'شعار الكلمة فقط حالياً — الشعار الرسمي لاحقاً من فريق التواصل.'
              : 'Wordmark only for now — final logo mark coming later from social.'}
          </p>
        </section>

        <section className="branding-section">
          <h2>{isAr ? 'الألوان' : 'Colors'}</h2>
          <p className="branding-lede">
            {isAr
              ? 'لوحة العمل الحالية للموقع التسويقي.'
              : 'Current working palette for the marketing site.'}
          </p>
          <ul className="swatch-grid">
            {colors.map((c) => (
              <li key={c.hex} className="swatch">
                <div
                  className="swatch-chip"
                  style={{ background: c.hex, color: c.on }}
                >
                  <span>{c.hex}</span>
                </div>
                <div className="swatch-meta">
                  <strong>{c.name}</strong>
                  <code>{c.varName}</code>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="branding-section">
          <h2>{isAr ? 'الخطوط' : 'Typography'}</h2>
          <div className="type-samples">
            <article>
              <p className="type-label">Syne · display (EN)</p>
              <p className="type-display">Know the trail.</p>
            </article>
            <article>
              <p className="type-label">Figtree · body (EN)</p>
              <p className="type-body">
                Self-guided travel for Oman’s wild places — clearer routes,
                safer habits, gentler footprints.
              </p>
            </article>
            <article>
              <p className="type-label">Cairo · Arabic</p>
              <p className="type-arabic" lang="ar">
                اعرف الدرب. احترم الأرض.
              </p>
            </article>
          </div>
        </section>

        <section className="branding-section">
          <h2>{isAr ? 'أزرار وعناصر' : 'UI samples'}</h2>
          <div className="ui-samples">
            <a className="btn btn-primary" href="#/">
              {isAr ? 'انضم للقائمة' : 'Join waitlist'}
            </a>
            <a className="btn btn-ghost-brand" href="#/">
              {isAr ? 'استكشف المسارات' : 'Explore trails'}
            </a>
            <span className="chip-sample">Placeholder content</span>
          </div>
        </section>

        <section className="branding-section branding-on-ink">
          <h2>{isAr ? 'على خلفية داكنة' : 'On dark'}</h2>
          <p className="branding-tagline light">
            {isAr ? 'اعرف الدرب. احترم الأرض.' : 'Know the trail. Respect the land.'}
          </p>
          <div className="ui-samples">
            <span className="btn btn-primary">
              {isAr ? 'انضم للقائمة' : 'Join waitlist'}
            </span>
            <span className="btn btn-ghost">
              {isAr ? 'استكشف المسارات' : 'Explore trails'}
            </span>
          </div>
        </section>
      </main>
    </div>
  )
}
