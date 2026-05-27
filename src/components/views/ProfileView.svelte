<script>
  import { profileStats, isOwnProfile } from '$lib/stores/app.js';
  import FavoritesGrid from '../FavoritesGrid.svelte';

  export let profileName  = 'Music Curator';
  export let subText      = '';
  export let isViewing    = false;
  export let favs         = [null, null, null, null];

  export let onNavigate   = (view) => {};
  export let onFavSlot    = (i) => {};
</script>

<div class="space-y-10">
  <!-- Hero section -->
  <section class="flex flex-col md:flex-row gap-6 items-center border-b border-gray-900 pb-10">
    <div class="w-24 h-24 rounded-full border-2 border-gray-800 flex-shrink-0 shadow-xl {isViewing ? 'bg-gradient-to-br from-cyan-500 to-blue-600' : 'bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500'}"></div>

    <div class="text-center md:text-left flex-grow">
      <div class="flex flex-col sm:flex-row items-center gap-2 justify-center md:justify-start">
        <h2 class="text-3xl font-black text-white tracking-tight">{profileName}</h2>
        {#if isViewing}
          <span class="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Viewing Community Member</span>
        {/if}
      </div>
      <p class="text-sm text-gray-500 mt-1">{subText}</p>
      <div class="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
        <button onclick={() => onNavigate('yearly')}  class="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-gray-300 text-xs font-bold px-4 py-2 rounded-md transition">🏆 Yearly Favorites</button>
        <button onclick={() => onNavigate('top100')}  class="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-gray-300 text-xs font-bold px-4 py-2 rounded-md transition">🥇 Top 100 Albums</button>
        <button onclick={() => onNavigate('tiers')}   class="bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 text-gray-300 text-xs font-bold px-4 py-2 rounded-md transition">👑 Artist Tiers</button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-4 gap-1 border-l border-gray-900 pl-6 text-center h-16 items-center">
      <div class="px-3">
        <span class="block text-2xl font-bold text-white tracking-tight">{$profileStats.albums}</span>
        <span class="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Albums</span>
      </div>
      <div class="px-3">
        <span class="block text-2xl font-bold text-white tracking-tight">{$profileStats.tracks}</span>
        <span class="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Tracks</span>
      </div>
      <div class="px-3">
        <span class="block text-2xl font-bold text-white tracking-tight">{$profileStats.artists}</span>
        <span class="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Artists</span>
      </div>
      <div class="px-3">
        <span class="block text-2xl font-bold text-purple-400 tracking-tight">{$profileStats.avg}</span>
        <span class="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Global Avg</span>
      </div>
    </div>
  </section>

  <FavoritesGrid {favs} canEdit={$isOwnProfile} onSlotClick={onFavSlot} />
</div>
