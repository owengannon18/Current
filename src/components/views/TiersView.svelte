<script>
  import { ratingLabels } from '$lib/constants.js';

  export let musicCache = {};
  export let onBack = () => {};

  // Group artists into tiers based on their average track rating
  $: tiers = (() => {
    const result = ratingLabels.map(l => ({ ...l, artists: [] }));

    for (const [artistName, albs] of Object.entries(musicCache)) {
      let totalTracks = 0, totalRating = 0;
      for (const a of albs) {
        for (const t of a.tracks) { totalRating += t.rating; totalTracks++; }
      }
      if (!totalTracks) continue;
      const avg = totalRating / totalTracks;
      const tier = ratingLabels.find(l => avg >= l.val);
      if (tier) {
        const match = result.find(r => r.val === tier.val);
        if (match) match.artists.push({ name: artistName, avg: avg.toFixed(2), albums: albs.length });
      }
    }
    return result.filter(t => t.artists.length > 0);
  })();
</script>

<div class="space-y-6">
  <div class="flex items-center gap-3 mb-6">
    <button onclick={onBack} class="text-xs font-bold bg-gray-900 border border-gray-800 px-3 py-1.5 rounded text-gray-400 hover:text-white">← Back</button>
    <h2 class="text-xl font-bold text-white">Artist Tier Breakdown Matrix</h2>
  </div>

  {#if tiers.length === 0}
    <p class="text-center text-gray-600 py-12">No rated artists yet.</p>
  {:else}
    <div class="space-y-4">
      {#each tiers as tier}
        <div class="bg-gray-950 border border-gray-900 rounded-xl p-4">
          <div class="flex items-center gap-3 mb-3">
            <span class="px-3 py-1 rounded-lg border font-black text-sm {tier.bg}">{tier.label}</span>
            <span class="text-xs text-gray-500 font-mono">{tier.val.toFixed(1)}+</span>
          </div>
          <div class="flex flex-wrap gap-2">
            {#each tier.artists as a}
              <div class="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs">
                <div class="font-bold text-white">{a.name}</div>
                <div class="text-gray-500 text-[10px]">avg {a.avg} · {a.albums} album{a.albums !== 1 ? 's' : ''}</div>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
