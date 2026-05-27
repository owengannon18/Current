<script>
  import { getStyleClass } from '$lib/utils.js';
  import { FALLBACK_ARTWORK } from '$lib/constants.js';

  export let musicCache = {};
  export let onBack = () => {};

  $: top100 = (() => {
    const all = [];
    for (const albs of Object.values(musicCache)) {
      for (const alb of albs) all.push(alb);
    }
    return all.sort((a, b) => b.officialRating - a.officialRating).slice(0, 100);
  })();
</script>

<div class="space-y-6">
  <div class="flex items-center gap-3 mb-6">
    <button onclick={onBack} class="text-xs font-bold bg-gray-900 border border-gray-800 px-3 py-1.5 rounded text-gray-400 hover:text-white">← Back</button>
    <h2 class="text-xl font-bold text-white">All-Time Rankings</h2>
  </div>

  {#if top100.length === 0}
    <p class="text-center text-gray-600 py-12">No albums rated yet.</p>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each top100 as alb, i}
        <div class="bg-gray-950 border border-gray-900 rounded-xl p-4 flex items-center gap-4 hover:border-gray-700 transition">
          <span class="text-gray-600 font-mono font-bold text-sm w-8 flex-shrink-0">#{i + 1}</span>
          <img
            src={alb.artworkUrl || FALLBACK_ARTWORK}
            alt={alb.albumName}
            class="w-12 h-12 rounded-lg object-cover border border-gray-800 flex-shrink-0"
            onerror={(e) => e.target.src = FALLBACK_ARTWORK}
          />
          <div class="flex-grow min-w-0">
            <div class="font-black text-white text-xs truncate">{alb.albumName}</div>
            <div class="text-gray-500 text-[10px] truncate">{alb.artist} · {alb.year}</div>
          </div>
          <span class="font-mono font-black text-sm px-2 py-1 rounded border {getStyleClass(alb.officialRating)} flex-shrink-0">
            {alb.officialRating.toFixed(1)}
          </span>
        </div>
      {/each}
    </div>
  {/if}
</div>
