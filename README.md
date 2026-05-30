# Discogd

A music rating and cataloging web app — like Letterboxd, but for albums and tracks. Built with Svelte + Vite, styled with Tailwind CSS v4, backed by Supabase (auth + database), and integrated with the Spotify API for album autofill.

Deployed as a fully static site on GitHub Pages. No server required.

---

## Features

- **Artist profiles** — create and manage per-artist album logs
- **Track-level ratings** — rate every track on a 0–5 scale with color-coded labels
- **Spotify autofill** — search Spotify to auto-populate album title, year, artwork, and tracklist
- **Community profiles** — browse other users' public archives in read-only mode
- **Favorites grid** — pin four albums to your profile header
- **Stats** — live counts for albums, tracks, artists, and global average rating
- **Yearly/Top 100/Tier views** — derived overviews of your full catalog
- **Offline fallback** — data cached in localStorage when logged out

---

## Local development

### 1. Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Spotify Developer](https://developer.spotify.com/dashboard) app

### 2. Clone and install

```bash
git clone https://github.com/<your-username>/discogd.git
cd discogd
npm install
```

### 3. Configure environment variables

```bash
cp .env.sample .env
```

Open `.env` and fill in:

| Variable | Where to find it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase dashboard → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase dashboard → Settings → API → anon public key |
| `VITE_SPOTIFY_CLIENT_ID` | Spotify developer dashboard → your app → Client ID |

### 4. Spotify redirect URI

In your Spotify app settings add these redirect URIs:
- `http://localhost:5173` (dev)
- `https://<your-username>.github.io/<repo-name>/` (production)

### 5. Supabase table

Create a table called `music_profiles` with these columns:

| Column | Type |
|---|---|
| `user_id` | `uuid` (primary key, references `auth.users.id`) |
| `email` | `text` |
| `reviews_cache` | `jsonb` |
| `favorites_grid` | `jsonb` |

Enable Row Level Security and add a policy that allows users to read all rows and write only their own.

### 6. Run

```bash
npm run dev
```

---

## Deployment (GitHub Pages)

The repo includes a GitHub Actions workflow at `.github/workflows/deploy.yml` that builds and deploys to GitHub Pages on every push to `main`.

Before deploying, add your environment variables as **repository secrets** in GitHub:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SPOTIFY_CLIENT_ID`

Then enable GitHub Pages in your repo settings and point it at the `gh-pages` branch.

---

## Project structure

```
src/
├── lib/
│   ├── components/
│   │   └── ui/             # shadcn-style primitives (Button, Input, Label, Badge, Card, Dialog, …)
│   ├── services/
│   │   ├── supabase.js     # Supabase client, auth, and database helpers
│   │   └── spotify.js      # Spotify PKCE OAuth, search, and album fetch
│   ├── stores/
│   │   └── app.js          # Svelte writable stores for all shared state
│   ├── constants.js        # Rating labels, default seed data
│   └── utils.js            # Shared helpers (cn, rating → CSS class, etc.)
├── components/
│   ├── views/              # ProfileView, ArtistView, YearlyView, Top100View, TiersView
│   ├── modals/             # ArtistModal, AlbumModal, FavoritesPickModal
│   ├── Nav.svelte
│   ├── AlbumCard.svelte
│   ├── FavoritesGrid.svelte
│   └── PieChart.svelte
├── App.svelte              # Root orchestrator — state, routing, persistence
└── main.js
```
