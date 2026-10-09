# Moshal Opportunities Portal: MVP Spec

Status: draft for sign-off, 2026-10-03

## 1. Purpose

Moshal scholars find career opportunities in one place, apply, and track their applications. Career
champions (scholars themselves) post the opportunities. The admin team uses the data to see whether
students are engaging with the system and progressing.

## 2. Roles

| Role | Who | Can |
|------|-----|-----|
| Student | Every signed-in user | Browse/search opportunities, apply, track applications, manage profile, download CV |
| Career champion | A student an admin has flagged | Everything a student can, plus create/edit/unpublish their own opportunities |
| Admin | Moshal staff | Everything, plus the engagement dashboard, reference data, roles, moderation |

One account per person. Champion is a flag on the student account, not a separate login. Only an admin
can grant or revoke champion. The first admin is seeded from configuration.

## 3. MVP scope

In:

- Sign in with Google or Microsoft. If no account exists for that identity, the user goes through a
  short create flow (name, university, faculty, degree, year of study). There is no separate
  register page.
- Student profile: personal details, education, past and current internships, optional references.
- PDF CV generated from the profile.
- Opportunities: create (champion), browse, full-text search and filter (student).
- Apply = track + redirect. Clicking Apply records an application and opens the company link.
  Students update the outcome themselves.
- Nightly link checker and expiry job.
- Admin engagement dashboard with drill-down: all → university → faculty.

Out (post-MVP):

- Email allowlist / access gate (MVP: anyone who signs in gets a student account)
- Notifications of any kind (email digests, expiry reminders)
- Multiple CV templates, shareable CV page
- In-app application submission and review

## 4. Functional requirements

### 4.1 Sign-in and onboarding

- Identity comes from OIDC (Google, Microsoft). The account key is `(provider, subject)`. Email is
  stored from the provider's verified claim.
- First sign-in → onboarding form → account created → land on Opportunities.
- Returning sign-in → straight in. `last_login_at` is updated on every sign-in.
- University and faculty are chosen from admin-managed dropdowns. Each also offers "Other" with a text
  box, so a student is never blocked. Admin can later remap "Other" entries to proper list items.

### 4.2 Student profile

- Personal: first name, surname, email (from provider), phone (optional).
- Education: university, faculty, degree name, year of study (1st, 2nd, 3rd, 4th, Honours, Masters,
  PhD), expected graduation year.
- Experience (0..n): company, role, start date, end date or "currently working here", description.
- References (0..n, optional): name, job title, company, email, phone, relationship. These are
  third-party personal details, so the student confirms they have the referee's consent before saving
  (POPIA).

### 4.3 CV

- One PDF template, generated on demand from the profile. It is not stored.
- Sections: header (name, contact), education, experience (newest first, "Present" for current roles),
  references, or "available on request" if there are none.

### 4.4 Opportunities

Fields:

| Field | Required | Notes |
|-------|----------|-------|
| Title | Yes | |
| Organisation | Yes | |
| Type | Yes | Internship, vacation work, graduate programme, bursary, learnership, part-time, other |
| Description | Yes | Plain text or light markdown |
| Link | Usually | Required for every type except where admin configures otherwise; validated as `https?://` |
| Target fields of study | Yes, 1..n | See 5.2: generic fields, not university-specific faculties |
| Location | Yes | Province (or "Anywhere in SA" / "International"), plus on-site / hybrid / remote |
| Expiry date | No | Past this date the opportunity is auto-archived |
| _Open filter_ | ? | You picked "Something else". See section 9 |

Behaviour:

- Goes live immediately on save. Admin can edit, unpublish or delete any opportunity. A champion can
  edit or unpublish only their own.
- Students can report a listing (broken, spam, wrong details). Reports land in the admin moderation
  list.
- "Wipe" on expiry means archive, never hard-delete. Applications reference the opportunity, and
  deleting it would erase engagement history.

### 4.5 Search and browse

