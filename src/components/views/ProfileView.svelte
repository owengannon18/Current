<script>
  import { profileStats, isOwnProfile } from '$lib/stores/app.js';
  import FavoritesGrid from '../FavoritesGrid.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Badge  from '$lib/components/ui/badge.svelte';

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

    <div class="text-center md:text-left flex-grow min-w-0">
      <div class="flex flex-wrap items-center gap-2 justify-center md:justify-start">
        <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">{profileName}</h2>
        {#if isViewing}
          <Badge variant="outline" class="text-blue-400 border-blue-500/20 bg-blue-500/10 whitespace-nowrap">Viewing Community Member</Badge>
        {/if}
      </div>
      <p class="text-sm text-gray-500 mt-1">{subText}</p>
      <div class="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
        <Button variant="outline" size="sm" on:click={() => onNavigate('yearly')} class="whitespace-nowrap">🏆 Yearly Favorites</Button>
        <Button variant="outline" size="sm" on:click={() => onNavigate('top100')} class="whitespace-nowrap">🥇 Top 100 Albums</Button>
        <Button variant="outline" size="sm" on:click={() => onNavigate('tiers')} class="whitespace-nowrap">👑 Artist Tiers</Button>
      </div>
    </div>

    <!-- Stats -->
    <div class="flex-shrink-0 grid grid-cols-4 gap-1 md:border-l md:border-gray-900 md:pl-6 text-center items-start pt-2">
      <div class="px-2 sm:px-3">
        <span class="block text-2xl font-bold text-white tracking-tight">{$profileStats.albums}</span>
        <span class="block text-[10px] text-gray-500 uppercase font-bold tracking-tight whitespace-nowrap">Albums</span>
      </div>
      <div class="px-2 sm:px-3">
        <span class="block text-2xl font-bold text-white tracking-tight">{$profileStats.tracks}</span>
        <span class="block text-[10px] text-gray-500 uppercase font-bold tracking-tight whitespace-nowrap">Tracks</span>
      </div>
      <div class="px-2 sm:px-3">
        <span class="block text-2xl font-bold text-white tracking-tight">{$profileStats.artists}</span>
        <span class="block text-[10px] text-gray-500 uppercase font-bold tracking-tight whitespace-nowrap">Artists</span>
      </div>
      <div class="px-2 sm:px-3">
        <span class="block text-2xl font-bold text-purple-400 tracking-tight">{$profileStats.avg}</span>
        <span class="block text-[10px] text-gray-500 uppercase font-bold tracking-tight whitespace-nowrap">Avg</span>
      </div>
    </div>
  </section>

  <FavoritesGrid {favs} canEdit={$isOwnProfile} onSlotClick={onFavSlot} />
</div>
