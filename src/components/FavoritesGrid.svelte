<script>
  export let favs    = [null, null, null, null];
  export let canEdit = false;
  export let onSlotClick = (index) => {};
</script>

<section class="space-y-4">
  <h3 class="text-xs uppercase tracking-widest font-black text-gray-400 border-b border-gray-900 pb-2">favorites</h3>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
    {#each [0, 1, 2, 3] as i}
      {@const fav = favs[i]}
      <button
        type="button"
        class="relative group aspect-square bg-gray-950 border border-dashed border-gray-800 hover:border-purple-500 rounded-xl flex items-center justify-center cursor-pointer transition overflow-hidden w-full"
        onclick={() => canEdit && onSlotClick(i)}
        aria-label="Favorite slot {i + 1}"
      >
        {#if fav?.artworkUrl}
          <img src={fav.artworkUrl} alt="Cover" class="w-full h-full object-cover rounded-xl shadow-md" />
          <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-center p-2 transition">
            <span class="text-white font-black text-xs truncate w-full">{fav.albumName}</span>
            <span class="text-gray-400 text-[10px] truncate w-full">{fav.artist}</span>
          </div>
        {:else}
          <span class="text-2xl text-gray-700 font-light group-hover:text-purple-400 group-hover:scale-110 transition duration-200">+</span>
        {/if}
      </button>
    {/each}
  </div>
</section>
