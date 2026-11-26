# NCA Compliance Vault: showcase website

A bilingual (Arabic RTL and English) marketing site for the **Cybersecurity Compliance Vault**, an Obsidian vault that turns the Saudi National Cybersecurity Authority (NCA) control frameworks into a trackable compliance system.

Built with [Eleventy](https://www.11ty.dev/) 3, plain CSS and a little vanilla JavaScript. No frameworks, no build-time dependencies beyond Eleventy.

## What the site shows

| Framework | Controls | Role |
|-----------|---------:|------|
| ECC-1:2018 | 200 | Essential Cybersecurity Controls, the baseline |
| DCC-1:2022 | 66 | Data Cybersecurity Controls, extends ECC |
| TCC-1:2021 | 63 | Telework Cybersecurity Controls, extends ECC |

329 linked control notes in total. The site is a **preview**: it presents the vault and includes four sample notes, not the full vault.

## Getting started

Requires Node.js 18 or newer (see `.nvmrc`).

```bash
npm install
npm start        # dev server with live reload at http://localhost:8080
npm run build    # static site written to _site/
```

Arabic is served at `/` and English at `/en/`.

## Project structure

```
src/
  _data/
    i18n.json        all Arabic and English text
    stats.json       framework names, counts and descriptions
    site.json        contact email
  _includes/         page templates (base, home, sample pages, icons)
  content/samples/   the four preview control notes (Markdown)
  css/style.css      dark design system
  js/main.js         hero graph, tilt, scroll reveal, count-up
  index.njk, en/     page entry points per language
eleventy.config.js   collections, passthrough copy, bidi-safe control codes
.github/workflows/   GitHub Pages deployment
```

## Editing content

You can edit most things directly on GitHub (pencil icon) or locally.

- **Text and translations:** `src/_data/i18n.json`. Keep the `ar` and `en` sections in step.
- **Numbers and framework descriptions:** `src/_data/stats.json`.
- **Contact email:** `src/_data/site.json`.
- **Sample notes:** add or remove files in `src/content/samples/`. Each file needs front matter (`slug`, `order`, `framework`, `code`, `title_ar`, `title_en`, `type_ar`, `type_en`, `color`) and Arabic body text.
- **Design:** `src/css/style.css`, with colors defined as variables at the top.

Suggested workflow for reviewers: make changes on a branch, open a pull request, and check the result locally with `npm start` before merging to `main`.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.

1. In the repository, open **Settings > Pages** and set **Source** to **GitHub Actions** (one time).
2. The site is served at `https://<user>.github.io/<repo>/`. The workflow sets `PATH_PREFIX` automatically so links work under that sub-path.
3. For a custom domain or another host (Netlify, Cloudflare Pages), build with `npm run build` and publish `_site/`. At a domain root, leave `PATH_PREFIX` unset.

## Before going live

- [ ] Replace the placeholder email in `src/_data/site.json`.
- [ ] Confirm the right to redistribute the NCA control text shown in the samples.
- [ ] Add real screenshots of the vault (graph view, dashboards) if available.
- [ ] Decide the license for this repository (see below).

## Notes

- Independent project, not affiliated with or endorsed by the National Cybersecurity Authority. Official control texts come from NCA publications.
- Control codes such as `2-8-1-1` are wrapped in `<bdi dir="ltr">` at build time so they read correctly inside Arabic text.
- The small bar and column visuals in the feature cards are illustrative, not real compliance data.
- License: not yet chosen. Until one is added, all rights are reserved by default.
