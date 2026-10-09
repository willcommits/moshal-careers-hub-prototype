# Moshal Careers Hub prototype

`index.html` is the clickable prototype of the Moshal Careers Hub: every screen for scholars,
career champions and the programme team, live, in the Moshal brand. `sidebar.js` is the navigation
panel as a standalone web component. `serve.js` serves the folder on <http://localhost:4321> for
previews. Open `index.html` directly if you prefer; there is no build step.

The colour system is set out in `README.md` and at the top of the stylesheet in `index.html`: one blue family for structure, three colours only for state.

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

## How the Reporting screen is meant to be read

The page is one sentence that gets more specific from top to bottom, and every mark on it exists
to change which names get called this week. It has four parts, in reading order.

1. **Period and filters**, one row. The period is a dropdown: Last 30 days, Last 90 days, This
   year, or a custom range with two dates, and it reads back what is set ("10 Aug – 19 Sept"). The
   comparison with the previous period shows only for the two presets that have one. Then three
   multi-select dropdowns, Institution, Faculty and Year of study, plus a Final years toggle
   (graduating this year). That is every question the programme team asks of the scope: when,
   where, and which year. Every pick applies at once and the control reads back what is chosen
   ("UCT", or "Institution · 2"). Faculty lists only the faculties of the institutions picked.
   Clear all sits at the end of the row when anything is set.
2. **Questions.** Four cards, one per question the programme team asks, each in a brand colour
   that then runs through the chart and names below: Not applying in Alumni amber, Applied in
   Dreamers green, Has an offer in Program blue, No offer in Leaders red. Each shows the count,
   the share of the scope and, for the applying pair, the change on the previous period. The
   page opens on Not applying. Picking a card is the only lens switch there is.
3. **Story line** reads the answer back as one sentence: "570 of 880 scholars did not apply ·
   last 30 days", followed by the place chips when the scope is narrowed, each with an × to
   remove it. The header Export produces exactly this sentence.
4. **Explorer**: one card with four views, one at a time, so the eye has one chart to read.
   - **By institution** (then faculty, then year of study as you drill): one bar per row in the
     question's colour, a hollow dot at the previous period's share, the printed count and share,
     and a change column. Clicking a row narrows the
     scope and steps down a level; crumbs are the way back.
   - **By year of study**: a heatmap of the current level × year, the share who did not apply (or
     have no offer) printed in every cell on a four-step slate ramp. Clicking a cell sets place
     and year in one step. Cells with fewer than five scholars show a count, not a share.
   - **Final years**: the three groups as figures, with No offer, did not apply as the page's
     single amber mark, and one row per institution with the three counts and one bar on the
     danger share, worst first. Pressing a figure or a row opens the names.
   - **Where they drop off**: a five-stage funnel, Signed in → Viewed listings → Applied →
     Interview → Offer. Each stage counts scholars who also reached the stage before it, so bars
     only shrink. Stages without a data source say "Not tracked". The biggest drop is named.
5. **Names** lists the scholars in the current sentence, quietest first, ten rows then pages of
   25, with sortable headers, a status chip per row (glyph plus words, so it survives greyscale):
   Applied, Did not apply, an offer count or No offer, and an amber chip for final years with no
   offer who did not apply.

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

The measured bucket takes the colour of the question that is asked: Alumni amber `#EBB22A` for Not
applying, Dreamers green `#79BE4D` for Applied, Program blue `#2362B4` for Has an offer, Leaders red
`#E15546` for No offer. Slate `#7D8B9A` is the remainder. The previous period is a hollow dot. Alumni amber `#EBB22A` marks one idea, the
final-years danger list, and nothing else; it is never a bar, because at chart-mark size it fails the
contrast check. The heatmap ramp `#AEB7C1` `#99A3AF` `#6A7583` `#44505E` passes the dataviz ordinal check;
in-cell text is navy on the two light steps and white on the two dark. Green and red do not appear
on this screen.

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
