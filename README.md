# Moshal Careers Hub prototype

`index.html` is the clickable prototype of the Moshal Careers Hub: every screen for scholars,
career champions and the programme team, live, in the Moshal brand. `sidebar.js` is the navigation
panel as a standalone web component. `serve.js` serves the folder on <http://localhost:4321> for
previews. Open `index.html` directly if you prefer; there is no build step.

Brand assets come from `Branding/` in this repository: the Moshal Program logo, the Narkiss Block
typeface and the sub-brand palette. The colour system is set out in `../README.md` and at the top of
the stylesheet in `index.html`: one blue family for structure, three colours only for state.

## Personas

Sign in with any of these; the prototype does not check the password.

| Email | Role | Lands on |
|-------|------|----------|
| `cassidy.rinquest@myuct.ac.za` | Scholar | Home, with the announcements |
| `mickey.mpofu@wits.ac.za` | Career champion | Home; new listings go live straight away |
| `lisa.mtshali@karooanalytics.co.za` | Partner recruiter | Home; listings, events and resources go live straight away |
| `sipho.dlamini@uj.ac.za` | Exco | Overview: newest listings, flagged listings, job listings, announcements, content |
| `leah.isaacs@moshal.org` | Admin | Overview, plus users and roles, the four reports, and the activity log |

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
"Apply on employer website" adds the listing to My applications as **Applied**. There are three
stages: Applied, Offer and Not successful.

Choosing **Offer** opens a step that cannot be closed: the scholar has to record the offer in
Salesforce, the programme's system of record. Escape, clicking outside and moving to another page
all leave it open, and it reappears after the next sign-in until it is done. "I have updated
Salesforce" unlocks only after "Open Salesforce" has opened the link in a new tab. "I chose Offer by
mistake" sets the stage back. The address is `SALESFORCE_URL` in `index.html`, currently a
placeholder until the programme supplies the real one.

## Video in resources

A video is a YouTube or Vimeo link, played in place on the resource page or inside an article.
Video files are not uploaded (decided 14 Nov 2026). The prototype keeps uploaded pictures and files
in the browser for the session only; the hub stores them in PostgreSQL.

## Who sees an item

Listings, resources and announcements are for **Everyone** or for **Final years** only. Nothing finer.

## Content library: rich articles and files

The design is in `docs/rich-content.md`.

- **Articles have pages.** When reading:
  - on a computer, a Contents list on the left, "Page 2 of 4" with a progress line, and Previous
    and Next with the next page's title at the bottom;
  - on a phone, a "Page 2 of 4: …" picker instead.
- **Two example articles show the range:** "Interview question bank" (4 pages) and "CV writing
  toolkit" (3 pages). Between them they use:
  - headings;
  - a diagram with a caption;
  - tables;
  - Tip, Important and Example boxes;
  - coloured and highlighted text;
  - download cards.
- **The editor:**
  - **Pages:** tabs (add, title, move earlier or later, delete).
  - **Toolbar** (stays in view while you scroll): Style (Paragraph, Heading 1 to 3, Quote), bold,
    italic, underline, strikethrough, text colour and highlight (a fixed, readable palette), lists,
    link, Image (upload, with a description and caption), Video (YouTube or Vimeo), File (a download
    card), Table, Box, divider, undo, redo, clear.
- **Files.** "Files" replaces "Document": upload any number of files of any type scholars can use,
  up to 25 MB each. Programs and scripts are refused with a plain message. "One-page graduate CV
  template" shows three.
- **Video** is a YouTube or Vimeo link only; the old video upload is gone.

## Admin and Exco console

Listings go live as soon as they are posted; there is no approval step. Brief 3A says listings
"can be approved or rejected by the Exco", which the prototype reads as review after the fact: the
console opens on the newest listings, each with Remove, then flagged listings and expired listings
still stored. A champion who pastes a link already posted is warned while typing (same link once
tracking parameters are stripped). Job listings has two tabs, Live and Expired; a listing closing
within 7 days carries a chip. Removing anything says Remove, everywhere. Numbers come second. Colour follows the rest of the prototype:
structure is blue, and red, amber and green mark state only, so a red figure always means
something is wrong and amber always means time is short.

