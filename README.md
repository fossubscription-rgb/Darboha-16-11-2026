# Darboha

Bilingual marketing site for **Darboha** (دربها) — self-guided adventure guidance for travelers and hikers exploring Oman — plus `/admin` wired to Supabase (password-only role gates).

> لِكُل دربٍ رواية

## Brand (2026-11-22)

| | |
|---|---|
| Name | Darboha / دربها |
| Motto (AR) | لِكُل دربٍ رواية |
| Colors | White `#FFFFFF`, Dark navy `#264653`, Turquoise `#2A9D8F`, Sky blue `#A8DADC`, Light grey `#F5F5F5`, Sand gold `#E9C46A` |
| Balance | ~70% white · ~20% teal/blue · ~10% gold |
| Fonts | Syne (EN display) · Figtree (EN body) · Cairo (Arabic) |
| Brand board | `/branding` |

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
