const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const TOKEN_KEY = 'spotify_access_token';
const VERIFIER_KEY = 'spotify_code_verifier';

// --- PKCE helpers ---

function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, x => possible[x % possible.length]).join('');
}

async function sha256(plain) {
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(plain));
}

function base64urlencode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// --- Public API ---

export function isConfigured() {
  return !!CLIENT_ID;
}

export function getAccessToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function isLinked() {
  return !!getAccessToken();
}

export async function connect() {
  if (!CLIENT_ID) throw new Error('VITE_SPOTIFY_CLIENT_ID is not set.');
  const codeVerifier = generateRandomString(64);
  const codeChallenge = base64urlencode(await sha256(codeVerifier));
  localStorage.setItem(VERIFIER_KEY, codeVerifier);

  const redirectUri = window.location.origin + window.location.pathname;
  const args = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: 'user-read-private',
    redirect_uri: redirectUri,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });
  window.location.href = 'https://accounts.spotify.com/authorize?' + args;
}

export async function handleCallback() {
  const code = new URLSearchParams(window.location.search).get('code');
  if (!code) return isLinked();

  const codeVerifier = localStorage.getItem(VERIFIER_KEY);
  const redirectUri = window.location.origin + window.location.pathname;
  window.history.replaceState({}, document.title, window.location.pathname);

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });
  const data = await res.json();
  if (data.access_token) {
    sessionStorage.setItem(TOKEN_KEY, data.access_token);
    return true;
  }
  return false;
}

export async function searchAlbums(query) {
  const token = getAccessToken();
  if (!token) throw new Error('Not authenticated with Spotify.');

  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=album&limit=4`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (res.status === 401) {
    sessionStorage.removeItem(TOKEN_KEY);
    throw new Error('TOKEN_EXPIRED');
  }
  const data = await res.json();
  return data.albums?.items ?? [];
}

export async function getAlbum(id) {
  const token = getAccessToken();
  if (!token) throw new Error('Not authenticated with Spotify.');

  const res = await fetch(`https://api.spotify.com/v1/albums/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
