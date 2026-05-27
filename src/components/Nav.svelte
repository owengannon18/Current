<script>
  import { currentUser, community, artistNames, isOwnProfile } from '$lib/stores/app.js';
  import Button from '$lib/components/ui/button.svelte';
  import Input  from '$lib/components/ui/input.svelte';
  import Badge  from '$lib/components/ui/badge.svelte';

  export let onGoHome     = () => {};
  export let onSignIn     = (email, password) => {};
  export let onSignUp     = (email, password) => {};
  export let onSignOut    = () => {};
  export let onAddArtist  = () => {};
  export let onSelectArtist   = (name) => {};
  export let onSelectCommunity = (userId) => {};

  let email = '';
  let password = '';

  function handleAuth(mode) {
    if (!email || !password) return;
    if (mode === 'signin') onSignIn(email, password);
    else onSignUp(email, password);
  }

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
  <button onclick={onGoHome} class="flex items-center gap-3 cursor-pointer">
    <div class="bg-gradient-to-tr from-purple-600 to-indigo-600 w-8 h-8 rounded-full flex items-center justify-center text-white font-extrabold text-sm tracking-tighter">M</div>
    <span class="text-white font-bold tracking-wider text-sm uppercase">MusicBoxd</span>
  </button>

  <!-- Auth section -->
  <div class="flex items-center gap-2 bg-gray-950 px-4 py-2 rounded-xl border border-gray-900 text-xs text-gray-400">
    {#if $currentUser}
      <Badge variant="default" class="font-bold">{$currentUser.email}</Badge>
      {#if $isOwnProfile}
        <Button size="sm" on:click={onAddArtist} class="bg-blue-600 hover:bg-blue-500 h-7 text-xs px-3">+ Add Artist</Button>
      {/if}
      <Button variant="ghost" size="sm" on:click={onSignOut} class="text-red-400 hover:text-red-300 h-7 text-xs">Sign Out</Button>
    {:else}
      <Input type="email"    bind:value={email}    placeholder="Enter Email" class="h-7 w-36 text-xs" />
      <Input type="password" bind:value={password} placeholder="Password"   class="h-7 w-36 text-xs" />
      <Button variant="secondary" size="sm" on:click={() => handleAuth('signup')} class="h-7 text-xs px-2.5">Register</Button>
      <Button size="sm" on:click={() => handleAuth('signin')} class="h-7 text-xs px-2.5">Sign In</Button>
    {/if}
  </div>

  <!-- Dropdowns -->
  <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
    <select
      onchange={handleCommunityChange}
      class="bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-blue-400 focus:outline-none focus:border-blue-500 cursor-pointer w-full sm:w-56"
    >
      <option value="">👥 Explore Community Profiles...</option>
      {#each $community as p}
        <option value={p.user_id}>{p.email}</option>
      {/each}
    </select>

    <select
      onchange={handleArtistChange}
      class="bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-purple-500 cursor-pointer w-full sm:w-48"
    >
      <option value="">🔍 Select an Artist...</option>
      {#each $artistNames as name}
        <option value={name}>{name}</option>
      {/each}
    </select>
  </div>
</nav>
