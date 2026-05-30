<script>
  import PieChart from '../PieChart.svelte';
  import AlbumCard from '../AlbumCard.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import { isOwnProfile } from '$lib/stores/app.js';

  export let artistName = '';
  export let albums     = [];
  export let canEdit    = false;

  export let onBack          = () => {};
  export let onRename        = (newName) => {};
  export let onAddAlbum      = () => {};
  export let onDeleteArtist  = () => {};
  export let onUpdateTrack   = (albumId, trackNum, field, value) => {};
  export let onUpdateAlbum   = (albumId, field, value) => {};
  export let onDeleteAlbum   = (albumId) => {};
  export let onMoveUp        = (albumId) => {};
  export let onMoveDown      = (albumId) => {};

  let nameInput = artistName;
  $: nameInput = artistName;

  function commitRename() {
    if (nameInput && nameInput !== artistName) onRename(nameInput);
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-900 pb-4">
    <div class="flex items-center gap-3 w-full sm:w-auto">
      <Button variant="outline" size="sm" on:click={onBack} class="flex-shrink-0">← Home Profile</Button>
      {#if canEdit}
        <input
          type="text"
          bind:value={nameInput}
          onblur={commitRename}
          onkeydown={(e) => e.key === 'Enter' && commitRename()}
          class="bg-transparent border-b border-transparent hover:border-purple-500/50 focus:border-purple-500 font-black text-white text-xl px-1 py-0.5 focus:outline-none transition w-full max-w-sm"
          title="Click to rename artist"
        />
      {:else}
        <h2 class="text-xl font-black text-white">{artistName}</h2>
      {/if}
    </div>

    {#if canEdit}
      <div class="flex items-center gap-2 flex-shrink-0">
        <Button variant="destructive" size="sm" on:click={onDeleteArtist}>⚠️ Delete Artist</Button>
        <Button size="sm" on:click={onAddAlbum}>+ Add New Album</Button>
      </div>
    {/if}
  </div>

  <!-- Summary chart -->
  <div class="max-w-2xl mx-auto bg-gray-950 border border-gray-900 rounded-xl p-6">
    <h5 class="text-xs font-black uppercase tracking-widest text-center text-purple-400 mb-4 border-b border-gray-900 pb-2">Totals</h5>
    <div class="flex flex-col md:flex-row gap-8 items-center justify-center">
      <PieChart {albums} />
    </div>
  </div>

  <!-- Album cards -->
  <div class="space-y-8">
    {#if albums.length === 0}
      <p class="text-sm text-gray-500 py-12 text-center">No albums logged for this artist yet.</p>
    {:else}
      {#each albums as album, i}
        <AlbumCard
          {album}
          {artistName}
          {canEdit}
          index={i}
          total={albums.length}
          {onUpdateTrack}
          {onUpdateAlbum}
          onDelete={onDeleteAlbum}
          {onMoveUp}
          {onMoveDown}
        />
      {/each}
    {/if}
  </div>
</div>