### The console's look

Exco and Admin pages use the `.console` styles: a quieter, denser working surface than the scholar
pages, so they read as a system rather than a showcase.

- On the Overview, "Needs attention" is a short to-do list: one line per thing to deal with, the
  count in its colour, what it is in words and Review. With nothing to do it reads "Nothing needs
  attention." The figures under it are separate cards, with no stripe down the side.
- On the reports, the figures sit in one ruled strip.
- Lists inside a panel are plain ruled rows, not cards inside a card.
- Bars are thin and square, and only the current one is labelled.
- Initials are neutral.
- Status is a dot and a word, with no badge background, everywhere in the console.
- Nothing animates in.
- Reports are one sheet ruled into sections, not a grid of floating cards; bars have no grey
  track behind them, and figures carry no progress bar (the target is in the words).
- Lists of items (Flagged listings and the like) are ruled rows on one surface.
- Users and roles filters by role with one row of tabs; what each role can do is in the tab's
  tooltip and the invite dialog, not five cards.
- Remove and Suspend are red words on a neutral button; the confirm step carries the weight.
- The activity log marks each kind with a small grey icon, not a coloured disc.

### Import scholars (proposed)

Admin → Users and roles → **Import scholars**. It is proposed, not yet in the spec: the design is in
`docs/scholar-import.md`, and the decisions it needs are listed there and in build-spec §13. There
are three steps:

1. **Choose a CSV.** It has the columns First name, Surname, Email, University, Year of study and
   Expected graduation year. "Download the template" gives them; "Try the example file" loads a
   sample with one of every case.
2. **Preview.** Every row is checked and nothing is sent yet:
   - **Ready**;
   - **Already a member** or **Already invited**, both skipped;
   - **Needs fixing**, with one plain reason, for example "Use their UWC email".

   Columns the hub does not use, such as an ID number, are named as ignored. "Download the N to
   fix" gives those rows to correct.
3. **Invite N scholars.** Each scholar gets their own one-time link, sent a few a second with a
   progress bar. Nobody gets a shared or default password.

The page also lists earlier imports, with how many joined and a reminder for those who haven't.

## Reporting vocabulary

Two states each, nothing in between, so the tiles always add up and nobody is counted twice.

| Applied | Meaning |
|---------|---------|
| Applied | Applied to at least one opportunity in the period; the row says when |
| Not applying | No application in the period |

| Offer | Meaning |
|-------|---------|
| Has an offer | Holds at least one offer now |
| No offer | No offer yet |

Applied and Offer are filters like Institution and Faculty: each has its two states, reads its own
name when nothing is picked, and has Clear. Every set filter shows as a pill beside "Showing", with
the count of scholars in the view.

**The filters are the story.** Whatever combination is set (Not applying + No offer + UCT, say), every
part of the page counts only those scholars: the tiles, the weekly chart, Final years to call, the
university and field bars, the names table, and Export, which opens on the same picks but keeps
every option editable. The bars show how many of them each university or field has, with that
row's share once Applied or Offer is set. A tile whose own filter is set shows the count and its
share of the other filter's group (65% of the 106 with no offer) instead of a flat 0% or 100%. The
page opens on all scholars. An offer is a held state, so offers draw no previous-period comparison.

### Final years

One rule everywhere: a final year is a scholar whose expected graduation year is this year
(`grad === 2026`). The year labels are not used for this, because repeats and extended programmes
make them disagree with graduation. The Final years toggle narrows the page to them, and "Final years
to call" lists those with **no offer and not applying**, the danger list and the only thing on the
page drawn in amber.

## Reports

