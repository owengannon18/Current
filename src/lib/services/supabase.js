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

// --- Auth ---

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

// --- Profiles ---

export async function getCommunityProfiles() {
  const c = client();
  if (!c) return [];
  const { data, error } = await c.from('music_profiles').select('user_id, email').order('email');
  if (error) throw error;
  return data ?? [];
}

export async function getProfile(userId) {
  const c = client();
  if (!c) return null;
  const { data } = await c
    .from('music_profiles')
    .select('reviews_cache, favorites_grid')
    .eq('user_id', userId)
    .single();
  return data ?? null;
}

export async function upsertProfile(userId, email, reviewsCache, favoritesGrid) {
  const c = client();
  if (!c) return;
  await c.from('music_profiles').upsert({
    user_id: userId,
    email,
    reviews_cache: reviewsCache,
    favorites_grid: favoritesGrid,
  });
}

export async function insertProfile(userId, email, reviewsCache, favoritesGrid) {
  const c = client();
  if (!c) return;
  await c.from('music_profiles').insert({
    user_id: userId,
    email,
    reviews_cache: reviewsCache,
    favorites_grid: favoritesGrid,
  });
}
