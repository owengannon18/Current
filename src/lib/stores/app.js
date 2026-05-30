import { writable, derived } from 'svelte/store';

export const currentUser   = writable(null);
export const cache         = writable({});   // { [artistName]: Album[] }
export const favorites     = writable([null, null, null, null]);
export const community     = writable([]);   // [{ user_id, email }]
export const isOwnProfile  = writable(true);
export const selectedArtist = writable('');
export const currentView   = writable('profile'); // 'profile'|'artist'|'yearly'|'top100'|'tiers'

export const profileStats = derived(cache, ($cache) => {
  let albums = 0, tracks = 0, ratingSum = 0;
  for (const albs of Object.values($cache)) {
    albums += albs.length;
    for (const a of albs) {
      tracks += a.tracks.length;
      for (const t of a.tracks) ratingSum += t.rating;
    }
  }
  return {
    albums,
    tracks,
    artists: Object.keys($cache).length,
    avg: tracks ? (ratingSum / tracks).toFixed(2) : '0.0',
  };
});

export const artistNames = derived(cache, ($cache) =>
  Object.keys($cache).sort()
);
