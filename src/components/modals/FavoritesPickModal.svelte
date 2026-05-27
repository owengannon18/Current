<script>
  export let musicCache = {};
  export let slotIndex  = 0;
  export let onSave     = (artistKey, albumId) => {};
  export let onClear    = () => {};
  export let onClose    = () => {};

  let selectedValue = '';

  $: allOptions = (() => {
    const opts = [];
    for (const [artist, albs] of Object.entries(musicCache)) {
      for (const alb of albs) {
        opts.push({ key: `${artist}||${alb.id}`, label: `${artist} — ${alb.albumName} (${alb.year})` });
      }
    }
    return opts;
  })();

  function submit() {
    if (!selectedValue) { onClose(); return; }
    const [artist, albumId] = selectedValue.split('||');
    onSave(artist, albumId);
  }
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
  <div class="bg-gray-900 border border-gray-800 rounded-xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
    <div class="flex justify-between items-center">
      <h3 class="text-sm font-bold text-white uppercase tracking-wider">Select Favorite Album (Slot {slotIndex + 1})</h3>
      <button onclick={onClose} class="text-gray-400 hover:text-white">✕</button>
    </div>

    <div>
      <label for="fav-picker-select" class="block text-xs font-bold text-gray-500 uppercase mb-1">Reviewed Catalog</label>
      <select id="fav-picker-select" bind:value={selectedValue} class="w-full bg-gray-950 border border-gray-800 rounded p-2 text-xs text-white focus:outline-none focus:border-purple-500">
        <option value="">-- Choose an Album --</option>
        {#each allOptions as opt}
          <option value={opt.key}>{opt.label}</option>
        {/each}
      </select>
      {#if allOptions.length === 0}
        <p class="text-xs text-gray-600 mt-1">No albums found. Add some first.</p>
      {/if}
    </div>

    <div class="flex justify-end gap-2 text-xs font-bold">
      <button onclick={onClear}  class="bg-red-950 border border-red-900 text-red-400 px-3 py-1.5 rounded hover:bg-red-900 transition">Clear Slot</button>
      <button onclick={submit}   class="bg-purple-600 px-4 py-1.5 rounded text-white hover:bg-purple-500 transition">Assign Album</button>
    </div>
  </div>
</div>
