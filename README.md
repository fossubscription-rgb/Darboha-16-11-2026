# Darboha

Bilingual marketing site for **Darboha** (دربها) — self-guided adventure guidance for travelers and hikers exploring Oman — plus `/admin` wired to Supabase (password-only role gates).

> Know the trail. Respect the land. · اعرف الدرب. احترم الأرض.

## Brand (v1)

| | |
|---|---|
| Name | Darboha / دربها |
| Tagline | Know the trail. Respect the land. |
| Colors | Navy `#0A1E3D`, Glacier `#7EB8C9`, Glacier light `#9FCFDD`, mist `#F4F8FB` |
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

CEO sets teammate passwords in `/admin/ceo` (Team & access). Demo passwords are not published — ask the CEO.

Env vars (local): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.  
Map pickers (clinic + amenities) use free Leaflet + OpenStreetMap/Nominatim — no Google key.

## Stack

- Vite + React + TypeScript + React Router
- Supabase (Postgres + RLS + password-gate RPCs)
- Deploy target (later): Vercel + Supabase

## Scope note

Built for Oman Wijhati schools 2026/2027 — field: سياحة المغامرات والابتكار البيئي. Student company (Grade 9, 7 members).
