# Gupta Enterprises — Website

A static marketing and catalog website for Gupta Enterprises, built with [Astro](https://astro.build)
and edited through a browser-based admin panel at `/admin`.

**55 pages. Zero JavaScript frameworks shipped to the browser. Content edited without touching code.**

---

## Contents

1. [How it works](#how-it-works)
2. [Running it locally](#running-it-locally)
3. [Deploying to Netlify](#deploying-to-netlify)
4. [Setting up the admin panel](#setting-up-the-admin-panel)
5. [Where enquiries go](#where-enquiries-go)
6. [Everyday content editing](#everyday-content-editing)
7. [Photography you still need to supply](#photography-you-still-need-to-supply)
8. [Content accuracy notes — please read](#content-accuracy-notes--please-read)
9. [Project structure](#project-structure)
10. [Design system](#design-system)
11. [Maintenance](#maintenance)

---

## How it works

```
                      ┌──────────────────────────────┐
   You, at /admin ───► │  Sveltia CMS (in browser)     │
                      └───────────────┬──────────────┘
                                      │ commits JSON / Markdown
                                      ▼
                      ┌──────────────────────────────┐
                      │  GitHub repository            │
                      └───────────────┬──────────────┘
                                      │ push triggers build
                                      ▼
                      ┌──────────────────────────────┐
                      │  Netlify: `astro build`       │
                      │  → static HTML in dist/       │
                      └───────────────┬──────────────┘
                                      ▼
                             Live site on the CDN
```

There is **no database and no server**. Every page is pre-rendered HTML. The admin panel writes
content files straight into the repository, which triggers a rebuild — the site is live again in
about a minute.

**Why this shape:** static HTML is the fastest, cheapest and most secure way to serve a B2B catalog,
and it cannot go down because a database fell over. Keeping content in the repository means every
edit is version-controlled and reversible.

| Concern | How it's handled |
| --- | --- |
| Speed | Pre-rendered HTML, no framework runtime, AVIF/WebP images with srcset, 6 font files |
| SEO | Per-page titles/descriptions, canonical URLs, Open Graph, JSON-LD, sitemap, robots.txt |
| Content editing | Sveltia CMS at `/admin` — no code, no terminal |
| Enquiries | Netlify Forms, including drawing uploads |
| Security | No server to attack, no plugins, no PHP, tight response headers |

---

## Running it locally

Requires Node 20 or newer.

```bash
npm install        # if npm blocks install scripts, run: npm approve-scripts --allow-scripts-pending
npm run dev        # http://localhost:4321
```

Other commands:

```bash
npm run build      # production build into dist/
npm run preview    # serve the built site
npm run check      # TypeScript + Astro diagnostics
npm run cms        # local CMS proxy — see below
```

**Editing content locally.** Run `npm run cms` in a second terminal, then open
`http://localhost:4321/admin`. The CMS reads and writes your local files directly, so you can try
changes before anything is committed. (`local_backend: true` in `public/admin/config.yml` enables
this and is ignored in production.)

---

## Deploying to Netlify

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial website"
git branch -M main
git remote add origin https://github.com/YOUR-ORG/YOUR-REPO.git
git push -u origin main
```

### 2. Connect the site

In Netlify: **Add new site → Import an existing project → GitHub**, and pick the repository.
`netlify.toml` already sets everything, so the detected settings should read:

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 22

### 3. Point the domain at it

Netlify → **Domain management → Add a domain** → `guptagroups.in`. Follow the DNS instructions and
let Netlify provision the TLS certificate.

If the live domain is ever anything other than `https://www.guptagroups.in`, set a `SITE_URL`
environment variable in Netlify. Canonical URLs, the sitemap and JSON-LD all read from it.

---

## Setting up the admin panel

This is a **one-time, five-minute setup**. Until it is done, `/admin` will load but cannot log in.

### 1. Tell the CMS which repository to write to

Edit `public/admin/config.yml`, line 15:

```yaml
backend:
  name: github
  repo: OWNER/REPOSITORY # ← change to e.g. guptaenterprises/website
  branch: main
```

Commit and push.

### 2. Let Netlify handle the GitHub login

In the Netlify dashboard for this site:

**Site configuration → Access & security → OAuth → Install provider → GitHub**

That is the whole step. Netlify runs the OAuth handshake on your behalf, so you do not need to
register a GitHub OAuth application yourself.

### 3. Log in

Go to `https://your-site.netlify.app/admin` (or `https://www.guptagroups.in/admin`) and click
**Login with GitHub**. Anyone with write access to the repository can edit content.

### How publishing works

Editorial workflow is enabled, so content moves through three states:

1. **Draft** — saved, not on the site
2. **In review** — ready for a second pair of eyes
3. **Ready → Publish** — merged and live in about a minute

Nothing reaches the live site until you press **Publish**.

### Giving someone else access

Add them as a collaborator on the GitHub repository with write access. They log in at `/admin` with
their own GitHub account. To remove access, remove them from the repository.

---

## Where enquiries go

RFQ and contact submissions are handled by **Netlify Forms** — they are *not* stored in the admin
panel, because a static site has nowhere to put them.

### Reading submissions

Netlify dashboard → **Forms**. Two forms appear after the first deploy:

- **`rfq`** — the full Request for Quotation, including uploaded drawings
- **`contact`** — general enquiries

Uploaded drawings (PDF, DWG, DXF, STEP, IGES, ZIP) are attached to each submission and downloadable
from there.

### Getting emailed about them

Netlify → **Forms → Form notifications → Add notification → Email notification**, and enter
`guptaenterprises@guptagroups.in`. Do this for both forms.

Do it on day one. Without it, enquiries sit in the dashboard unread, and a buyer who does not hear
back within a working day has already emailed someone else.

### Spam

Each form has a honeypot field that catches naive bots. If spam gets through, enable
**Forms → Spam filtering → reCAPTCHA** in Netlify.

### Upload limit

The RFQ form warns above 8 MB (`forms.maxUploadMb` in `src/data/site.json`) and tells the buyer to
email large files instead. Netlify's own limit is higher, but very large uploads fail silently on
poor mobile connections, which is worse than a clear warning.

---

## Everyday content editing

Everything below is editable at `/admin` with no code.

| I want to… | Go to |
| --- | --- |
| Add or edit a product | **Products** |
| Upload product photos or a drawing PDF | **Products** → the product → Photographs |
| Add a machine | **Machine list** |
| Edit a capability page | **Capabilities** |
| Add or edit an industry | **Industries** |
| Write an article | **Articles** |
| Post a job | **Job openings** |
| Change the homepage hero or headings | **Website pages → Homepage** |
| Edit the About / Our Story copy, values, timeline | **Website pages → Company information** |
| Update turnover figures | **Website pages → Company information → Turnover figures** |
| Change units, press counts, power backup | **Website pages → Infrastructure** |
| Edit the quality process or gauge list | **Website pages → Quality assurance** |
| Add a certificate PDF | **Website pages → Certifications** |
| Add a brochure | **Website pages → Downloads** |
| Add an FAQ | **Website pages → FAQs** |
| Upload factory photographs | **Website pages → Factory gallery** |
| Upload factory videos | **Website pages → Factory videos** |
| Change phone, email, address | **Settings → Company & contact details** |
| Add a product category or material | **Settings → Categories, materials & processes** |

### Two rules worth knowing

**Do not change an ID once it is in use.** Categories, materials and processes have an `id` and a
display name. Products reference the `id`. Renaming a display label is always safe; changing an `id`
breaks every product pointing at it and silently empties the catalog filters.

**Images are optional everywhere.** Anywhere a photograph is missing, the site renders a clearly
marked placeholder with a note about what belongs there. It never falls back to stock photography of
someone else's factory. Upload a real photo and the placeholder disappears.

---

## Photography you still need to supply

This is the biggest outstanding item. The site is built and correct, but it is showing labelled
placeholders wherever a real photograph belongs. Six genuine part photographs from the company
profile are already in place; the plant itself has not been shot.

**The single highest-value photo** is the homepage hero: a wide shot down the press line in Unit 1,
landscape, 2400 px wide or larger. Upload it at **Website pages → Homepage → Hero photograph**.

After that, the gallery shot list is already written into the site — open
`/infrastructure/gallery` and each placeholder states exactly what to take:

| Section | Shots |
| --- | --- |
| Shop floor | Press line wide angle · 250 T press in operation · operator at a 50 T press · laser cell with sheet loaded |
| Machinery | VMC with part on table · laser bed mid-cut · MIG station with fixture · projection welder |
| Tool room | Surface grinder with die block · assembled progressive die · weld fixture with part · room overview |
| Quality | Inspector with vernier on a part · surface plate with height gauge · gauge board · records being completed |
| Warehouse | Sheet and coil racking · tube stock · finished goods staged · bin trolleys |
| Dispatch | Parts being packed · labelled cartons · loading bay with vehicle · dispatch paperwork |
| Team | Group photo on the floor · tool room team · quality team · supervisor with production board |

Practical notes: shoot landscape, during a shift with machines actually running, lights on, no
posing. A recent phone camera is fine — an honest photo of your real floor beats a polished photo of
someone else's every time. Buyers can tell the difference, and it is exactly what they are looking
for on this kind of site.

Videos are the same: `/infrastructure/videos` lists four films with suggested lengths. Keep each
MP4 under about 20 MB.

---

## Content accuracy notes — please read

All figures on the site come from your company profile PDF. In a few places I made a deliberate
judgement call, and you should confirm each one.

### 1. Powder coating is presented as a managed service, not in-house

Your profile lists "coated & tubular parts" in production but no coating equipment in the machine
list. So `/capabilities/powder-coating` says plainly that finishing is done through qualified
partners under your purchase order, with parts inspected by you before dispatch.

**If you do have in-house coating**, set *Performed in-house* to true on that capability and clear
the partner disclosure. **If the current description is right, leave it** — being straight about a
subcontracted step is a genuine advantage during a customer audit, and buyers find out either way.

### 2. Customer OEM programme names are generalised

Your profile names "Bolero seat assemblies" and "Bajaj footrest assemblies". On the public site I
wrote these as *"seat assemblies for utility-vehicle programmes"* and *"two-wheeler footrest
assemblies"*.

Naming another company's vehicle programmes publicly can breach a supply agreement or trademark
terms. **If you have written permission from those customers, put the names back** — they are strong
proof — at **Company information → Current production programmes**. Otherwise leave as is.

### 3. Your turnover figure is three years old

The latest audited figure on the site is **₹25.35 Cr (FY 2022–23)**. It is clearly labelled, and
`/why-us` answers the objection directly. But it is now FY 2025–26, and a sceptical procurement
manager will notice.

Add FY 2023–24 and FY 2024–25 at **Company information → Turnover figures** as soon as you can.

### 4. The Traub machine count is a placeholder

You mentioned Traub machines; they are not in the profile's machine list, so I entered **quantity 1**
with no invented specification. Set the real count and capacity at **Machine list → Traub Automatic
Lathe**.

### 5. IATF 16949 is explicitly stated as *not held*

`/certifications` and the FAQs say you hold ISO 9001:2015 and not IATF 16949. This is deliberate.
Automotive buyers check, and volunteering it reads as confidence. Update it the day you certify.

### 6. Plant coordinates are approximate

`src/data/site.json` has approximate Faridabad coordinates for the map and local-business markup.
Get the exact ones from Google Maps (right-click your plant → click the coordinates to copy) and set
them at **Settings → Company & contact details → Coordinates**.

### 7. Social links are empty

LinkedIn, IndiaMART and YouTube fields are blank, so no icons render. Add URLs at
**Settings → Company & contact details → Social profiles** and they appear in the footer.

### 8. The legal pages describe real practice, not boilerplate

`/privacy` and `/terms` are written in plain language and describe what the site actually does
(Netlify Forms, no analytics, no marketing cookies). They are not legal advice. Have them reviewed
before relying on them contractually.

---

## Project structure

```
├── astro.config.mjs          Build config, sitemap, canonical origin
├── netlify.toml              Build, security headers, redirects
├── scripts/
│   └── generate-brand-assets.mjs   Regenerates the OG card and touch icon
│
├── public/                   Served as-is
│   ├── admin/                Sveltia CMS — index.html + config.yml
│   ├── downloads/            Company profile PDF
│   ├── images/               CMS uploads land here
│   ├── videos/               Factory videos
│   ├── favicon.svg · robots.txt · site.webmanifest
│
└── src/
    ├── assets/               Build-optimised images (products, logo)
    ├── content/              Collections — one file per item
    │   ├── products/         7 component families
    │   ├── capabilities/     9 capability pages
    │   ├── machines/         22 machine entries
    │   ├── industries/       6 sectors
    │   ├── posts/            3 articles (Markdown)
    │   └── jobs/             3 openings
    ├── content.config.ts     Collection schemas — validated at build time
    │
    ├── data/                 Site-wide singletons
    │   ├── site.json         Company + contact + SEO defaults
    │   ├── company.json      Story, values, timeline, turnover, process
    │   ├── home.json         Homepage copy
    │   ├── infrastructure.json · quality.json · certifications.json
    │   ├── taxonomy.json     Categories, materials, processes
    │   ├── faqs.json · downloads.json · gallery.json · videos.json
    │
    ├── lib/
    │   ├── site.ts           Navigation, taxonomy lookups, derived values
    │   ├── images.ts         Resolves asset vs. public image paths
    │   └── seo.ts            JSON-LD builders
    │
    ├── components/
    │   ├── layout/           Header (mega-nav), Footer
    │   ├── sections/         PageHero, CTABand, SectionHead, Breadcrumbs
    │   └── ui/               Icon, Button, SmartImage, Placeholder, cards
    │
    ├── layouts/BaseLayout.astro    HTML shell, SEO, schema, scroll reveal
    ├── pages/                      File-based routes
    └── styles/                     fonts · tokens · base · system · forms
```

### Adding a page

Create `src/pages/your-page.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PageHero from '../components/sections/PageHero.astro';
import CTABand from '../components/sections/CTABand.astro';

const crumbs = [{ label: 'Home', href: '/' }, { label: 'Your page' }];
---

<BaseLayout title="Your page" description="Under 165 characters." breadcrumbs={crumbs}>
  <PageHero kicker="Section" title="Your heading" lead="Your intro." breadcrumbs={crumbs} />
  <section class="section">
    <div class="container">…</div>
  </section>
  <CTABand />
</BaseLayout>
```

It joins the sitemap automatically. Add it to `navigation` or `footerNav` in `src/lib/site.ts` to
link it.

---

## Design system

Everything is driven by tokens in `src/styles/tokens.css`.

**Colour.** The GE logo samples at `#ff2b28` — correct in print, but only 3.7:1 against white, so
unusable for text. The palette keeps that hue and builds an accessible ramp from it:

| Token | Value | Use |
| --- | --- | --- |
| `--ge-red-mark` | `#ff2b28` | Reproducing the logo only |
| `--ge-red` | `#d81f26` | Accent rules, bars, icons |
| `--ge-red-ink` | `#b8121a` | Text, links, solid buttons — 6.7:1 on white |
| `--ge-red-dark` | `#8e0e14` | Hover / pressed |
| `--ink-900` | `#0b0d10` | Dark sections, primary text |

**Type.** Archivo for headings (industrial grotesque), Inter for body, IBM Plex Mono reserved
strictly for measured values, part codes and specifications — that reservation is what makes the
spec tables read as engineered rather than decorated.

**Form.** 2px corner radius throughout. Hairline rules instead of shadows. The red-bar-plus-tracked-
uppercase-kicker pattern is lifted from your printed company profile, so print and web read as one
identity. Reveal animations are opacity plus a 14px rise, nothing else, and they are disabled under
`prefers-reduced-motion`.

**Dark sections** use `.on-dark`, which remaps the semantic tokens rather than overriding component
styles one by one.

### Adding an icon

Icons are inline SVG in `src/components/ui/Icon.astro` — a 24×24 grid, 2px stroke, round caps. Add
a `name: '<path …>'` entry to the `paths` map and use `<Icon name="your-icon" />`. Only icons you
actually reference reach the HTML.

---

## Maintenance

### Keeping content fresh

| Cadence | Task |
| --- | --- |
| As it happens | New products, machines, job openings |
| Quarterly | An article — this is what brings buyers in from search |
| Annually | Turnover figures, team size, press counts, certificate expiry dates |
| When it changes | Contact details, certifications, customer list |

### Dependencies

```bash
npm outdated
npm update            # patch and minor
npm run build         # always verify before pushing
```

### If a build fails

Netlify → **Deploys** → the failed deploy → **Deploy log**. The usual cause is a content file that
does not match its schema — for example a required field left empty, or a `related` product
referencing a slug that has been deleted. Astro names the file and field. Fix it in `/admin` and it
rebuilds.

The previous deploy stays live throughout, so a failed build never takes the site down.

### Regenerating the share card

`public/images/og/og-default.png` is generated, not hand-drawn. After changing the wordmark or
tagline:

```bash
node scripts/generate-brand-assets.mjs
```

### Verifying SEO after a content change

The site was audited at build time for: single `<h1>` per page, titles ≤ 62 characters,
descriptions 70–165 characters, canonical URLs, valid JSON-LD, no broken internal links, no missing
images and `alt` on every image. If you add many pages, it is worth re-checking those same things.

---

## Credits

Built with [Astro](https://astro.build), [Sveltia CMS](https://github.com/sveltia/sveltia-cms),
[Netlify](https://netlify.com), and typefaces Archivo, Inter and IBM Plex Mono via
[Fontsource](https://fontsource.org).
