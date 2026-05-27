<script>
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';

  import LandingPage  from './components/LandingPage.svelte';
  import Nav          from './components/Nav.svelte';
  import ProfileView  from './components/views/ProfileView.svelte';
  import ArtistView   from './components/views/ArtistView.svelte';
  import YearlyView   from './components/views/YearlyView.svelte';
  import Top100View   from './components/views/Top100View.svelte';
  import TiersView    from './components/views/TiersView.svelte';
  import ArtistModal  from './components/modals/ArtistModal.svelte';
  import AlbumModal   from './components/modals/AlbumModal.svelte';
  import FavoritesPickModal from './components/modals/FavoritesPickModal.svelte';

  import {
    currentUser, cache, favorites, community,
    isOwnProfile, selectedArtist, currentView,
  } from './lib/stores/app.js';

  import * as db      from './lib/services/supabase.js';
  import * as spotify from './lib/services/spotify.js';
  import { defaultSeedData, FALLBACK_ARTWORK } from './lib/constants.js';
  import { deepClone } from './lib/utils.js';

  // Modal visibility
  let showArtistModal = false;
  let showAlbumModal  = false;
  let showFavModal    = false;
  let favSlotIndex    = null;

  // Derived helpers
  $: user      = $currentUser;
  $: cacheVal  = $cache;
  $: favsVal   = $favorites;
  $: view      = $currentView;
  $: artist    = $selectedArtist;
  // Editing requires being signed in AND viewing your own profile
  $: canEdit   = !!$currentUser && $isOwnProfile;
  $: albumsForArtist = cacheVal[artist] ?? [];

  // Show landing when: no user and not actively browsing a community profile
  $: showLanding = !$currentUser && $isOwnProfile;

  // Profile display text
  $: profileName = user
    ? user.email.split('@')[0] + "'s Archive"
    : 'Music Curator';
  $: profileSub = $isOwnProfile
    ? (user
        ? 'Your updates are backed up online and cached locally.'
        : 'Your ratings are cached locally to prevent data loss between sessions.')
    : `Browsing in Read-Only Mode.`;

  // ─── Initialization ───────────────────────────────────────────────────────

  onMount(async () => {
    await spotify.handleCallback();

    const sessionUser = await db.getSession();
    if (sessionUser) currentUser.set(sessionUser);

    try {
      const profiles = await db.getCommunityProfiles();
      community.set(profiles);
    } catch (_) { community.set([]); }

    await revertToOwnProfile();
  });

  // ─── Profile loading ──────────────────────────────────────────────────────

  async function revertToOwnProfile() {
    isOwnProfile.set(true);
    selectedArtist.set('');
    currentView.set('profile');
    const u = get(currentUser);

    if (u) {
      const data = await db.getProfile(u.id);
      if (data) {
        cache.set(data.reviews_cache ?? {});
        favorites.set(data.favorites_grid ?? [null, null, null, null]);
        return;
      }
    }
    // Fallback: localStorage → seed data
    const local = localStorage.getItem('musicboxd_local_cache');
    cache.set(local ? JSON.parse(local) : deepClone(defaultSeedData));
    const localFavs = localStorage.getItem('musicboxd_local_favorites');
    favorites.set(localFavs ? JSON.parse(localFavs) : [null, null, null, null]);
  }

  async function loadCommunityProfile(userId) {
    const u = get(currentUser);
    isOwnProfile.set(!!(u && u.id === userId));
    selectedArtist.set('');
    currentView.set('profile');

    const profileMeta = get(community).find(p => p.user_id === userId);

    if (db.isConfigured()) {
      const data = await db.getProfile(userId);
      cache.set(data?.reviews_cache ?? {});
      favorites.set(data?.favorites_grid ?? [null, null, null, null]);
    } else {
      cache.set(profileMeta?.cache ?? deepClone(defaultSeedData));
      favorites.set(profileMeta?.favorites ?? [null, null, null, null]);
    }
  }

  // ─── Persistence ──────────────────────────────────────────────────────────

  async function saveState() {
    const u   = get(currentUser);
    const c   = get(cache);
    const favs = get(favorites);

    localStorage.setItem('musicboxd_local_cache',     JSON.stringify(c));
    localStorage.setItem('musicboxd_local_favorites', JSON.stringify(favs));

    if (u && get(isOwnProfile)) {
      await db.upsertProfile(u.id, u.email, c, favs);
    }
  }

  // ─── Auth handlers ────────────────────────────────────────────────────────

  async function handleSignIn(email, password) {
    const u = await db.signIn(email, password); // throws on error
    currentUser.set(u);
    await revertToOwnProfile();
  }

  async function handleSignUp(email, password) {
    const localCache = get(cache);
    const localFavs  = get(favorites);
    const u = await db.signUp(email, password); // throws on error
    currentUser.set(u);
    await db.insertProfile(u.id, email, localCache, localFavs);
    const profiles = await db.getCommunityProfiles();
    community.set(profiles);
    await revertToOwnProfile();
  }

  async function handleSignOut() {
    await saveState();
    await db.signOut();
    currentUser.set(null);
    // Return to landing — revertToOwnProfile sets isOwnProfile true which
    // combined with no user will trigger showLanding
    await revertToOwnProfile();
  }

  // ─── Navigation ───────────────────────────────────────────────────────────

  function selectArtist(name) {
    selectedArtist.set(name);
    currentView.set('artist');
  }

  function navigateTo(view) { currentView.set(view); }

  // ─── Artist CRUD ──────────────────────────────────────────────────────────

  function createArtist(name) {
    if (!name || !get(isOwnProfile)) return;
    cache.update(c => {
      if (!c[name]) c[name] = [];
      return c;
    });
    showArtistModal = false;
    saveState();
    selectArtist(name);
  }

  function renameArtist(newName) {
    const old = get(selectedArtist);
    if (!old || !newName || newName === old || !get(isOwnProfile)) return;
    if (get(cache)[newName]) { alert('An artist with that name already exists.'); return; }
    cache.update(c => {
      c[newName] = c[old].map(a => ({ ...a, artist: newName }));
      delete c[old];
      return c;
    });
    selectedArtist.set(newName);
    saveState();
  }

  function deleteArtist() {
    const name = get(selectedArtist);
    if (!name || !confirm(`⚠️ Delete entire profile for "${name}"? This cannot be undone.`)) return;
    cache.update(c => { delete c[name]; return c; });
    selectedArtist.set('');
    currentView.set('profile');
    saveState();
  }

  // ─── Album CRUD ───────────────────────────────────────────────────────────

  function createAlbum({ title, year, rating, artworkUrl, tracks }) {
    const name = get(selectedArtist);
    if (!name || !get(isOwnProfile)) return;
    const album = {
      id: 'alb-' + Date.now(),
      albumName: title,
      artist: name,
      year,
      officialRating: rating,
      artworkUrl: artworkUrl || FALLBACK_ARTWORK,
      tracks,
    };
    cache.update(c => { c[name] = [...(c[name] ?? []), album]; return c; });
    showAlbumModal = false;
    saveState();
  }

  function deleteAlbum(albumId) {
    const name = get(selectedArtist);
    if (!confirm('Delete this album?')) return;
    cache.update(c => { c[name] = c[name].filter(a => a.id !== albumId); return c; });
    saveState();
  }

  function moveAlbum(albumId, dir) {
    const name = get(selectedArtist);
    cache.update(c => {
      const list = [...c[name]];
      const idx  = list.findIndex(a => a.id === albumId);
      const to   = dir === 'up' ? idx - 1 : idx + 1;
      if (to < 0 || to >= list.length) return c;
      [list[idx], list[to]] = [list[to], list[idx]];
      c[name] = list;
      return c;
    });
    saveState();
  }

  // ─── Inline album / track updates ─────────────────────────────────────────

  function updateAlbum(albumId, field, value) {
    const name = get(selectedArtist);
    cache.update(c => {
      const alb = c[name]?.find(a => a.id === albumId);
      if (alb) alb[field] = value;
      return c;
    });
    saveState();
  }

  function updateTrack(albumId, trackNum, field, value) {
    const name = get(selectedArtist);
    cache.update(c => {
      const alb = c[name]?.find(a => a.id === albumId);
      const trk = alb?.tracks?.find(t => t.num === trackNum);
      if (trk) trk[field] = field === 'rating' ? parseFloat(value) : value;
      return c;
    });
    saveState();
  }

  // ─── Favorites ────────────────────────────────────────────────────────────

  function openFavSlot(i) {
    favSlotIndex = i;
    showFavModal = true;
  }

  function saveFavorite(artistKey, albumId) {
    const c = get(cache);
    const alb = c[artistKey]?.find(a => a.id === albumId);
    if (!alb) return;
    favorites.update(favs => {
      favs[favSlotIndex] = { artist: artistKey, id: albumId, albumName: alb.albumName, artworkUrl: alb.artworkUrl };
      return [...favs];
    });
    showFavModal = false;
    saveState();
  }

  function clearFavorite() {
    favorites.update(favs => { favs[favSlotIndex] = null; return [...favs]; });
    showFavModal = false;
    saveState();
  }
