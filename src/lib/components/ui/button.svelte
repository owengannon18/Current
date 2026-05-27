<script>
  import { cn } from '$lib/utils.js';

  export let variant = 'default'; // default | destructive | outline | ghost | link | secondary
  export let size    = 'default'; // default | sm | lg | icon
  export let type    = 'button';
  export let disabled = false;
  let className = '';
  export { className as class };

  const base = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    default:     'bg-purple-600 text-white hover:bg-purple-500',
    destructive: 'bg-red-950 border border-red-900 text-red-400 hover:bg-red-600 hover:text-white',
    outline:     'border border-gray-800 bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white',
    ghost:       'text-gray-400 hover:bg-gray-800 hover:text-white',
    secondary:   'bg-gray-800 text-gray-200 hover:bg-gray-700',
    link:        'text-purple-400 underline-offset-4 hover:underline',
  };

  const sizes = {
    default: 'h-9 px-4 py-2',
    sm:      'h-7 px-3 text-xs',
    lg:      'h-11 px-6',
    icon:    'h-9 w-9',
  };

  $: cls = cn(base, variants[variant] ?? variants.default, sizes[size] ?? sizes.default, className);
</script>

<button {type} {disabled} class={cls} on:click {...$$restProps}>
  <slot />
</button>
