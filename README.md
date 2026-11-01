# Moshal Careers Hub prototype

The clickable prototype of the Moshal Careers Hub: a careers portal for the Moshal Scholarship
Program in South Africa, with screens for scholars, career champions and the programme team. It is
design material, not shipped code: plain HTML, CSS and JavaScript with example data, no build step.

Open `index.html` in a browser, or run `node serve.js` and visit <http://localhost:4321>. It opens on a
prefilled sign-in; the account menu top right switches between all five people, for demos.

| File | What it is |
|------|------------|
| `index.html` | The whole prototype: every screen, the Reporting view and the example data |
| `sidebar.js` | The navigation panel as a standalone web component |
| `brand/` | The Moshal Program logos, and the two open-licence fonts the resource editor offers |
| `REPORTING.md` | The Reporting vocabulary, how that screen reads, and the export |
| `SPEC.md` | The MVP specification the prototype was built against |

Narkiss Block, the brand typeface, is a commercial font and is not redistributed here. The page
declares it first in its font stack and falls back to the system sans-serif, so layouts hold but
type will differ from the branded original.

## Personas

Sign in with any of these; the prototype does not check the password.

| Email | Role | Lands on |
|-------|------|----------|
| `cassidy.rinquest@myuct.ac.za` | Scholar | Home, with the announcement board |
| `mickey.mpofu@wits.ac.za` | Career champion | Home; new listings wait for approval |
| `lisa.mtshali@karooanalytics.co.za` | Partner recruiter | Home; listings wait, events and resources go live |
| `sipho.dlamini@uj.ac.za` | Exco | Overview: approvals, flagged listings, job listings, announcements, content |
| `leah.isaacs@moshal.org` | Admin | Overview, plus users and roles, the listings and scholar reports, and the activity log |

For demos, the account menu (the avatar, top right) also lists all five people under "Switch
profile", marked Demo only. Switching lands each person where signing in would. The real hub has
no switcher.

## My profile

"My profile" in the account menu shows the person's avatar, name, role line and email. It also
lists what the hub keeps and states what it never asks for: ID number, phone, address, date of
birth, gender or race.

| Field | Who sets it | Why it is kept |
|-------|-------------|----------------|
| First name, surname | The person | Shown to the programme team and on listings |
| Email | Invitation; read-only | Sign-in |
| University (or organisation) | Invitation; read-only | Scope in the reports |
| Faculty, degree | Scholar | Matching opportunities; the reports |
| Year of study | Scholar | Who a listing is for; the reports |
| Expected graduation year | Scholar | Final years in the Scholar report |

Staff, champions and recruiters see only name, email and organisation.

The prototype's today is 9 October 2026, so closing dates, the 7-day highlight and expiry line up
with the example data.

## My applications

Scholars apply on the employer's site, so the hub never holds an application they could withdraw.
"Apply on employer website" adds the opportunity to My applications as **In progress**. From
there the scholar moves it through Applied, Interview, Offer and Not successful.

Choosing **Offer** opens a step that cannot be closed: the scholar has to record the offer in
Salesforce, the programme's system of record. Escape, clicking outside and moving to another page
all leave it open, and it reappears after the next sign-in until it is done. "I have updated
Salesforce" unlocks only after "Open Salesforce" has opened the link in a new tab. "I chose Offer by
mistake" sets the stage back. The address is `SALESFORCE_URL` in `index.html`, currently a
placeholder until the programme supplies the real one.

## Monthly activity report

"Monthly report" sits in the Scholar report header and exports one month as a CSV that opens in
Excel. The current month runs up to today. It covers every scholar, whatever the page's filters
are, with one row per scholar or one row per university. The columns are: signed in, status that
month (Applied, Stopped applying or Never applied), applications, interviews and offers. A scholar
who applied in the month counts as signed in.

## Video in resources

A resource can carry an uploaded video (MP4, WebM or MOV, up to 500 MB) instead of a link, and the
article editor can upload a video into the body. The resource page plays it in place. The
prototype keeps uploads in the browser for the session only; the real hub stores them with its
other files.

## Admin and Exco console

The console opens on what needs a decision: listings awaiting approval, flagged listings, possible
duplicates (same link once tracking parameters are stripped, or same title and employer) and
expired listings still stored. Numbers come second. Colour follows the rest of the prototype:
structure is blue, and red, amber and green mark state only, so a red figure always means
something is wrong and amber always means time is short.

## Reporting vocabulary

The admin's job is to find the scholars who need a call. Every status below is defined so that a
scholar is in exactly one of them, which means the tiles always add up and nobody is counted twice.

### Applications report

Statuses are relative to the chosen period (last 30 days, last 90 days, this year).

| Status | Meaning | Row text | What to do |
|--------|---------|----------|------------|
| Applied | Applied to at least one opportunity in the period | "Applied · 3d ago" | Nothing; they are engaged |
| Did not apply · lapsed | Applied before, but not in this period | "Did not apply · lapsed, last applied 54d ago" | A nudge with matching listings usually brings them back |
| Did not apply · never started | Never applied through the portal | "Did not apply · never started" | A conversation, not a nudge |

On screen there are two buckets, **Applied** and **Did not apply**. Lapsed and never started are the
detail inside Did not apply: the tile says "570 · 65%" with "41 lapsed · 13 never started" under it,
each row says which it is, and the export offers Did not apply, lapsed only and never started as
separate choices. Two buckets keep the headline readable; the split is there when the admin needs
to decide between a nudge and a call.

