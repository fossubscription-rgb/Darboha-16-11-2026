# Darboha

Bilingual marketing site for **Darboha** (دربها) — self-guided adventure guidance for travelers and hikers exploring Oman — plus `/admin` wired to Supabase (password-only role gates).

> Know the trail. Respect the land. · اعرف الدرب. احترم الأرض.

## Brand (v1)

| | |
|---|---|
| Name | Darboha / دربها |
| Tagline | Know the trail. Respect the land. |
| Colors | Canyon ink `#0C1F1A`, oasis teal `#1F8A7A`, sunlit sand `#E6C989`, mist `#E7F0EA` |
| Fonts | Syne (EN display) · Figtree (EN body) · Cairo (Arabic) |

## Run locally

```bash
cp .env.example .env.local
# set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (names only in example)
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

- Marketing: `/` (waitlist → Supabase `waitlist`)
- Admin: `/admin`

```bash
npm run build && npm run preview
```

## Admin (Supabase)

Password-only gate. Each password opens a role module. Session token is bound to that role (URL swap cannot skip auth).

| Role | Demo password | Lands at |
|------|---------------|----------|
| CEO | `darboha-ceo` | `/admin/ceo` |
| Data Analyst 1 | `darboha-da1` | `/admin/da` |
| Data Analyst 2 | `darboha-da2` | `/admin/da` |
| Health & Safety | `darboha-safety` | `/admin/safety` |
| CFO / VP | `darboha-cfo` | `/admin/cfo` |

Env vars (local): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.  
Map pickers (clinic + amenities) use free Leaflet + OpenStreetMap/Nominatim — no Google key.

## Stack

- Vite + React + TypeScript + React Router
- Supabase (Postgres + RLS + password-gate RPCs)
- Deploy target (later): Vercel + Supabase

## Scope note

Built for Oman Wijhati schools 2026/2027 — field: سياحة المغامرات والابتكار البيئي. Student company (Grade 9, 7 members).
