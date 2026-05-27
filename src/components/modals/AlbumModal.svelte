<script>
  import * as spotify from '$lib/services/spotify.js';

  export let onSave  = (albumData) => {};
  export let onClose = () => {};

  let title       = '';
  let year        = '';
  let rating      = 0.0;
  let artworkUrl  = '';
  let tracksText  = '';

  let spotifyLinked   = spotify.isLinked();
  let spotifyQuery    = '';
  let spotifyResults  = [];
  let spotifyStatus   = ''; // 'searching' | 'done' | 'error' | ''

  async function connectSpotify() {
    try { await spotify.connect(); } catch (e) { alert(e.message); }
  }

  async function searchSpotify() {
    if (!spotifyQuery.trim()) return;
    spotifyStatus = 'searching';
    spotifyResults = [];
    try {
      spotifyResults = await spotify.searchAlbums(spotifyQuery);
      spotifyStatus = 'done';
    } catch (e) {
      if (e.message === 'TOKEN_EXPIRED') { spotifyLinked = false; await spotify.connect(); }
      else { spotifyStatus = 'error'; }
    }
  }

  async function autofill(id) {
    try {
      const alb = await spotify.getAlbum(id);
      title      = alb.name;
      year       = alb.release_date ? alb.release_date.split('-')[0] : '';
      artworkUrl = alb.images?.[0]?.url ?? '';
      tracksText = alb.tracks?.items?.map(t => t.name).join('\n') ?? '';
      spotifyResults  = [];
      spotifyStatus   = 'filled';
    } catch (e) { alert(e.message); }
  }

  function submit() {
    if (!title.trim() || !year.trim()) { alert('Title and year are required.'); return; }
    const tracks = tracksText.split('\n').filter(l => l.trim()).map((l, i) => ({
      num: i + 1, title: l.trim(), rating: 0.0
    }));
    onSave({ title: title.trim(), year: year.trim(), rating: parseFloat(rating) || 0, artworkUrl: artworkUrl.trim(), tracks });
    reset();
  }

  function reset() {
    title = ''; year = ''; rating = 0.0; artworkUrl = ''; tracksText = '';
    spotifyQuery = ''; spotifyResults = []; spotifyStatus = '';
  }
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
  <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
    <div class="flex justify-between items-center border-b border-gray-800 pb-2">
      <h3 class="text-lg font-bold text-white">Create Album Record Entry</h3>
      <button onclick={onClose} class="text-gray-400 hover:text-white text-sm">✕</button>
    </div>

    <!-- Spotify panel -->
    <div class="bg-gray-950 p-3.5 rounded-xl border border-gray-800/80 space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-black tracking-wider text-purple-400 flex items-center gap-1.5">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-.982-.336.075-.668-.135-.744-.47-.075-.336.134-.668.47-.744 3.856-.88 7.15-.503 9.822 1.13.295.178.387.563.206.86zm1.224-2.72c-.226.367-.706.487-1.073.262-2.72-1.672-6.866-2.154-10.074-1.18-.413.125-.847-.107-.972-.52-.125-.413.107-.847.52-.972 3.666-1.112 8.232-.573 11.338 1.34.367.225.487.706.262 1.072zm.107-2.828C14.316 8.71 8.44 8.517 5.05 9.544c-.52.157-1.07-.143-1.227-.664-.158-.52.143-1.07.664-1.228 3.89-1.18 10.38-.954 14.512 1.5.367.225.487.706.262 1.072z"/></svg>
          SPOTIFY AUTOFILL
        </span>
        {#if spotifyLinked}
          <span class="bg-purple-950/40 text-purple-400 border border-purple-900 px-2 py-0.5 rounded text-[10px] font-bold">✓ Linked</span>
        {:else}
          <button onclick={connectSpotify} class="bg-gray-900 border border-gray-800 text-gray-300 px-2 py-0.5 rounded text-[10px] font-bold hover:text-white hover:border-purple-500 transition">Connect Spotify</button>
        {/if}
      </div>

      {#if spotifyLinked}
        <div class="flex gap-2">
          <input
            type="text"
            bind:value={spotifyQuery}
            placeholder="Search album title..."
            onkeydown={(e) => e.key === 'Enter' && searchSpotify()}
            class="flex-grow bg-gray-900 border border-gray-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
          />
          <button onclick={searchSpotify} class="bg-purple-600 text-white font-bold px-3 py-1 rounded text-xs hover:bg-purple-500 transition">Find</button>
        </div>

        <div class="divide-y divide-gray-900 max-h-40 overflow-y-auto rounded text-xs">
          {#if spotifyStatus === 'searching'}
            <div class="p-2 text-gray-500 text-center italic">Searching Spotify...</div>
          {:else if spotifyStatus === 'filled'}
            <div class="p-1 text-green-400 text-center font-bold">✓ Autofilled from Spotify!</div>
          {:else if spotifyStatus === 'error'}
            <div class="p-2 text-red-400 text-center">Search failed.</div>
          {:else}
            {#each spotifyResults as alb}
              {@const img = alb.images?.at(-1)?.url}
              <button type="button" onclick={() => autofill(alb.id)} class="flex items-center gap-3 p-1.5 hover:bg-gray-900 cursor-pointer w-full text-left">
                {#if img}<img src={img} alt="" class="w-8 h-8 rounded border border-gray-800 object-cover flex-shrink-0" />{/if}
                <div class="truncate flex-grow">
                  <span class="block text-white font-bold truncate">{alb.name}</span>
                  <span class="block text-[10px] text-gray-500 truncate">{alb.artists[0]?.name} · {alb.release_date?.split('-')[0]}</span>
                </div>
                <span class="text-[10px] text-purple-500 font-bold px-1.5 bg-purple-500/10 rounded">Select</span>
              </button>
            {/each}
          {/if}
        </div>
      {/if}
    </div>

    <!-- Form fields -->
    <div class="grid grid-cols-2 gap-3 pt-2">
      <div class="col-span-2">
        <label for="alb-title" class="block text-xs font-bold uppercase text-gray-500 mb-1">Album Title</label>
        <input id="alb-title" type="text" bind:value={title} placeholder="e.g., the record" class="w-full bg-gray-950 border border-gray-800 rounded p-2 text-sm text-white focus:outline-none" />
      </div>
      <div>
        <label for="alb-year" class="block text-xs font-bold uppercase text-gray-500 mb-1">Release Year</label>
        <input id="alb-year" type="number" bind:value={year} placeholder="2023" class="w-full bg-gray-950 border border-gray-800 rounded p-2 text-sm text-white focus:outline-none" />
      </div>
      <div>
        <label for="alb-rating" class="block text-xs font-bold uppercase text-gray-500 mb-1">Initial Rating (0–5)</label>
        <input id="alb-rating" type="number" step="0.1" bind:value={rating} class="w-full bg-gray-950 border border-gray-800 rounded p-2 text-sm text-white focus:outline-none" />
      </div>
      <div class="col-span-2">
        <label for="alb-artwork" class="block text-xs font-bold uppercase text-gray-500 mb-1">Artwork URL (Optional)</label>
        <input id="alb-artwork" type="text" bind:value={artworkUrl} placeholder="https://..." class="w-full bg-gray-950 border border-gray-800 rounded p-2 text-sm text-white focus:outline-none" />
      </div>
    </div>
    <div>
      <label for="alb-tracks" class="block text-xs font-bold uppercase text-gray-500 mb-1">Track List (one per line)</label>
      <textarea id="alb-tracks" bind:value={tracksText} rows="5" placeholder="Track Name 1&#10;Track Name 2" class="w-full bg-gray-950 border border-gray-800 rounded p-2 text-sm text-white focus:outline-none font-sans"></textarea>
    </div>

    <div class="flex justify-end gap-2 text-xs font-bold pt-2 border-t border-gray-800">
      <button onclick={onClose}  class="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
      <button onclick={submit}   class="bg-purple-600 px-4 py-2 rounded text-white hover:bg-purple-500">Add Album</button>
    </div>
  </div>
</div>
