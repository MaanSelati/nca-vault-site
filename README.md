# NCA Compliance Vault - website (Eleventy)

Bilingual (Arabic RTL / English) showcase site for the vault. Built with Eleventy 3.

## Run
```
npm install
npm start          # dev server with live reload
npm run build      # outputs the static site to _site/
```
Needs Node 18+.

## Before publishing
- Set your real contact email in `src/_data/site.json`.
- Deploying under a sub-path (e.g. GitHub Pages)? Build with `PATH_PREFIX=/your-repo/ npm run build`.

## Where things are
- `src/_data/i18n.json` - all Arabic and English text
- `src/_data/stats.json` - framework names, counts, descriptions
- `src/content/samples/*.md` - the preview control pages (add or remove files to change the preview)
- `src/css/style.css` - styling
- `src/_includes/` - page templates

## Publishing / editing with GitHub

- Push to `main`: the workflow in `.github/workflows/deploy.yml` builds the site and publishes it to GitHub Pages.
- In the repo, open Settings > Pages and set Source to "GitHub Actions" (one time).
- Live URL: `https://<user>.github.io/<repo>/`
- To edit text: `src/_data/i18n.json` (Arabic and English strings), `src/_data/site.json` (contact email), `src/content/samples/*.md` (sample notes), `src/css/style.css` (design).
- Local preview: `npm install` then `npm start`.
