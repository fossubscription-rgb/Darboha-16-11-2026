# Darboha

Bilingual marketing site for **Darboha** (دربها) — self-guided adventure guidance for travelers and hikers exploring Oman — plus a **draft `/admin` UI** (mock data / localStorage only; no Supabase yet).

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
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

- Marketing: `/`
- Admin draft: `/admin`

```bash
npm run build && npm run preview
```

## Admin draft (placeholder)

Password-only gate. Each password opens a role module. Data is **hardcoded seed + localStorage** — not Supabase.

| Role | Demo password | Lands at |
|------|---------------|----------|
| CEO | `darboha-ceo` | `/admin/ceo` |
| Data Analyst 1 | `darboha-da1` | `/admin/da` |
| Data Analyst 2 | `darboha-da2` | `/admin/da` |
| Health & Safety | `darboha-safety` | `/admin/safety` |
| CFO / VP | `darboha-cfo` | `/admin/cfo` |

Use **Reset demo data** in the sidebar to restore seed content.

Static clickable mock (Context store): `/cursor/stores/self/media/admin-draft/admin-preview.html`

## Stack

- Vite + React + TypeScript + React Router
- Admin lazy-loaded at `/admin/*`
- Deploy target (later): Vercel + Supabase

## Scope note

Built for Oman Wijhati schools 2026/2027 — field: سياحة المغامرات والابتكار البيئي. Student company (Grade 9, 7 members). Admin is a **UI draft for click-through** — real auth/DB tomorrow.
