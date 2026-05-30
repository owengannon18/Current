<script>
  import { cn } from '$lib/utils.js';

  export let type  = 'text';
  export let value = '';
  export let placeholder = '';
  export let id    = undefined;
  export let disabled = false;
  let className = '';
  export { className as class };

  $: cls = cn(
    'flex h-9 w-full rounded-md border border-gray-800 bg-gray-900 px-3 py-1 text-sm text-white placeholder:text-gray-600',
    'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
    'disabled:cursor-not-allowed disabled:opacity-50 transition',
    className
  );
</script>

<input
  {id}
  {type}
  {placeholder}
  {disabled}
  bind:value
  class={cls}
  on:change
  on:input
  on:keydown
  on:focus
  on:blur
  {...$$restProps}
/>
