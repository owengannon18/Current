<script>
  export let onSave  = (name) => {};
  export let onClose = () => {};

  let name = '';

  function submit() {
    if (!name.trim()) return;
    onSave(name.trim());
    name = '';
  }

  function handleKey(e) {
    if (e.key === 'Enter') submit();
    if (e.key === 'Escape') onClose();
  }
</script>

<div role="dialog" aria-modal="true" tabindex="-1" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onkeydown={handleKey}>
  <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
    <h3 class="text-lg font-bold text-white">Add New Artist Profile</h3>
    <div>
      <label for="artist-name-input" class="block text-xs font-bold uppercase text-gray-500 mb-1">Artist Name</label>
      <input
        id="artist-name-input"
        type="text"
        bind:value={name}
        placeholder="e.g., boygenius"
        class="w-full bg-gray-950 border border-gray-800 rounded p-2 text-sm text-white focus:outline-none focus:border-purple-500"
      />
    </div>
    <div class="flex justify-end gap-2 text-xs font-bold">
      <button onclick={onClose}  class="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
      <button onclick={submit}   class="bg-purple-600 px-4 py-2 rounded text-white hover:bg-purple-500">Save Artist</button>
    </div>
  </div>
</div>