</script>

{#if showLanding}
  <LandingPage
    onSignIn={handleSignIn}
    onSignUp={handleSignUp}
    onBrowse={loadCommunityProfile}
  />
{:else}
  <div class="p-4 md:p-8 min-h-screen">
    <div class="max-w-6xl mx-auto">
      <Nav
        onGoHome={revertToOwnProfile}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onSignOut={handleSignOut}
        onAddArtist={() => showArtistModal = true}
        onSelectArtist={selectArtist}
        onSelectCommunity={loadCommunityProfile}
      />

      {#if view === 'profile'}
        <ProfileView
          profileName={profileName}
          subText={profileSub}
          isViewing={!$isOwnProfile}
          favs={favsVal}
          onNavigate={navigateTo}
          onFavSlot={openFavSlot}
        />

      {:else if view === 'artist'}
        <ArtistView
          artistName={artist}
          albums={albumsForArtist}
          {canEdit}
          onBack={() => currentView.set('profile')}
          onRename={renameArtist}
          onAddAlbum={() => showAlbumModal = true}
          onDeleteArtist={deleteArtist}
          onUpdateTrack={updateTrack}
          onUpdateAlbum={updateAlbum}
          onDeleteAlbum={deleteAlbum}
          onMoveUp={(id) => moveAlbum(id, 'up')}
          onMoveDown={(id) => moveAlbum(id, 'down')}
        />

      {:else if view === 'yearly'}
        <YearlyView musicCache={cacheVal} onBack={() => currentView.set('profile')} />

      {:else if view === 'top100'}
        <Top100View musicCache={cacheVal} onBack={() => currentView.set('profile')} />

      {:else if view === 'tiers'}
        <TiersView musicCache={cacheVal} onBack={() => currentView.set('profile')} />
      {/if}
    </div>
  </div>
{/if}

{#if showArtistModal}
  <ArtistModal
    onSave={createArtist}
    onClose={() => showArtistModal = false}
  />
{/if}

{#if showAlbumModal}
  <AlbumModal
    onSave={createAlbum}
    onClose={() => showAlbumModal = false}
  />
{/if}

{#if showFavModal}
  <FavoritesPickModal
    musicCache={cacheVal}
    slotIndex={favSlotIndex}
    onSave={saveFavorite}
    onClear={clearFavorite}
    onClose={() => showFavModal = false}
  />
{/if}
