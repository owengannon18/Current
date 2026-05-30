<script>
  import Dialog from '$lib/components/ui/dialog.svelte';
  import Button from '$lib/components/ui/button.svelte';
  import Input  from '$lib/components/ui/input.svelte';
  import Label  from '$lib/components/ui/label.svelte';

  export let onSave  = (name) => {};
  export let onClose = () => {};

  let name = '';
  let open = true;

  function submit() {
    if (!name.trim()) return;
    onSave(name.trim());
    name = '';
  }

  function handleKey(e) {
    if (e.key === 'Enter') submit();
  }

  function handleOpenChange(v) {
    if (!v) onClose();
  }
</script>

<Dialog {open} onOpenChange={handleOpenChange}>
  <h3 class="text-lg font-bold text-white mb-4">Add New Artist Profile</h3>
  <div class="space-y-4">
    <div class="space-y-1.5">
      <Label for_="artist-name-input">Artist Name</Label>
      <Input
        id="artist-name-input"
        bind:value={name}
        placeholder="e.g., boygenius"
        on:keydown={handleKey}
      />
    </div>
    <div class="flex justify-end gap-2">
      <Button variant="ghost" size="sm" on:click={onClose}>Cancel</Button>
      <Button size="sm" on:click={submit}>Save Artist</Button>
    </div>
  </div>
</Dialog>
