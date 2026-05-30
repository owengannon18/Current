import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let _client = null;

function client() {
  if (!_client && supabaseUrl && supabaseKey) {
    _client = createClient(supabaseUrl, supabaseKey);
  }
  return _client;
}

export function isConfigured() {
  return !!(supabaseUrl && supabaseKey);
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function getSession() {
  const c = client();
  if (!c) return null;
  const { data } = await c.auth.getSession();
  return data?.session?.user ?? null;
}

export async function signIn(email, password) {
  const c = client();
  if (!c) throw new Error('Supabase is not configured.');
  const { data, error } = await c.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signUp(email, password) {
  const c = client();
  if (!c) throw new Error('Supabase is not configured.');
  const { data, error } = await c.auth.signUp({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  const c = client();
  if (c) await c.auth.signOut();
}

export async function resetPassword(email) {
  const c = client();
  if (!c) throw new Error('Supabase is not configured.');
  const redirectTo = window.location.origin + window.location.pathname;
  const { error } = await c.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw error;
}

export async function updatePassword(newPassword) {
  const c = client();
  if (!c) throw new Error('Supabase is not configured.');
  const { error } = await c.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

export function onAuthStateChange(callback) {
  const c = client();
  if (!c) return { data: { subscription: { unsubscribe: () => {} } } };
  return c.auth.onAuthStateChange(callback);
}

// ── Profiles ──────────────────────────────────────────────────────────────────

export async function getCommunityProfiles() {
  const c = client();
  if (!c) return [];
  const { data, error } = await c
    .from('profiles')
    .select('user_id, email')
    .order('email');
  if (error) throw error;
  return data ?? [];
}

/**
 * Fetch a user's full profile and reconstruct the in-memory data shapes
 * the app expects: { reviews_cache, favorites_grid }.
 */
export async function getProfile(userId) {
  const c = client();
  if (!c) return null;

  // Fetch all albums with their artist name and tracks in one query
  const { data: albumRows, error: albErr } = await c
    .from('albums')
    .select(`
      id, name, year, artwork_url, official_rating, sort_order,
      artists ( name ),
      tracks ( track_number, title, rating )
    `)
    .eq('user_id', userId)
    .order('sort_order');

  if (albErr) throw albErr;

  // Reconstruct { "ArtistName": [ albumObj, ... ] }
  const reviews_cache = {};
  for (const alb of albumRows ?? []) {
    const artistName = alb.artists?.name ?? 'Unknown Artist';
    if (!reviews_cache[artistName]) reviews_cache[artistName] = [];
    reviews_cache[artistName].push({
      id:             alb.id,
      albumName:      alb.name,
      artist:         artistName,
      year:           alb.year,
      officialRating: alb.official_rating,
      artworkUrl:     alb.artwork_url,
      tracks: (alb.tracks ?? [])
        .sort((a, b) => a.track_number - b.track_number)
        .map(t => ({ num: t.track_number, title: t.title, rating: t.rating })),
    });
  }

  // Fetch the 4 favorites slots
  const { data: favRows, error: favErr } = await c
    .from('favorites')
    .select(`
      slot_index, album_id,
      albums ( name, artwork_url, artists ( name ) )
    `)
    .eq('user_id', userId)
    .order('slot_index');

  if (favErr) throw favErr;

  const favorites_grid = [null, null, null, null];
  for (const fav of favRows ?? []) {
    if (fav.album_id) {
      favorites_grid[fav.slot_index] = {
        id:        fav.album_id,
        albumName: fav.albums?.name        ?? '',
        artist:    fav.albums?.artists?.name ?? '',
        artworkUrl: fav.albums?.artwork_url  ?? '',
      };
    }
  }

  return { reviews_cache, favorites_grid };
}

/**
 * Atomically sync the user's full data via the sync_profile_data RPC.
 * This handles inserts, updates, and deletes across all normalized tables.
 */
export async function upsertProfile(userId, email, reviewsCache, favoritesGrid) {
  const c = client();
  if (!c) return;
  const { error } = await c.rpc('sync_profile_data', {
    p_user_id:   userId,
    p_email:     email,
    p_cache:     reviewsCache,
    p_favorites: favoritesGrid,
  });
  if (error) throw error;
}

/**
 * First-time profile creation — same implementation as upsert since
 * sync_profile_data handles the ON CONFLICT case gracefully.
 */
export async function insertProfile(userId, email, reviewsCache, favoritesGrid) {
  return upsertProfile(userId, email, reviewsCache, favoritesGrid);
}
