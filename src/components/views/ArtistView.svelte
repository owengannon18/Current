<script>
  import PieChart from '../PieChart.svelte';
  import AlbumCard from '../AlbumCard.svelte';
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

  let editingName = false;
  let nameInput = artistName;
  $: nameInput = artistName;

  function commitRename() {
    editingName = false;
    if (nameInput && nameInput !== artistName) onRename(nameInput);
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-900 pb-4">
    <div class="flex items-center gap-3 w-full sm:w-auto">
      <button onclick={onBack} class="text-xs font-bold bg-gray-900 border border-gray-800 px-3 py-1.5 rounded text-gray-400 hover:text-white flex-shrink-0">← Home Profile</button>
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
        <button onclick={onDeleteArtist} class="bg-red-950 border border-red-800 text-red-400 hover:bg-red-700 hover:text-white text-xs font-bold px-3 py-2 rounded-lg transition">⚠️ Delete Artist</button>
        <button onclick={onAddAlbum}     class="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition">+ Add New Album</button>
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
