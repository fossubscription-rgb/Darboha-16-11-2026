# Darboha

Bilingual marketing site for **Darboha** (دربها) — self-guided adventure guidance for travelers and hikers exploring Oman.

> Know the trail. Respect the land. · اعرف الدرب. احترم الأرض.

This repository ships the **marketing / landing site only** (EN + AR, RTL). The full trail product app and admin dashboard come later.

Project marketing plan: `/cursor/stores/self/docs/marketing-plan.md` (Darboha project Context).

## Brand (v1)

| | |
|---|---|
| Name | Darboha / دربها |
| Tagline | Know the trail. Respect the land. |
| Colors | Navy `#0A1E3D`, glacier `#7EB8C9`, white `#FFFFFF` / mist `#F4F8FB` |
| Fonts | Syne (EN display) · Figtree (EN body) · Cairo (Arabic) |

## Pages

- **Brand board (default):** `/#/branding` — wordmark, colors, type, UI samples  
- **Marketing site:** `/#/` — hero, trails, safety, how it works, waitlist  

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`) — it lands on the **brand board** first. Use **Marketing site** to open the landing page. Use **العربية / English** for language + RTL.

```bash
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Stack

- Vite + React + TypeScript
- Local landscape photos (Wikimedia Commons) under `public/images/`
- Deploy target (later): Vercel

## Scope note

Marketing site only — no admin app in this repo yet.
