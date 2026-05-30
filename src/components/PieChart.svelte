<script>
  import { onMount } from 'svelte';
  import { ratingLabels } from '$lib/constants.js';

  export let albums = [];

  let canvas;
  let highlightIndex = null;
  let slices = [];

  $: if (canvas) draw(highlightIndex);
  $: if (albums) { highlightIndex = null; draw(null); }

  function tally() {
    const counts = {};
    ratingLabels.forEach(l => counts[l.val] = 0);
    let total = 0;
    albums.forEach(alb => {
      alb.tracks.forEach(t => {
        const r = Math.round(t.rating * 2) / 2;
        if (counts[r] !== undefined) { counts[r]++; total++; }
      });
    });
    return { counts, total };
  }

  function draw(hiIdx) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 224, 224);
    const { counts, total } = tally();

    if (total === 0) {
      ctx.beginPath(); ctx.arc(112, 112, 100, 0, 2 * Math.PI);
      ctx.fillStyle = '#1e293b'; ctx.fill();
      ctx.fillStyle = '#64748b'; ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center'; ctx.fillText('No Track Data', 112, 116);
      return;
    }

    let start = -Math.PI / 2;
    slices = [];

    ratingLabels.forEach((l, idx) => {
      const count = counts[l.val] || 0;
      if (!count) return;
      const pct = count / total;
      const end = start + pct * 2 * Math.PI;
      slices.push({ start, end, label: l.label, val: l.val, count, idx });

      ctx.beginPath();
      ctx.moveTo(112, 112);
      ctx.arc(112, 112, hiIdx === idx ? 106 : 100, start, end);
      ctx.closePath();
      ctx.fillStyle = l.hex; ctx.fill();
      ctx.lineWidth = 1.5; ctx.strokeStyle = '#06080c'; ctx.stroke();
      start = end;
    });

    ctx.beginPath(); ctx.arc(112, 112, 38, 0, 2 * Math.PI);
    ctx.fillStyle = '#090d16'; ctx.fill();

    if (hiIdx !== null) {
      const s = slices.find(s => s.idx === hiIdx);
      if (s) {
        ctx.fillStyle = 'rgba(4,6,10,0.95)';
        ctx.fillRect(52, 98, 120, 28);
        ctx.strokeStyle = '#4b5563'; ctx.lineWidth = 1;
        ctx.strokeRect(52, 98, 120, 28);
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`[${s.val.toFixed(1)}] ${s.count} Tracks`, 112, 115);
      }
    }
  }

  function onMouseMove(e) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - 112;
    const y = e.clientY - rect.top - 112;
    const dist = Math.sqrt(x * x + y * y);
    if (dist > 100 || dist < 38) { highlightIndex = null; return; }

    let angle = Math.atan2(y, x);
    if (angle < -Math.PI / 2) angle += 2 * Math.PI;
    const hit = slices.find(s => angle >= s.start && angle <= s.end);
    highlightIndex = hit?.idx ?? null;
  }

  function onMouseLeave() { highlightIndex = null; }

  onMount(() => draw(null));
</script>

<div class="w-56 h-56 relative flex items-center justify-center">
  <canvas
    bind:this={canvas}
    width="224" height="224"
    class="max-w-full max-h-full cursor-crosshair"
    onmousemove={onMouseMove}
    onmouseleave={onMouseLeave}
  ></canvas>
</div>

<!-- Rating key table -->
<div class="w-full md:w-64 flex flex-col">
  <div class="border border-gray-800 rounded-lg overflow-hidden bg-gray-900/20 text-xs">
    <div class="grid grid-cols-3 bg-gray-900/80 p-2 font-bold text-gray-400 border-b border-gray-800 text-[10px] uppercase tracking-wider">
      <span>Rating</span><span>Label</span><span class="text-right">Tracks</span>
    </div>
    <div class="divide-y divide-gray-900 max-h-56 overflow-y-auto">
      {#each ratingLabels as l, i}
        {@const count = tally().counts[l.val] || 0}
        <div class="grid grid-cols-3 p-2 items-center transition duration-150 {highlightIndex === i ? 'bg-gray-800 text-white font-bold' : 'text-gray-400'}">
          <span class="font-mono text-[11px] px-1.5 py-0.5 rounded {l.bg} w-max">{l.val.toFixed(1)}</span>
          <span class="text-[10px] tracking-wide text-gray-400 truncate pr-1">{l.label}</span>
          <span class="text-right font-mono font-bold text-gray-300">{count}</span>
        </div>
      {/each}
    </div>
  </div>
</div>
