<script>
  import { cn } from '$lib/utils.js';

  export let orientation = 'horizontal'; // horizontal | vertical
  let className = '';
  export { className as class };

  $: cls = cn(
    'bg-gray-800',
    orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
    className
  );
</script>

<div role="separator" aria-orientation={orientation} class={cls}></div>
