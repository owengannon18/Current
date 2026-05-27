<script>
  import { cn } from '$lib/utils.js';

  export let variant = 'default'; // default | outline | secondary
  let className = '';
  export { className as class };

  const variants = {
    default:   'bg-purple-600/20 text-purple-300 border-purple-500/30',
    outline:   'border border-gray-700 text-gray-400',
    secondary: 'bg-gray-800 text-gray-300 border-gray-700',
  };

  $: cls = cn(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest transition-colors',
    variants[variant] ?? variants.default,
    className
  );
</script>

<span class={cls}>
  <slot />
</span>
