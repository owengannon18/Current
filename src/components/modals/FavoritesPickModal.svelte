<script>
  import Dialog from '$lib/components/ui/dialog.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Label  from '$lib/components/ui/label.svelte';

  export let musicCache = {};
  export let slotIndex  = 0;
  export let onSave     = (artistKey, albumId) => {};
  export let onClear    = () => {};
  export let onClose    = () => {};

  let selectedValue = '';
  let open = true;

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

  function handleOpenChange(v) {
    if (!v) onClose();
  }
</script>

<Dialog {open} onOpenChange={handleOpenChange}>
  <div class="flex justify-between items-center mb-4">
    <h3 class="text-sm font-bold text-white uppercase tracking-wider">Select Favorite Album (Slot {slotIndex + 1})</h3>
    <Button variant="ghost" size="icon" on:click={onClose} class="h-7 w-7 text-gray-500">✕</Button>
  </div>

  <div class="space-y-4">
    <div class="space-y-1.5">
      <Label for_="fav-picker-select">Reviewed Catalog</Label>
      <select
        id="fav-picker-select"
        bind:value={selectedValue}
        class="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
      >
        <option value="">-- Choose an Album --</option>
        {#each allOptions as opt}
          <option value={opt.key}>{opt.label}</option>
        {/each}
      </select>
      {#if allOptions.length === 0}
        <p class="text-xs text-gray-600">No albums found. Add some first.</p>
      {/if}
    </div>

    <div class="flex justify-end gap-2">
      <Button variant="destructive" size="sm" on:click={onClear}>Clear Slot</Button>
      <Button size="sm" on:click={submit}>Assign Album</Button>
    </div>
  </div>
</Dialog>
