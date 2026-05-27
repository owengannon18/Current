<script>
  import { cn } from '$lib/utils.js';

  export let for_ = undefined; // use for_ to avoid reserved keyword
  let className = '';
  export { className as class };

  $: cls = cn('text-[10px] font-bold uppercase tracking-wider text-gray-500', className);
</script>

<label for={for_} class={cls}>
  <slot />
</label>
