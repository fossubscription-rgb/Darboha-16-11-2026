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
| Colors | Canyon ink `#0C1F1A`, oasis teal `#1F8A7A`, sunlit sand `#E6C989`, mist `#E7F0EA` |
| Fonts | Syne (EN display) · Figtree (EN body) · Cairo (Arabic) |

## Site sections

1. Brand hero — self-guided map promise  
2. Promise / audience  
3. Curated featured trails (6 placeholders)  
4. Safety & eco guidance  
5. How it works (map-guided hiking tease)  
6. About / team  
7. Waitlist CTA  

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Use the **العربية / English** control in the header for language + RTL.

```bash
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Stack

- Vite + React + TypeScript
- Local landscape photos (Wikimedia Commons) under `public/images/`
- Deploy target (later): Vercel

## Scope note

Built for Oman Wijhati schools 2026/2027 — field: سياحة المغامرات والابتكار البيئي. Student company (Grade 9, 7 members). Marketing site only — no admin app in this repo yet.
