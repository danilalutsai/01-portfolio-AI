<!-- The bar along the bottom of a terminal window. The default slot fills the
left side; the `end` slot is pushed right and hidden on narrow screens. -->
<template>
  <div class="flex items-center gap-3 bg-ctp-mantle font-mono text-xs sm:text-sm">
    <slot />
    <span
      v-if="$slots.end"
      class="ml-auto hidden shrink-0 pr-4 text-ctp-subtext0 sm:inline"
    >
      <slot name="end" />
    </span>
  </div>
</template>
