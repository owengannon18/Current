<script>
  export let size = 'md'; // sm | md | lg
  const scales = { sm: 'w-6 h-6', md: 'w-9 h-9', lg: 'w-12 h-12' };
  const text   = { sm: 'text-xs',  md: 'text-sm',  lg: 'text-xl'  };
</script>

<div class="flex items-center gap-3 select-none">
  <div class="{scales[size]} flex-shrink-0">
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stop-color="#9333ea"/>
          <stop offset="1" stop-color="#4338ca"/>
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="36" height="36" rx="9" fill="url(#logo-bg)"/>

      <!-- Disc outer fill (subtle) -->
      <circle cx="18" cy="18" r="12" fill="white" fill-opacity="0.08"/>
      <!-- Disc outer ring -->
      <circle cx="18" cy="18" r="12" stroke="white" stroke-width="2" stroke-opacity="0.9"/>
      <!-- Groove ring -->
      <circle cx="18" cy="18" r="7" stroke="white" stroke-width="0.9" stroke-opacity="0.3"/>
      <!-- Center label -->
      <circle cx="18" cy="18" r="3.5" fill="white"/>
      <!-- Center hole -->
      <circle cx="18" cy="18" r="1.2" fill="url(#logo-bg)"/>
    </svg>
  </div>

  <!-- Wordmark -->
  <span class="{text[size]} leading-none tracking-widest uppercase">
    <span class="text-white font-bold">discogd</span>
  </span>
</div>
