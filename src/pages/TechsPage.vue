<script setup lang="ts">
import { gsap } from 'gsap';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useRoute, useRouter } from 'vue-router';

import { DEFAULT_TECH_ID, techs } from '@/data/techs';
import TerminalStatusLine from '@/components/TerminalStatusLine.vue';
import TerminalWindow from '@/components/TerminalWindow.vue';

import type { Tech } from '@/data/techs';

type LineKind = 'h1' | 'blank' | 'quote' | 'text' | 'h2' | 'item';

type Line = {
  kind: LineKind;
  text: string;
};

const route = useRoute();
const router = useRouter();

const fileList = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);

gsap.registerPlugin(ScrollToPlugin);

// The URL decides which file is open, so a shared link opens the same file.
const activeTech = computed<Tech>(() => {
  const id = route.query.tech;
  return (
    techs.find((tech) => tech.id === id) ??
    techs.find((tech) => tech.id === DEFAULT_TECH_ID) ??
    techs[0]
  );
});

// The file that holds the list's single tab stop. Arrow keys move it;
// only Enter or a click opens the file.
const focusedId = ref(activeTech.value.id);

watch(activeTech, (tech) => {
  focusedId.value = tech.id;
});

const lines = computed<Line[]>(() => {
  const tech = activeTech.value;
  return [
    { kind: 'h1', text: tech.name },
    { kind: 'blank', text: '' },
    { kind: 'quote', text: tech.tagline },
    { kind: 'blank', text: '' },
    ...tech.description.map((text): Line => ({ kind: 'text', text })),
    { kind: 'blank', text: '' },
    { kind: 'h2', text: 'Day to day' },
    ...tech.daily.map((text): Line => ({ kind: 'item', text })),
  ];
});

function openFile(tech: Tech) {
  if (tech.id === activeTech.value.id) return;
  router.replace({ query: { ...route.query, tech: tech.id } });
}

function moveFocus(step: number) {
  const index = techs.findIndex((tech) => tech.id === focusedId.value);
  const next = (index + step + techs.length) % techs.length;
  const nextTech = techs[next];
  if (!nextTech) return;

  focusedId.value = nextTech.id;
  fileList.value?.querySelectorAll('button')[next]?.focus();
}

function onListKeydown(event: KeyboardEvent) {
  if (event.altKey || event.ctrlKey || event.metaKey) return;

  switch (event.key) {
    case 'ArrowDown':
    case 'ArrowRight':
    case 'j':
      moveFocus(1);
      break;
    case 'ArrowUp':
    case 'ArrowLeft':
    case 'k':
      moveFocus(-1);
      break;
    default:
      return;
  }
  event.preventDefault();
}

// Bring the new file's lines in one after another, like a buffer loading.
function animateLines() {
  if (!content.value) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const rows = content.value.querySelectorAll('[data-line]');
  // Opacity only, so screen readers still get every line from the live region.
  gsap.fromTo(
    rows,
    { opacity: 0, x: -6 },
    {
      opacity: 1,
      x: 0,
      duration: 0.12,
      ease: 'power1.out',
      stagger: 0.24 / rows.length,
      overwrite: true,
    },
  );
}

// On phones the files are a sideways row; keep the open one in view.
// Scrolls the row only, never the page.
function revealActiveFile() {
  const list = fileList.value;
  const active = list?.querySelector<HTMLElement>('[aria-current="true"]');
  if (!list || !active) return;

  list.scrollTo({
    left: active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2,
  });
}

watch(activeTech, async () => {
  await nextTick();
  animateLines();
  revealActiveFile();
});

onMounted(() => {
  gsap.from('.techs-title', {
    opacity: 0,
    y: -100,
    duration: 0.5,
  });
  animateLines();
  revealActiveFile();
});

function scrollToTop() {
  gsap.to(window, {
    duration: 1,
    ease: 'power2.inOut',
    scrollTo: {
      y: 0,
      offsetY: 0,
      autoKill: false,
    },
  });
}

</script>