- Free-text search over title, organisation and description.
- Filters: type, field of study, province, work mode, "closing soon". Default sort: the student's own
  field first, then newest.
- Only `active` opportunities are shown to students.

### 4.6 Applications

- Apply → create `applications` row (status `applied`) → open the link in a new tab. Applying twice to
  the same opportunity is idempotent.
- My Applications page: list with status, and the student can change the status to interview, offer,
  rejected or withdrawn.
- A student can withdraw a mistaken click. A withdrawn application stays in the history but doesn't
  count as an application.

### 4.7 Link checker and expiry (nightly background job)

- Expiry: `expires_on < today` → status `expired`.
- Link check, for every active opportunity with a link:
  - HEAD request, falling back to GET if HEAD is refused. Follow redirects, 10s timeout, a
    concurrency cap, and an identifying User-Agent.
  - Fail = 404/410, DNS failure, connection refused, TLS failure, timeout, or 5xx. Pass = 2xx/3xx.
    403/429 count as pass, because many company sites block bots and we must not hide real listings
    for that.
  - A pass resets `consecutive_failures` to 0. A fail increments it. At 3 failures the status becomes
    `hidden_dead_link`.
  - The posting champion sees a "dead link" badge on My Opportunities (in-app; no email in MVP).
    Fixing the link sets the status back to `active`.
- Each check is logged to `link_checks` so admin can see why something was hidden.

### 4.8 Admin engagement dashboard

Filters apply to every view: university → faculty (drill-down), year of study, expected graduation
year, date range.

- Headline numbers: active students, applications in period, % of students who applied in period,
  students with zero applications.
- Students table: name, university, faculty, year, total applications, applications in period, last
  application date, last login, outcomes (interviews/offers). Sortable; the default sort is fewest
  applications first.
- Segments:
  - Not applying: no application in the last N days (N set by admin, default 30).
  - Never applied: signed in at least once, zero applications ever.
  - Dormant: no login in N days.
- Opportunity view: per opportunity, the application count and the list of applicants.
- Breakdown: applications and % engaged per university, then per faculty when drilled in.
- Export the current table to CSV.

Known MVP gap: there's no allowlist, so scholars who have never signed in can't be listed. That arrives
with the allowlist.

### 4.9 Admin management

- Universities, their faculties, and the fields of study each faculty maps to.
- Users: search, promote or demote champion, promote admin.
- Moderation: reported listings, dead-link listings, "Other" university/faculty entries to remap.

## 5. Data model (PostgreSQL)

### 5.1 Tables

```text
users              id, email UNIQUE, first_name, surname, phone,
                   role (student|admin), is_champion, created_at, last_login_at
user_identities    user_id, provider (google|microsoft), subject   UNIQUE(provider, subject)

fields_of_study    id, name                          -- Engineering, Commerce, Health Sciences...
universities       id, name, is_active
faculties          id, university_id, field_of_study_id, name, is_active

student_profiles   user_id PK, university_id NULL, university_other NULL,
                   faculty_id NULL, faculty_other NULL,
                   degree, year_of_study, expected_grad_year
experiences        id, user_id, company, role, start_date, end_date NULL, description
referees           id, user_id, name, job_title, company, email, phone, relationship,
                   consent_confirmed_at

opportunities      id, title, organisation, type, description, url NULL,
                   province, work_mode, expires_on NULL,
                   status (active|expired|hidden_dead_link|unpublished),
                   consecutive_failures, last_checked_at,
                   created_by, created_at, updated_at,
                   search_vector tsvector GENERATED
opportunity_fields opportunity_id, field_of_study_id   PK(both)
opportunity_reports id, opportunity_id, reported_by, reason, created_at, resolved_at
link_checks        id, opportunity_id, checked_at, http_status NULL, ok, error NULL

applications       id, user_id, opportunity_id,
                   status (applied|interview|offer|rejected|withdrawn),
                   applied_at, status_updated_at       UNIQUE(user_id, opportunity_id)

settings           key, value                        -- e.g. inactive_days = 30
```

### 5.2 Design decisions