Words we deliberately avoid: *Not applying* (a judgement, and it overlapped with Never applied),
*Inactive* (a scholar can be reading listings every day without applying), *Dormant* (sounds like
an account state).

### Offers report

| Status | Meaning |
|--------|---------|
| Has an offer | Holds at least one offer now; "more than one" is a link under the tile |
| No offer | No offer yet; "also did not apply" is the link under the tile |

Has an offer + No offer = every scholar in scope. An offer is a held state, so the Offers report
draws no previous-period comparison.

### Final years

One rule everywhere: a final year is a scholar whose expected graduation year is this year
(`grad === 2026`), stated on the panel as "4th year and Honours graduating 2026". The year labels
are not used for this, because repeats and extended programmes make them disagree with graduation.
Final years split into three exclusive groups: **Has an offer**, **Applied, no offer yet**, and
**No offer, did not apply**. The last one is the danger list and the only thing on the page drawn
in amber.

## Reports

The admin's Insights section has four reports. Each one has the same filter row: period (or
month), field of study and university, plus who posted where that applies. Each has a CSV export.
The history behind them is generated example data with its own seed.

| Report | What it answers |
|--------|-----------------|
| Programme dashboard | One month against the targets (listings posted, active scholars, champions posting every week). Month-on-month bars, active scholars weekly or monthly, and a table by region and university. The Targets button sets the numbers the brief left blank. A switch emails the summary to the Careers team on the 1st |
| Listings report | Listings posted each week or month, split by field, type, location or employer. Fields with few listings, and what is live, closing or expired today. Views, saves and clicks by field and university. Most viewed and most saved. Each champion's week against the target, the approval, rejection and duplicate rates, and who has not posted in 7, 14 or 30 days |
| Content report | Views and downloads per resource and category, with the least used named. Views, link clicks and calendar adds for each announcement and category |
| Scholar report | Who applied, who has offers, and which final years need a call |

Named scholars appear only in the Scholar report, and only after "Show names" or picking a group.
Everything else shows totals.

Regions group the universities: Western Cape (UCT, Stellenbosch), Gauteng (Wits, UP, UJ) and
KwaZulu-Natal (UKZN). The Careers team may define regions differently.

## How the Scholar report is meant to be read

The page is a dashboard for someone who is not an analyst: plain bars only, one short line under
each title that answers it ("Most not applying: University of KwaZulu-Natal (70%)"), and no other
text. Every bar, chip and figure is a button that lists the scholars behind it in the names table
at the bottom. Charts grow in when the page opens or what they show changes, and stay still when
only the names selection changes; reduced-motion users get no animation.

1. **Filters**: period, Institution, Faculty, Year of study, Final years, and a "Charts show
   Applying / Offers" switch for the university, field and year charts.
2. **Four tiles**: Applying, Offers, Final years to call (the one amber tile) and Looking, not
   applying (signed in but did not apply). The chips under each pick who the names table shows:
   Applied, Not applying, Stopped (applied before, not this period), Never applied, Has an offer,
   More than one, No offer.
3. **Scholars applying each week** (each month for This year), with the average dashed.
4. **From signing in to an offer**: Signed in, Applied, Interview, Offer, with the biggest drop named.
5. **By university** (click to go down to faculty, then year) and **By field of study**.
6. **Final years, graduating this year**: one bar split into Has an offer, Applied and waiting,
   and Needs a call, then the number to call at each university.
7. **By year of study**.
8. **Names**: the scholars in the current selection, quietest first, sortable, exportable.

Every chart has a table view. Export sits in the page header and on the names table.

## Export

Export opens prefilled with whatever the page is showing: the question becomes the Applied and
Offer settings, and the institution, faculty, year and Final years picks carry over. Inside, the
answers combine freely: Applied (Any / Applied / Did not apply), Offer (Any / Has an offer / No
offer) and Final years are independent, so "no offer, did not apply, final years, UCT, Science" is
five picks and one count. Institution, Faculty and Year of study are the same multi-select
dropdowns as the page. The file name spells out the picks, and the Export button carries the
count so nobody exports an empty file. Applied and Offer are segmented controls rather than
dropdowns because each has three values and all three should be visible at once.

Every chart panel has a table-view toggle (its WCAG twin) and an Export icon.

### Export

Export never downloads on the first click. The chooser shows the scope sentence, then asks what
to export (summary rows at this level, or the scholars behind them), which scholars (the statuses
above plus the three final-years groups), which years of study, and which columns. The button says
how many rows or scholars it will produce and the footer shows the filename, which names the group,
institution, faculty and period. The same chooser opens from the page header, every panel and the
names list; each one presets it to what that panel shows.

### Chart palette

Blue `#2362B4` is the measured bucket (light blue `#9DBDE8` for earlier weeks and for applied
final years still waiting), slate `#7D8B9A` is the remainder, and Alumni amber `#EBB22A` marks one
idea only: final years who need a call. Green and red do not appear on this screen. There is no
heatmap: a bar per year of study answers the same question and needs no legend.

### No map

Every question on the screen is "which institution" or "which faculty": a six-item named list that
the ranked rows answer with the count and share printed beside the name. Wits and UJ are a few
kilometres apart and UCT and Stellenbosch within 50 km, so at national scale three of the six
markers would collide exactly where the scholars are densest, and position changes no name in the
names list. If the programme wants a sense of place, a static outline with six labelled dots can sit
on the Overview page with nothing encoded.

### Filters we left out

Search by name (that is the Students page's job), gender, degree name and location. None of them
change who should be called this week. Add a filter only when it changes the list of names.
