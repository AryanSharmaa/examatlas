# ExamAtlas — Class 12 Opportunity Discovery (Interactive Prototype)

A fully interactive, responsive website for Indian students exploring opportunities after Class 12: engineering, medicine, law, design, management, research, professional qualifications, government jobs, scholarships, domestic admissions, and international pathways.

## Important: demo data only

**This is a front-end prototype, not a verified exam announcement service.** The names of exams are real examples, and links point to organizing bodies where possible. **Every application/exam date, status and eligibility assessment in the sample catalog is illustrative and must not be relied on for real applications.** The banner, cards, details panel, calendar events and SmartMatch deliberately repeat this warning.

For a public launch with real data, implement a verified backend and admin review workflow first. The project deliberately has `<meta name="robots" content="noindex, nofollow">` until that is done.

## Features

- Responsive home, category tiles, searchable opportunity catalog and multi-filter explorer
- Status tabs, load-more pagination and date sorting (all based on **sample** dates)
- Grid/list view, saved opportunities, responsive mobile bottom navigation
- Individual opportunity details with official organizer links and shareable `#exam/<id>` URLs
- Calendar: navigate months, select days, view events, export **clearly labeled sample** `.ics` deadline events
- SmartMatch: choose stream, year, Class 12 status, home state and location; see subject-alignment recommendations, incomplete matches and other paths
- Light/dark theme; saved preferences and bookmarks via `localStorage` (no login/backend)
- Keyboard: `/` focuses search, `Esc` closes exam detail drawer
- No dependencies, no API keys, no build step

## Run locally

The simplest way is to open `index.html` in a modern browser. For testing shareable links or serving over localhost:

```bash
cd examatlas
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Push to GitHub and publish via GitHub Pages

From inside this folder:

```bash
git init
git add .
git commit -m "Launch interactive ExamAtlas prototype"
git branch -M main
gh repo create examatlas --public --source=. --remote=origin --push
```

Alternatively create an empty repository on GitHub, add `origin`, and push to `main`.

The workflow in `.github/workflows/deploy.yml` deploys the site from `main`. In the GitHub repository open **Settings → Pages → Build and deployment → Source → GitHub Actions**. Check **Actions** for the deployed Pages URL.

Example URL format: `https://YOUR_USERNAME.github.io/examatlas/`

## File layout

| File | Purpose |
|------|---------|
| `index.html` | All accessible page layouts and interactive view containers |
| `styles.css` | Responsive design tokens, page styling, dark mode |
| `data.js` | Clearly marked illustrative sample catalog, replace later |
| `app.js` | Search, filters, routing, matching, saved items, calendar and interactions |
| `assets/favicon.svg` | App icon |
| `.github/workflows/deploy.yml` | GitHub Pages deploy on push |

## Next engineering phase: verified data and eligibility

1. Replace `data.js` with a versioned backend data model: `opportunities`, `cycles`, `dates`, `sources`, `eligibility_rules`, `rule_evaluations`.
2. Collect **permitted** official RSS/API/HTML/PDF sources. Do not bypass CAPTCHA, authentication or access restrictions.
3. Flag extracts for human review; preserve source URLs, evidence snippets, effective cycle, verification timestamp and change history.
4. Store publication state and distinguish **announced**, **estimated** and **unannounced** dates. Never publish invented deadlines.
5. Create a deterministic eligibility rules engine with `pass`, `fail`, `unknown` for each condition; separate **exam registration eligibility** from **course/institution admission eligibility**.
6. Only display **meets published criteria** if all necessary rules are verified against current official notices and all required student facts are present. If rules are not verified or profile details are missing, show a suitable uncertainty state.
7. Add tests, admin tools, data correction route, content monitoring, security controls and privacy-by-design for under-18 users.

### Note on the demo matching algorithm

SmartMatch in `app.js` **only suggests pathways based on example stream and location mappings**. It is not an eligibility checker and intentionally does not claim to verify age, board, marks, reservations, attempts or other official conditions. Those checks must be implemented from source-backed rules before launch.

## License and reuse

This implementation was created from scratch for this project. Any third-party exam names, institutional names and links belong to their respective owners. The website is not affiliated with any exam organizer.