- **Faculty vs field of study.** Faculties are university-specific ("Faculty of EBE, UCT"), and
  opportunities can't target every one of them. Each faculty maps to a generic field of study, and
  opportunities target fields. That gives students "for your field" matching and gives admin clean
  university → faculty drill-down from the same data.
- **Champion as a flag.** A role table is unnecessary with three fixed roles.
- **Soft lifecycle on opportunities.** Status changes, never deletes, so application history survives.

### 5.3 Indexes that matter

- `opportunities`: GIN on `search_vector`; btree on `(status, created_at DESC)`; partial btree on
  `expires_on WHERE status = 'active'`.
- `opportunity_fields`: `(field_of_study_id, opportunity_id)`.
- `applications`: `(user_id, applied_at DESC)`, `(opportunity_id)`.
- `student_profiles`: `(university_id, faculty_id)`.

At the expected scale (hundreds of students, low thousands of opportunities), these keep every page
in single-digit milliseconds. The dashboard is plain `LEFT JOIN` + `GROUP BY` and needs no separate
analytics store.

## 6. Architecture

```text
Vue 3 SPA ──cookie──▶ ASP.NET Core API (BFF) ──▶ PostgreSQL
                         │  ├─ OIDC: Google, Microsoft
                         │  ├─ PDF: CV generation
                         └─ Hosted service: nightly expiry + link checker
```

- **API.** ASP.NET Core, .NET 10. Cookie session after the OIDC sign-in (BFF pattern), so no tokens
  are stored in the browser. Role checks via authorization policies (`Student`, `Champion`, `Admin`).
  Champion edit rights are also checked against `created_by`.
- **Front end.** Vue 3 + TypeScript + Vite.
- **Data access.** EF Core + migrations. Raw SQL is reserved for the search and dashboard queries if
  needed.
- **Background job.** One `BackgroundService` on a daily timer. If the API is ever scaled out, it
  needs a Postgres advisory lock so only one instance runs it.
- **PDF.** A .NET PDF library (for example QuestPDF). Check its licence terms before adopting it.
- **Secrets.** OIDC client IDs and secrets and the DB connection string go in a local `.env` (or
  `dotnet user-secrets`), gitignored, never in code.
- **Running.** Locally with Postgres in Docker Compose for the MVP. Hosting is a later decision.

## 7. Pages (for the widget design rounds)

| # | Page | Role |
|---|------|------|
| 1 | Sign-in | All |
| 2 | Onboarding (create account) | New user |
| 3 | Opportunities: browse + search | Student |
| 4 | Opportunity detail + Apply | Student |
| 5 | My Applications | Student |
| 6 | Profile: details, education, experience, references | Student |
| 7 | CV preview + download | Student |
| 8 | My Opportunities (with dead-link badges) | Champion |
| 9 | Create / edit opportunity | Champion |
| 10 | Engagement dashboard: overview + drill-down | Admin |
| 11 | Students table + segments | Admin |
| 12 | Student detail | Admin |
| 13 | Opportunity applicants | Admin |
| 14 | Moderation: reports, dead links, "Other" entries | Admin |
| 15 | Reference data + user roles | Admin |

## 8. Non-functional

- POPIA: collect only the fields above. References need consent confirmation. A student can delete
  their own account, which removes profile, experience and references and anonymises applications so
  the aggregate stats survive.
- Accessibility: keyboard-navigable, labelled form fields, adequate contrast.
- Mobile-first for student pages, since most students will use a phone. The admin pages target
  desktop.

## 9. Open questions

1. **The extra opportunity filter.** You picked "Something else" without naming it. Was it target
   year of study, a closing-date filter, paid vs unpaid, or something else?
2. **Apply semantics.** A click counts as an application, and the student can withdraw it. Is that
   accurate enough for your engagement numbers, or do you want a "Did you apply?" confirmation when
   they come back?
3. **Link required.** Should any opportunity type be allowed without a link, for example a bursary
   applied for by emailing a CV?
