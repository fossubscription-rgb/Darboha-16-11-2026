import './BrandingPage.css'

type BrandingPageProps = {
  lang: 'en' | 'ar'
  onToggleLang: () => void
}

const colors = [
  { name: 'White', hex: '#FFFFFF', varName: '--white', on: '#264653', role: 'Main background' },
  { name: 'Dark navy', hex: '#264653', varName: '--navy', on: '#FFFFFF', role: 'Headings' },
  { name: 'Turquoise', hex: '#2A9D8F', varName: '--turquoise', on: '#FFFFFF', role: 'Buttons' },
  { name: 'Sky blue', hex: '#A8DADC', varName: '--sky', on: '#264653', role: 'Secondary sections' },
  { name: 'Light grey', hex: '#F5F5F5', varName: '--grey', on: '#264653', role: 'Search boxes' },
  { name: 'Sand gold', hex: '#E9C46A', varName: '--sand', on: '#264653', role: 'Small highlights' },
]

export default function BrandingPage({ lang, onToggleLang }: BrandingPageProps) {
  const isAr = lang === 'ar'

  return (
    <div className="branding-page" data-lang={lang}>
      <header className="branding-bar">
        <a className="branding-mark" href="/branding">
          <img
            className="branding-logo"
            src="/branding/darboha-logo-light.png"
            alt=""
            width={48}
            height={56}
            decoding="async"
          />
          <span>Darboha / دربها</span>
        </a>
        <div className="branding-bar-actions">
          <button type="button" className="branding-lang" onClick={onToggleLang}>
            {isAr ? 'English' : 'العربية'}
          </button>
          <a className="branding-to-site" href="/">
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
          <p className="branding-tagline" lang="ar">
            لِكُل دربٍ رواية
          </p>
          <p className="branding-note">
            {isAr
              ? 'لوحة الألوان المعتمدة · أبيض ٧٠٪ · تركواز/أزرق ٢٠٪ · ذهبي ١٠٪.'
              : 'Locked palette · ~70% white · ~20% teal/blue · ~10% sand gold.'}
          </p>
        </section>

        <section className="branding-section">
          <h2>{isAr ? 'الألوان' : 'Colors'}</h2>
          <p className="branding-lede">
            {isAr
              ? 'استبدال Glacier / Navy — لوحة العمل الحالية للموقع التسويقي.'
              : 'Replaces Glacier / Navy — working palette for the marketing site.'}
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
                  <span className="swatch-role">{c.role}</span>
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
              <p className="type-label">Cairo · Arabic motto</p>
              <p className="type-arabic" lang="ar">
                لِكُل دربٍ رواية
              </p>
            </article>
          </div>
        </section>

        <section className="branding-section">
          <h2>{isAr ? 'أزرار وعناصر' : 'UI samples'}</h2>
          <div className="ui-samples">
            <a className="btn btn-primary" href="/#waitlist">
              {isAr ? 'انضم للقائمة' : 'Join waitlist'}
            </a>
            <a className="btn btn-ghost-brand" href="/#trails">
              {isAr ? 'استكشف المسارات' : 'Explore trails'}
            </a>
            <span className="chip-sample">Highlight</span>
            <label className="search-sample">
              <span>{isAr ? 'بحث' : 'Search'}</span>
              <input type="search" placeholder={isAr ? 'ابحث…' : 'Search trails…'} readOnly />
            </label>
          </div>
        </section>

        <section className="branding-section branding-on-ink">
          <h2>{isAr ? 'على خلفية داكنة' : 'On dark'}</h2>
          <p className="branding-tagline light" lang="ar">
            لِكُل دربٍ رواية
          </p>
          <div className="ui-samples">
            <span className="btn btn-primary">
              {isAr ? 'انضم للقائمة' : 'Join waitlist'}
            </span>
            <span className="btn btn-ghost">
              {isAr ? 'استكشف المسارات' : 'Explore trails'}
            </span>
            <span className="chip-sample chip-sample--light">Sand gold</span>
          </div>
        </section>
      </main>
    </div>
  )
}
