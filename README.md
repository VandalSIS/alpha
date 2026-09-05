# Project Alpha app

Private workbook + admin for Christian & Timbers.

## Flow (locked)

1. C&T finds participants and adds them in **Admin** (`/admin`)
2. System generates **invite code** and sends email (stub → console, or Resend)
3. Participant opens `/enter`, enters **code + email**
4. **Portal** opens at `/portal` (stage, next steps, docs, resources)
5. Workbook at `/workbook` (linked from portal / nav)
6. On submit → confirm email to participant + notify `projectalpha@christian-timbers.com`

### Admin portal tools

- Per participant (**Portal / View**): set stage, custom next steps, add personal docs (URL or PDF)
- **Shared portal resources**: links/files visible to all participants

## Setup

```bash
# Need Node 20+
cd project-alpha
cp .env.example .env   # already has defaults
npm install
npx prisma db push
npm run dev
```

Open:

- http://localhost:3000/admin — password from `.env` (`ADMIN_PASSWORD`)
- http://localhost:3000/enter — participant entry
- http://localhost:3000/workbook — after successful code

## Email

Without `RESEND_API_KEY`, invite/confirm/notify emails are **printed in the terminal**.

## Next

- Port full 10-step workbook from `CT_project-alpha_workbook.html`
- Wire Resend + production Postgres
- Deploy subdomain (e.g. `workbook.christianandtimbers.com`)
- Participant portal at `/portal` (stage, next steps, docs, resources)
- Point Webflow landing entry form to `/enter` (or embed)
