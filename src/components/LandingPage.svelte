<script>
  import { community } from '$lib/stores/app.js';

  export let onSignIn    = (email, password) => {};
  export let onSignUp    = (email, password) => {};
  export let onBrowse    = (userId) => {};

  let mode     = 'signin'; // 'signin' | 'signup'
  let email    = '';
  let password = '';
  let loading  = false;
  let error    = '';

  async function submit() {
    if (!email || !password) { error = 'Please fill in both fields.'; return; }
    loading = true; error = '';
    try {
      if (mode === 'signin') await onSignIn(email, password);
      else await onSignUp(email, password);
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  function handleKey(e) { if (e.key === 'Enter') submit(); }
</script>

<div class="min-h-screen flex flex-col" style="background: #06080c;">

  <!-- Nav bar -->
  <header class="flex items-center justify-between px-8 py-5 border-b border-white/5">
    <div class="flex items-center gap-3">
      <div class="bg-gradient-to-tr from-purple-600 to-indigo-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-extrabold text-sm">M</div>
      <span class="text-white font-bold tracking-widest text-sm uppercase">MusicBoxd</span>
    </div>
    <div class="flex items-center gap-2">
      <button
        onclick={() => { mode = 'signin'; document.getElementById('auth-form')?.scrollIntoView({ behavior: 'smooth' }); }}
        class="text-gray-400 hover:text-white text-sm font-bold transition px-4 py-2"
      >Sign In</button>
      <button
        onclick={() => { mode = 'signup'; document.getElementById('auth-form')?.scrollIntoView({ behavior: 'smooth' }); }}
        class="bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold transition px-4 py-2 rounded-lg"
      >Sign Up Free</button>
    </div>
  </header>

  <!-- Hero -->
  <section class="flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
    <div class="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8">
      Track · Rate · Share
    </div>

    <h1 class="text-5xl sm:text-7xl font-black text-white tracking-tight leading-none mb-6">
      Rate every<br />
      <span class="bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">track.</span>
    </h1>
    <p class="text-gray-400 text-lg sm:text-xl max-w-md leading-relaxed mb-10">
      Build your music archive, score albums track by track, and see how your taste stacks up against the community.
    </p>

    <!-- Auth card -->
    <div id="auth-form" class="w-full max-w-sm bg-gray-950 border border-gray-800 rounded-2xl p-6 shadow-2xl text-left">

      <!-- Mode toggle -->
      <div class="flex bg-gray-900 rounded-xl p-1 mb-5">
        <button
          onclick={() => { mode = 'signin'; error = ''; }}
          class="flex-1 py-2 text-xs font-bold rounded-lg transition {mode === 'signin' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}"
        >Sign In</button>
        <button
          onclick={() => { mode = 'signup'; error = ''; }}
          class="flex-1 py-2 text-xs font-bold rounded-lg transition {mode === 'signup' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}"
        >Create Account</button>
      </div>

      <div class="space-y-3">
        <div>
          <label for="landing-email" class="block text-[10px] font-bold uppercase text-gray-500 mb-1 tracking-wider">Email</label>
          <input
            id="landing-email"
            type="email"
            bind:value={email}
            onkeydown={handleKey}
            placeholder="you@example.com"
            class="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition"
          />
        </div>
        <div>
          <label for="landing-password" class="block text-[10px] font-bold uppercase text-gray-500 mb-1 tracking-wider">Password</label>
          <input
            id="landing-password"
            type="password"
            bind:value={password}
            onkeydown={handleKey}
            placeholder="••••••••"
            class="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        {#if error}
          <p class="text-red-400 text-xs font-bold">{error}</p>
        {/if}

        <button
          onclick={submit}
          disabled={loading}
          class="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-lg text-sm transition mt-1"
        >
          {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
        </button>

        {#if mode === 'signup'}
          <p class="text-[10px] text-gray-600 text-center">
            By signing up you agree to rate at least one album.
          </p>
        {/if}
      </div>
    </div>
  </section>

  <!-- Community section -->
  {#if $community.length > 0}
    <section class="px-6 pb-24 max-w-4xl mx-auto w-full">
      <div class="flex items-center gap-4 mb-6">
        <div class="h-px flex-grow bg-gray-800"></div>
        <span class="text-xs font-black uppercase tracking-widest text-gray-500">or browse the community</span>
        <div class="h-px flex-grow bg-gray-800"></div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {#each $community as profile}
          <button
            onclick={() => onBrowse(profile.user_id)}
            class="group flex items-center gap-3 bg-gray-950 hover:bg-gray-900 border border-gray-800 hover:border-purple-500/50 rounded-xl px-4 py-3.5 text-left transition"
          >
            <div class="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white font-black text-sm bg-gradient-to-br from-purple-600 to-indigo-600">
              {profile.email[0].toUpperCase()}
            </div>
            <div class="min-w-0">
              <div class="font-bold text-white text-sm truncate">{profile.email.split('@')[0]}</div>
              <div class="text-gray-600 text-[10px] truncate">{profile.email}</div>
            </div>
            <div class="ml-auto text-gray-700 group-hover:text-purple-400 transition text-lg">→</div>
          </button>
        {/each}
      </div>
    </section>
  {:else}
    <!-- No community yet — simple CTA -->
    <section class="pb-24 text-center">
      <p class="text-gray-700 text-sm">Be the first to create a public archive.</p>
    </section>
  {/if}

  <!-- Footer -->
  <footer class="mt-auto border-t border-white/5 px-8 py-5 flex items-center justify-between text-[11px] text-gray-700">
    <span>MusicBoxd</span>
    <span>Built with Svelte · Supabase · Spotify</span>
  </footer>

</div>
