<script setup lang="ts">
// One shell prompt line: `danila@portfolio <path> $ ` followed by the slot,
// which holds the command (plain text, a typed string or a button).
defineProps<{
  path: string;
}>();
</script>

<template>
  <div class="font-mono break-words">
    <!-- Screen readers hear only the command, not the prompt on every line. -->
    <!-- Explicit spaces: Vue trims the whitespace between these tags. -->
    <span aria-hidden="true">
      <span class="text-ctp-green">danila@portfolio</span>{{ ' ' }}
      <span class="text-ctp-blue">{{ path }}</span>{{ ' ' }}
      <span class="text-green-500">$</span>{{ ' ' }}
    </span>
    <slot />
  </div>
</template>
