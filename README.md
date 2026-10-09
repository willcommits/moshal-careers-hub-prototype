# Moshal Careers Hub prototype

The clickable prototype of the Moshal Careers Hub: a careers portal for the Moshal Scholarship
Program in South Africa, with screens for scholars, career champions and the programme team. It is
design material, not shipped code: plain HTML, CSS and JavaScript with example data, no build step.

Open `index.html` in a browser, or run `node serve.js` and visit <http://localhost:4321>. It opens on a
prefilled sign-in; the account menu top right switches between the three roles.

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

## The prototype

- `index.html` is the whole app shell: every screen, plus Reporting.
- It opens on a sign-in screen in the brand:
  the hero on the left, email and password on the right, "Sign in →". The form opens prefilled with
  Thandiwe's details and signs in as the scholar; the account menu switches role once inside, and
  Sign out there returns to the form.
- It is a live prototype, not a picture. Every control does what it says: the Opportunities
  search and the study field, location and type dropdowns filter the list and read back as chips, and
  the sort sits on the list itself; the bookmark saves; Apply records the application and it
  appears in My applications; resources open and mark as done; events save a place; the post form
  validates, previews the card as the champion types, and publishes; a scholar can report a
  listing and it lands in the admin's flagged list. Nothing is stored, so a reload returns the
  example data.
- A listing shows scholars exactly what the champion entered and nothing else: title, employer,
  location, type, study field, closing date if one was given, and the description if one was
  written. The detail page keeps Apply, the facts and Save in a side rail so the action is visible
  without scrolling.
- The account menu switches between Thandiwe (scholar), Sipho (career champion) and Naledi
  (admin). The sidebar changes with the role, which is how all three sets of screens are reached.
  A champion sees the scholar's screens plus My listings. The programme team's sidebar has no
  scholar screens: Reporting and Flagged listings under "Programme team", and Opportunities,
  Career resources and Events under "Content". Naledi lands on Reporting.
- Posting is an action on the page, not a place in the sidebar. Champions and the programme team
  see a Post button in the Opportunities header; the programme team sees one on Career resources
  too. Those allowed can also edit what is there: a champion edits their own listings from the
  listing or from My listings, and the programme team edits or unpublishes any listing and edits
  or removes any resource. The post form is the edit form, prefilled.
- A resource is written in a rich editor: headings and subheadings, quotes, bold, italic and
  underline, bulleted and numbered lists, links, images (uploaded or by address), YouTube, Vimeo
  or video-file embeds, three brand fonts (Narkiss Block, Frank Ruhl Libre, Lora) and
  three text sizes. Each resource has a cover image, uploaded or by address; without one, scholars
  see the default cover with the title's initial. Covers show as thumbnails in the list and at
  the top of the article. Embedded HTML is cleaned before it is stored.
- The programme team also runs Events & updates: Add an event, Edit, and Cancel on each one, with
  the date deciding whether it sits under Upcoming or Past.
- When the programme team posts an opportunity, a resource or an event, a "Who sees this" row
  picks the audience: everyone, or only the years of study they choose. A scholar sees only what
  is for their year, in every list and count; the programme team sees everything, with "For 3rd
  year, Honours" marked on each targeted item. Champions post to everyone.
- The sidebar header is the Moshal logo with "Careers Hub" under it, which settles into place
  once on sign-in: the letters draw together as they fade in, then a short rule in the Scholars
  blue draws under them. The footer is a still programme card instead of the signed-in name,
  which the account menu already shows: the Moshal mark, "Moshal Program" and "Career Champion
  Programme 2027", with a faint watermark of the mark in the corner. Nothing in it moves. The
  collapsed rail keeps the mark alone.

## Brand

The brand assets the prototype needs sit in `brand/`: the Narkiss Block typeface and
the official Moshal Program logo as SVG, used in the sidebar and the sign-in hero. The brand
typeface, Narkiss Block, ships Regular and Medium only, so Medium is the heaviest weight anywhere
on the page and nothing is set in bold.

The palette has one structural family and three status colours, nothing else.

**Structure** is the Moshal Program blue family: navy `#16385C` for the sidebar and headings,
blue `#2362B4` for anything you can click or that is selected, and a light-blue tint for selected
and hover surfaces. On the navy sidebar the selected mark is the Scholars light blue `#41C3FF`, the
same family one step lighter so it shows on dark. The dashboard hero closes with a single rule in
that light blue.

**Status** colours appear only when something has a state, never as decoration:

| Sub-brand | Hex | Means |
|-----------|-----|-------|
| Moshal Alumni | `#EBB22A` | Needs your attention: closing soon, a flagged listing, an unread notification |
| Moshal Dreamers | `#79BE4D` | Done or live: applied, published, a resource read |
| Moshal Leaders | `#E15546` | Broken or destructive: a dead link, Unpublish |

Everything else is neutral: white cards, one hairline, slate text. Status colours are darkened
where text sits on a tint so the contrast holds.

The four sub-brands are also the programme's audiences, so they appear a second way, as the
**stages of one journey**: Dreamers, Scholars, Alumni, Leaders. That shows in four places and
nowhere else: a strip at the foot of the sign-in hero; the colour of each person's avatar (a
scholar on Scholars blue, a career champion on Alumni amber, programme staff on Program blue);
a "Your journey" card under the dashboard tiles with the person's stage lit; and a "Giving back"
card on the champion's My listings with the Alumni rule. Lists, tags and events never take a
stage colour, so the pages stay quiet.

Motion is kept to what helps you follow a change: the page content eases in when you navigate,
a card lifts a pixel under the pointer, a bookmark pops when saved, menus drop and toasts rise.
Everything is under 300ms and switches off with the system's reduced-motion setting.