<template>

  <div class="mx-auto w-full max-w-300 mb-16 px-4 sm:px-6">

    <h1 class="techs-title py-10 font-semibold text-3xl sm:text-4xl pb-10 bg-linear-180 from-ctp-blue to-ctp-green bg-clip-text text-transparent text-center">
      Technologies
    </h1>

    <p class="max-w-200 text-lg text-gray-500 mx-auto px-6 pb-14 text-center leading-relaxed">
      I don't claim to know everything, and I don't think anyone in this field does. What I do have is a habit of learning things properly, from the fundamentals up. When a new tool appears, I can usually see what problem it solves and where it fits. Frameworks change every few years. The basics stay the same.
    </p>

    <TerminalWindow title="~/danila/techs — nvim" center-title class="mx-auto max-w-280">
      <div class="grid font-mono md:grid-cols-[14rem_1fr]">

        <nav aria-label="Technology files" class="min-w-0 bg-ctp-mantle md:py-4">
          <p aria-hidden="true" class="hidden px-5 pb-3 text-ctp-subtext0 md:block">
            <span class="mr-2 text-xs">▾</span>techs/
          </p>
          <ul
            ref="fileList"
            class="relative flex gap-1 overflow-x-auto p-2 md:flex-col md:overflow-visible md:py-0"
            @keydown="onListKeydown"
          >
            <li v-for="tech in techs" :key="tech.id" class="shrink-0">
              <button
                type="button"
                :tabindex="tech.id === focusedId ? 0 : -1"
                :aria-current="tech.id === activeTech.id ? 'true' : undefined"
                class="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2
                text-left text-sm whitespace-nowrap transition-colors duration-200
                focus-visible:outline-2 focus-visible:outline-ctp-mauve sm:text-base md:px-4"
                :class="tech.id === activeTech.id
                  ? 'bg-ctp-surface0 text-ctp-text'
                  : 'text-ctp-subtext0 hover:bg-ctp-surface0/50 hover:text-ctp-text'"
                @click="openFile(tech)"
                @focus="focusedId = tech.id"
              >
                <span aria-hidden="true" class="size-2.5 shrink-0 rounded-xs" :class="tech.color"></span>
                {{ tech.file }}
              </button>
            </li>
          </ul>
        </nav>

        <div class="flex min-w-0 flex-col md:min-h-120">
          <div class="flex bg-ctp-mantle">
            <span class="bg-ctp-base px-5 py-3 text-sm text-ctp-text sm:text-base">
              {{ activeTech.file }}
            </span>
          </div>

          <div
            ref="content"
            aria-live="polite"
            class="flex-1 px-3 py-5 text-sm leading-7 sm:px-5 sm:text-base sm:leading-8"
          >
            <div
              v-for="(line, index) in lines"
              :key="`${activeTech.id}-${index}`"
              data-line
              class="grid grid-cols-[2rem_1fr] gap-x-3 sm:grid-cols-[2.5rem_1fr] sm:gap-x-5"
            >
              <span aria-hidden="true" class="text-right text-ctp-overlay2 select-none">{{ index + 1 }}</span>

              <h2 v-if="line.kind === 'h1'" class="font-bold text-ctp-maroon">
                <span aria-hidden="true"># </span>{{ line.text }}
              </h2>
              <p v-else-if="line.kind === 'quote'" class="text-ctp-subtext0 italic">
                <span aria-hidden="true">&gt; </span>{{ line.text }}
              </p>
              <p v-else-if="line.kind === 'text'" class="wrap-break-word">{{ line.text }}</p>
              <h3 v-else-if="line.kind === 'h2'" class="font-bold text-ctp-teal">
                <span aria-hidden="true">## </span>{{ line.text }}
              </h3>
              <p v-else-if="line.kind === 'item'" class="wrap-break-word">
                <span aria-hidden="true" class="text-ctp-yellow">- </span>{{ line.text }}
              </p>
              <span v-else aria-hidden="true">&nbsp;</span>
            </div>
          </div>

          <TerminalStatusLine>
            <span class="bg-ctp-mauve px-3 py-1.5 font-bold text-ctp-crust">NORMAL</span>
            <span class="truncate text-ctp-text">{{ activeTech.file }}</span>
            <template #end>markdown · utf-8 · {{ lines.length }}:1</template>
          </TerminalStatusLine>
        </div>

      </div>
    </TerminalWindow>

      <button
        type="button"
        aria-label="Scroll to Top"
        class="group relative flex size-12 -translate-x-1/2
        cursor-pointer items-center justify-center text-gray-500 py-20 mx-auto"
        @click="scrollToTop"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-10 transition-transform duration-300 group-hover:-translate-y-2
          motion-reduce:transition-none"
        >
          <path
            d="M12 8v12"
            class="origin-top transform-fill scale-y-0 opacity-0
            transition-[scale,opacity] duration-300
            group-hover:scale-y-100 group-hover:opacity-100
            motion-reduce:transition-none"
          />
          <path d="m5 15 7-7 7 7" />
        </svg>
      </button>

  </div>

</template>
