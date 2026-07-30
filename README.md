# Custom Tab Page

A custom browser new-tab page, built with [Vite](https://vite.dev). Uses NASA's
[Astronomy Picture of the Day](https://api.nasa.gov) as a daily background.

## Setup

```bash
git clone https://github.com/Wontonify/Custom-Tab-Page.git
cd Custom-Tab-Page
npm install
```

Grab a free API key at [api.nasa.gov](https://api.nasa.gov), then copy
`.env.example` to `.env` and drop it in:

```
VITE_NASA_API_KEY=your_key_here
```

Vite only reads `.env` at startup, so restart the dev server after changing it.

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built output locally |

## Layout

```
index.html        page shell
src/main.js       entry point — fetches the APOD image
src/style.css     styles
public/           copied to the build root as-is (favicon)
```

## Deploying

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds and publishes to GitHub Pages.

The build needs the API key too — add `VITE_NASA_API_KEY` under **Settings →
Secrets and variables → Actions**, or the live site ships with an empty key and
every request fails.

> Note: `VITE_`-prefixed variables are bundled into the client JavaScript and are
> readable by anyone. That's fine for a rate-limited NASA key, but never put a
> private or paid API key in one.
