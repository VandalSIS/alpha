# Project Alpha app

Private workbook + admin for Christian & Timbers.

## Flow (locked)

1. C&T finds participants and adds them in **Admin** (`/admin`)
2. System generates **invite code** and sends email (stub → console, or Resend)
3. Participant opens `/enter`, enters **code + email**
4. **Portal** opens at `/portal` (stage, next steps, docs, resources, **Learning**)
5. Workbook at `/workbook` (linked from portal / nav)
6. Learning at `/portal/learning` — modules relevant to the participant, case submit, advisor feedback, cohort + upcoming sessions
7. On submit → confirm email to participant + notify `projectalpha@christian-timbers.com`

### Admin portal tools

- Per participant (**Portal / View**): set stage, custom next steps, add personal docs (URL or PDF)
- **Shared portal resources**: links/files visible to all participants
- **Learning** (`/admin/learning`): cohorts, sessions (firesides / mock boards / peer groups), modules, case feedback

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

- Wire Resend + production Postgres
- Point Webflow landing entry form to `/enter` (or embed)
- Add module files / richer content as the programme publishes it
