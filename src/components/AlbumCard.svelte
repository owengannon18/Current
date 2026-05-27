<script>
  import { getStyleClass, trackAverage } from '$lib/utils.js';
  import { FALLBACK_ARTWORK } from '$lib/constants.js';

  export let album;
  export const artistName = undefined; // kept for external reference
  export let canEdit = false;
  export let index   = 0;
  export let total   = 1;

  export let onUpdateTrack    = (albumId, trackNum, field, value) => {};
  export let onUpdateAlbum    = (albumId, field, value) => {};
  export let onDelete         = (albumId) => {};
  export let onMoveUp         = (albumId) => {};
  export let onMoveDown       = (albumId) => {};

  $: avg = trackAverage(album.tracks);
</script>

<div class="bg-gray-950 border border-gray-900 rounded-xl p-6 shadow-2xl space-y-6">
  <!-- Header row -->
  <div class="grid grid-cols-1 lg:grid-cols-12 border-b border-gray-900 pb-4 gap-4 items-center">
    <div class="lg:col-span-5 flex flex-col gap-1">
      <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Album Title Name</span>
      {#if canEdit}
        <input
          type="text"
          value={album.albumName}
          onchange={(e) => onUpdateAlbum(album.id, 'albumName', e.target.value)}
          class="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-sm text-white font-black w-full focus:outline-none focus:border-purple-500"
        />
      {:else}
        <span class="text-white text-base font-black">{album.albumName}</span>
      {/if}
    </div>

    <div class="lg:col-span-3 flex flex-col gap-1">
      <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Release Year</span>
      {#if canEdit}
        <input
          type="number"
          value={album.year}
          onchange={(e) => onUpdateAlbum(album.id, 'year', e.target.value)}
          class="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-sm font-mono text-gray-300 font-bold w-full focus:outline-none focus:border-purple-500"
        />
      {:else}
        <span class="text-gray-300 text-sm font-mono">[{album.year}]</span>
      {/if}
    </div>

    {#if canEdit}
      <div class="lg:col-span-4 flex items-center justify-end gap-2">
        <div class="flex items-center gap-1 mr-2 bg-gray-900 border border-gray-800 p-1 rounded-lg">
          <button
            onclick={() => onMoveUp(album.id)}
            disabled={index === 0}
            class="bg-gray-800 hover:bg-gray-700 text-white font-bold p-1 rounded text-xs transition px-2 disabled:opacity-30"
            title="Move Up"
          >🔼</button>
          <button
            onclick={() => onMoveDown(album.id)}
            disabled={index === total - 1}
            class="bg-gray-800 hover:bg-gray-700 text-white font-bold p-1 rounded text-xs transition px-2 disabled:opacity-30"
            title="Move Down"
          >🔽</button>
        </div>
        <button
          onclick={() => onDelete(album.id)}
          class="bg-red-950 border border-red-900 text-red-400 hover:bg-red-600 hover:text-white px-2.5 py-1 rounded text-xs font-bold transition"
        >🗑️ Delete</button>
      </div>
    {/if}
  </div>

  <!-- Content grid -->
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
    <!-- Track list -->
    <div class="md:col-span-7 space-y-2">
      <div class="flex items-center justify-between border-b border-gray-900 pb-1 text-[10px] uppercase tracking-wider font-black text-gray-500">
        <div class="flex gap-4"><span>#</span><span>Track Title</span></div>
        <span class="pr-6">Rating Score</span>
      </div>

      <div class="space-y-1.5">
        {#each album.tracks as t}
          {@const rowClass = getStyleClass(t.rating)}
          <div class="flex items-center justify-between p-2 rounded-lg border transition {rowClass}">
            <div class="flex items-center gap-3 truncate flex-grow mr-2">
              <span class="font-mono text-xs opacity-80 w-4">{t.num}</span>
              {#if canEdit}
                <input
                  type="text"
                  value={t.title}
                  onchange={(e) => onUpdateTrack(album.id, t.num, 'title', e.target.value)}
                  class="bg-transparent border-b border-transparent hover:border-white/20 focus:border-white focus:outline-none text-xs font-bold tracking-wide text-white flex-grow py-0.5"
                />
              {:else}
                <span class="font-semibold text-xs tracking-wide truncate text-white">{t.title}</span>
              {/if}
            </div>
            <div class="flex items-center flex-shrink-0">
              {#if canEdit}
                <input
                  type="number"
                  step="0.5" min="0" max="5"
                  value={t.rating}
                  oninput={(e) => onUpdateTrack(album.id, t.num, 'rating', e.target.value)}
                  class="w-14 bg-black/40 border border-white/20 rounded font-mono text-center text-xs px-1 py-0.5 font-bold text-white focus:outline-none focus:border-white"
                />
              {:else}
                <span class="font-mono font-black px-2 text-xs">{t.rating.toFixed(1)}</span>
              {/if}
            </div>
          </div>
        {/each}
      </div>

      <!-- Averages -->
      <div class="grid grid-cols-2 gap-3 border-t border-gray-900 pt-4">
        <div class="flex items-center gap-2 border px-3 py-1.5 rounded-lg {getStyleClass(album.officialRating)}">
          <span class="text-[9px] uppercase font-black tracking-wider opacity-90">TRACK AVG:</span>
          <span class="text-sm font-mono font-black">{avg.toFixed(4)}</span>
        </div>
        <div class="flex items-center justify-between border px-3 py-1.5 rounded-lg {getStyleClass(album.officialRating)}">
          <span class="text-[9px] uppercase font-black tracking-wider opacity-90">OVERALL:</span>
          {#if canEdit}
            <input
              type="number"
              step="0.1" min="0" max="5"
              value={album.officialRating}
              oninput={(e) => onUpdateAlbum(album.id, 'officialRating', parseFloat(e.target.value))}
              class="w-14 bg-black/30 border border-white/20 rounded font-mono text-center font-black text-xs focus:outline-none focus:border-white"
            />
          {:else}
            <span class="text-sm font-mono font-black">{album.officialRating.toFixed(1)}</span>
          {/if}
        </div>
      </div>
    </div>

    <!-- Artwork panel -->
    <div class="md:col-span-5 flex flex-col bg-gray-900/20 border border-gray-900 rounded-xl p-4 space-y-3">
      <div class="w-full aspect-square rounded-lg overflow-hidden bg-gray-950 border border-gray-800 flex items-center justify-center shadow-inner">
        <img
          src={album.artworkUrl || FALLBACK_ARTWORK}
          alt={album.albumName}
          class="w-full h-full object-cover shadow-2xl"
          onerror={(e) => e.target.src = FALLBACK_ARTWORK}
        />
      </div>
      {#if canEdit}
        <div class="flex flex-col gap-1 w-full">
          <span class="text-[8px] font-mono tracking-widest text-gray-500 uppercase">Artwork Asset URL</span>
          <input
            type="text"
            value={album.artworkUrl || ''}
            placeholder="Paste image link..."
            onchange={(e) => onUpdateAlbum(album.id, 'artworkUrl', e.target.value)}
            class="bg-gray-900 border border-gray-800 rounded px-2 py-1 text-[10px] text-gray-400 font-mono focus:outline-none w-full"
          />
        </div>
      {/if}
    </div>
  </div>
</div>
