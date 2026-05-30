<script>
  import Button from '$lib/components/ui/button.svelte';

  export let musicCache = {};
  export let onBack = () => {};

  // Build yearly summary: best album & best track per year
  $: yearlyData = (() => {
    const years = {};
    for (const albs of Object.values(musicCache)) {
      for (const alb of albs) {
        if (!years[alb.year]) years[alb.year] = { albums: [], tracks: [] };
        years[alb.year].albums.push(alb);
        for (const t of alb.tracks) {
          years[alb.year].tracks.push({ ...t, albumName: alb.albumName, artist: alb.artist });
        }
      }
    }
    return Object.entries(years)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, { albums, tracks }]) => {
        const aoty = albums.sort((a, b) => b.officialRating - a.officialRating)[0];
        const soty = tracks.sort((a, b) => b.rating - a.rating)[0];
        const honorable = albums.slice(1, 4);
        return { year, aoty, soty, honorable };
      });
  })();
</script>

<div class="space-y-6">
  <div class="flex items-center gap-3 mb-6">
    <Button variant="outline" size="sm" on:click={onBack}>← Back</Button>
    <h2 class="text-xl font-bold text-white">Chronological Yearly Highlights</h2>
  </div>

  <div class="overflow-x-auto bg-gray-950 border border-gray-900 rounded-xl">
    <table class="w-full text-left text-sm border-collapse">
      <thead>
        <tr class="bg-gray-900/50 text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-800">
          <th class="p-4 w-24">Year</th>
          <th class="p-4">Album of the Year</th>
          <th class="p-4">Song of the Year</th>
          <th class="p-4">Honorable Mentions</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-900 text-gray-300">
        {#each yearlyData as row}
          <tr class="hover:bg-gray-900/20 transition">
            <td class="p-4 font-mono font-bold text-white">{row.year}</td>
            <td class="p-4">
              {#if row.aoty}
                <div class="flex items-center gap-3">
                  {#if row.aoty.artworkUrl}
                    <img src={row.aoty.artworkUrl} alt="" class="w-10 h-10 rounded object-cover border border-gray-800 flex-shrink-0" />
                  {/if}
                  <div>
                    <div class="font-bold text-white text-xs">{row.aoty.albumName}</div>
                    <div class="text-gray-500 text-[10px]">{row.aoty.artist} · {row.aoty.officialRating.toFixed(1)}</div>
                  </div>
                </div>
              {:else}
                <span class="text-gray-600">—</span>
              {/if}
            </td>
            <td class="p-4">
              {#if row.soty}
                <div class="font-bold text-white text-xs">{row.soty.title}</div>
                <div class="text-gray-500 text-[10px]">{row.soty.albumName} · {row.soty.rating.toFixed(1)}</div>
              {:else}
                <span class="text-gray-600">—</span>
              {/if}
            </td>
            <td class="p-4 text-xs text-gray-400">
              {row.honorable.map(a => a.albumName).join(', ') || '—'}
            </td>
          </tr>
        {/each}
        {#if yearlyData.length === 0}
          <tr><td colspan="4" class="p-8 text-center text-gray-600">No rated albums yet.</td></tr>
        {/if}
      </tbody>
    </table>
  </div>
</div>
