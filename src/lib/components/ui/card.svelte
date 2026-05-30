<script>
  import { cn } from '$lib/utils.js';

  let className = '';
  export { className as class };

  $: cls = cn('rounded-xl border border-gray-800 bg-gray-950 shadow-2xl', className);
</script>

<div class={cls}>
  <slot />
</div>
