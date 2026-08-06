# Project Alpha app

Private workbook + admin for Christian & Timbers.

## Flow (locked)

1. C&T finds participants and adds them in **Admin** (`/admin`)
2. System generates **invite code** and sends email (stub → console, or Resend)
3. Participant opens `/enter`, enters **code + email**
4. Workbook opens at `/workbook` (session cookie, 30 days)
5. On submit → confirm email to participant + notify `projectalpha@christian-timbers.com`

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
- Point Webflow landing entry form to `/enter` (or embed)
