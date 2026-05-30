<script>
  import { currentUser, community, artistNames, isOwnProfile } from '$lib/stores/app.js';
  import Button from '$lib/components/ui/button.svelte';
  import Badge  from '$lib/components/ui/badge.svelte';
  import Logo   from './Logo.svelte';

  export let onGoHome          = () => {};
  export let onSignIn          = (email, password) => {};
  export let onSignUp          = (email, password) => {};
  export let onSignOut         = () => {};
  export let onAddArtist       = () => {};
  export let onSelectArtist    = (name) => {};
  export let onSelectCommunity = (userId) => {};

  function handleCommunityChange(e) {
    const val = e.target.value;
    if (!val) onGoHome();
    else onSelectCommunity(val);
  }

  function handleArtistChange(e) {
    if (e.target.value) onSelectArtist(e.target.value);
  }
</script>

<nav class="flex flex-col md:flex-row items-center justify-between border-b border-gray-800 pb-6 mb-8 gap-4">
  <!-- Logo -->
  <button onclick={onGoHome} class="cursor-pointer flex-shrink-0">
    <Logo />
  </button>

  <!-- Dropdowns -->
  <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto md:flex-1 md:mx-4 min-w-0">
    <select
      onchange={handleCommunityChange}
      class="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-blue-400 focus:outline-none focus:border-blue-500 cursor-pointer w-full min-w-0"
    >
      <option value="">👥 Community Profiles...</option>
      {#each $community as p}
        <option value={p.user_id}>{p.email}</option>
      {/each}
    </select>

    <select
      onchange={handleArtistChange}
      class="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-purple-500 cursor-pointer w-full min-w-0"
    >
      <option value="">🔍 Select an Artist...</option>
      {#each $artistNames as name}
        <option value={name}>{name}</option>
      {/each}
    </select>
  </div>

  <!-- Auth (far right) -->
  <div class="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
    {#if $currentUser}
      <Badge variant="default" class="font-bold">{$currentUser.email}</Badge>
      {#if $isOwnProfile}
        <Button size="sm" on:click={onAddArtist} class="bg-blue-600 hover:bg-blue-500 h-7 text-xs px-3">+ Add Artist</Button>
      {/if}
      <Button variant="ghost" size="sm" on:click={onSignOut} class="text-red-400 hover:text-red-300 h-7 text-xs">Sign Out</Button>
    {:else}
      <Button size="sm" on:click={onGoHome}>Sign In / Register</Button>
    {/if}
  </div>
</nav>