The admin's Insights section has four reports. Each one has the same filter row: period (last 30
days, last 90 days, last 12 months or a custom range; a month on the Programme dashboard), field of
study and university, plus who posted where that applies. Each has a CSV export. Fields of study
are one list of six names everywhere, and listing types one list.
The history behind them is generated example data with its own seed.

| Report | What it answers |
|--------|-----------------|
| Programme dashboard | One month against the targets (listings posted, active scholars, champions posting every week). Month-on-month bars, active scholars weekly or monthly, and a table by region and university. The Targets button sets the numbers the brief left blank. A switch emails the summary to the Careers team on the 1st |
| Listings report | Listings posted each week or month, split by field, type, location or employer. Fields with few listings, and what is live, closing or expired today. Views, saves and clicks by field and university. Most viewed and most saved. Champion tracking, below |
| Content report | Views and downloads per resource and category, with the least used named. Views, link clicks and calendar adds for each announcement and category |
| Scholar report | Who applied, who has offers, and which final years need a call. Its Export takes the page's picks for the page's period or any one month |

### Tracking champions

Champions are tracked on the Listings report, not on a page of their own. Two filters sit beside
Posted by: **Champion** (one person) and **Champion status** (Active or Not active). A champion is
active when they posted at least once in the chosen period, so the period control, including a
custom range, decides who counts as active. As on the Scholar report, the filters are the story:
the numbers, the weekly chart, what was posted, views, saves and clicks, most viewed and saved, and
the export all follow them, and every set filter shows as a pill with the number of listings.

The **Career champions** summary sits right under the numbers. It shows how many are active and not
active (chips that set the status filter), how many are on target this week, and one row per
champion: status, the last four weeks against the weekly target, listings posted, the views and
clicks those listings drew, the share removed and removed as duplicates, and when they last posted.
Clicking a champion's name narrows the whole report to them.

Named scholars appear only in the Scholar report, and only after "Show names" or picking a group.
Everything else shows totals.

Regions group the universities: Western Cape (UCT, Stellenbosch), Gauteng (Wits, UP, UJ) and
KwaZulu-Natal (UKZN). The Careers team may define regions differently.

## How the Scholar report is meant to be read

The page is a dashboard for someone who is not an analyst: plain bars only, one short line under
each title that answers it ("Highest share not applying: University of KwaZulu-Natal (70%)"), and no other
text. Every bar, chip and figure is a button that lists the scholars behind it in the names table
at the bottom. Charts grow in when the page opens or what they show changes, and stay still when
only the names selection changes; reduced-motion users get no animation.

1. **Filters**: period, Institution, Faculty, Year of study and Final years say where to look;
   **Applied** and **Offer** say who. The university and field bars show the share of each row that
   matches, the names table lists them and Export opens on them.
2. **Three tiles**: Applying, Offers and Final years to call (the one amber tile). The chips under
   the first two (Applied, Not applying, Has an offer, No offer) and "See who" under Final years set
   the two dropdowns.
3. **Scholars applying each week** (each month for the last 12 months), with the average dashed,
   beside **Final years to call**, the number to call at each university.
4. **By university** (click to go down to faculty, then year) and **By field of study**.
5. **Names**: hidden until "Show names" or picking a group, then the scholars in the current
   selection, quietest first and sortable.

Every chart has a table view. Export sits in the page header.

## Export

There is one Export, in the Scholar report header. It opens on whatever the page shows: the Applied
and Offer picks, Final years, and the institution, faculty and year filters. Inside, choose the
period (the page's own, or any one of the last 12 months, which is how to get a monthly report)
and whether to include email addresses. The file name spells out the picks and the period, and the
button carries the count so nobody exports an empty file. The Programme dashboard has its own
download for the month by university.

### Chart palette

Blue `#2362B4` is the measured bucket (light blue `#9DBDE8` for earlier weeks), slate `#7D8B9A` is the remainder, and Alumni amber `#EBB22A` marks one
idea only: final years who need a call. Green and red do not appear on this screen. There is no
heatmap, and no separate year-of-study chart: drilling into a faculty shows the years.

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
