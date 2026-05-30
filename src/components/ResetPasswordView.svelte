<script>
  import Button from '$lib/components/ui/button.svelte';
  import Input  from '$lib/components/ui/input.svelte';
  import Label  from '$lib/components/ui/label.svelte';
  import Card   from '$lib/components/ui/card.svelte';
  import Logo   from './Logo.svelte';
  import { Eye, EyeOff } from 'lucide-svelte';

  export let onSave   = (password) => {};  // called with the new password
  export let onCancel = () => {};

  let password        = '';
  let confirmPassword = '';
  let showPassword    = false;
  let loading         = false;
  let error           = '';
  let success         = false;

  async function submit() {
    error = '';
    if (!password || !confirmPassword) { error = 'Please fill in both fields.'; return; }
    if (password.length < 6) { error = 'Password must be at least 6 characters.'; return; }
    if (password !== confirmPassword) { error = 'Passwords do not match.'; return; }
    loading = true;
    try {
      await onSave(password);
      success = true;
    } catch (e) {
      error = e.message;
    } finally {
      loading = false;
    }
  }

  function handleKey(e) { if (e.key === 'Enter') submit(); }
</script>

<div class="min-h-screen flex flex-col items-center justify-center px-6" style="background: #06080c;">

  <div class="mb-8">
    <Logo size="lg" />
  </div>

  <Card class="w-full max-w-sm p-6 text-left">
    {#if success}
      <div class="text-center py-4">
        <div class="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 13l4 4L19 7" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2 class="text-white font-bold text-base mb-2">Password updated</h2>
        <p class="text-gray-500 text-xs mb-5">Your password has been changed successfully.</p>
        <Button on:click={onCancel} class="w-full">Continue to App</Button>
      </div>

    {:else}
      <h2 class="text-white font-bold text-base mb-1">Set a new password</h2>
      <p class="text-gray-500 text-xs mb-5">Choose a strong password for your account.</p>

      <div class="space-y-3">
        <div class="space-y-1.5">
          <Label for_="new-password">New password</Label>
          <div class="relative">
            <Input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              bind:value={password}
              on:keydown={handleKey}
              placeholder="••••••••"
              class="pr-9"
              disabled={loading}
            />
            <button
              type="button"
              onclick={() => showPassword = !showPassword}
              class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
              tabindex="-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {#if showPassword}<EyeOff size={15} />{:else}<Eye size={15} />{/if}
            </button>
          </div>
        </div>

        <div class="space-y-1.5">
          <Label for_="confirm-password">Confirm password</Label>
          <Input
            id="confirm-password"
            type={showPassword ? 'text' : 'password'}
            bind:value={confirmPassword}
            on:keydown={handleKey}
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        {#if error}
          <p class="text-red-400 text-xs font-bold">{error}</p>
        {/if}

        <Button on:click={submit} disabled={loading} class="w-full mt-1">
          {loading ? 'Saving…' : 'Update Password'}
        </Button>
      </div>
    {/if}
  </Card>
</div>
