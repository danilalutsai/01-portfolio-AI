<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';

import { prefersReducedMotion, useTypewriter } from '@/composables/useTypewriter';
import { aboutSession } from '@/data/aboutSession';
import TerminalCursor from '@/components/TerminalCursor.vue';
import TerminalPrompt from '@/components/TerminalPrompt.vue';
import TerminalStatusLine from '@/components/TerminalStatusLine.vue';
import TerminalWindow from '@/components/TerminalWindow.vue';

const PATH = '~/about';
const total = aboutSession.length;

// How many commands have printed their output. It starts at all of them, so
// the first render holds the whole session; the typing only takes over once
// the page has mounted and motion is allowed.
const ran = ref(total);
// The command being typed right now, if any.
const typingIndex = ref<number | null>(null);
const interactive = ref(false);

const output = ref<HTMLElement | null>(null);
const nextButton = ref<HTMLButtonElement | null>(null);

const { typed, type, stop } = useTypewriter();

// Bumped whenever the session is reset, so a command that was still typing
// can tell it is out of date.
let run = 0;

const nextCommand = computed(() =>
  ran.value < total ? aboutSession[ran.value]?.command : 'clear',
);

function isShown(index: number) {
  return index < ran.value || index === typingIndex.value;
}

function reveal(index: number) {
  output.value?.querySelector(`[data-entry="${index}"]`)?.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'nearest',
  });
}

async function runCommand(index: number, fromUser: boolean) {
  const entry = aboutSession[index];
  if (!entry) return;

  const current = run;
  typingIndex.value = index;
  await type(entry.command);
  if (current !== run) return;

  typingIndex.value = null;
  ran.value = index + 1;
  await nextTick();
  reveal(index);
  // Keep keyboard users on the prompt, which re-renders after each command.
  if (fromUser) nextButton.value?.focus({ preventScroll: true });
}

function reset(to: number) {
  run += 1;
  stop();
  typingIndex.value = null;
  ran.value = to;
}

async function onNext() {
  if (ran.value < total) {
    runCommand(ran.value, true);
    return;
  }
  reset(0);
  await nextTick();
  nextButton.value?.focus();
}

function showEverything() {
  reset(total);
}

onMounted(() => {
  if (prefersReducedMotion()) return;

  interactive.value = true;
  reset(0);
  runCommand(0, false);
});
</script>

<template>
  <div class="overflow-x-clip px-4 pb-16 sm:px-6">
    <h1 class="mx-auto w-fit py-10 text-center text-3xl font-semibold
      sm:text-4xl bg-linear-to-r from-[#cba6f7] to-[#89b4fa]
      bg-clip-text text-transparent">
      Early in the career.<br />
      Not early in the life.
    </h1>

    <div class="mx-auto max-w-280">
      <div class="flex justify-end pb-3">
        <button
          v-if="interactive && ran < total"
          type="button"
          class="cursor-pointer text-sm text-gray-500 underline underline-offset-4
          hover:text-gray-700"
          @click="showEverything"
        >
          show everything
        </button>
      </div>

      <TerminalWindow title="danila@portfolio: ~/about — zsh" center-title>
        <div
          ref="output"
          aria-live="polite"
          class="space-y-8 p-4 font-mono text-sm leading-7 sm:p-8 sm:text-base"
        >
          <section
            v-for="(entry, index) in aboutSession"
            v-show="isShown(index)"
            :key="entry.command"
            :data-entry="index"
            class="scroll-mt-24 scroll-mb-8"
          >
            <TerminalPrompt :path="PATH">
              <template v-if="index === typingIndex">
                {{ typed }}<TerminalCursor />
              </template>
              <template v-else>{{ entry.command }}</template>
            </TerminalPrompt>

            <div
              v-show="index < ran"
              class="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6"
            >
              <img
                :src="entry.image"
                :alt="entry.alt"
                width="150"
                height="150"
                :loading="index === 0 ? 'eager' : 'lazy'"
                class="size-37.5 shrink-0 rounded-lg border border-ctp-surface0 object-cover"
              >
              <p class="text-ctp-text">{{ entry.text }}</p>
            </div>
          </section>

          <TerminalPrompt v-if="typingIndex === null" :path="PATH">
            <button
              v-if="interactive"
              ref="nextButton"
              type="button"
              class="group cursor-pointer rounded-xs text-left text-ctp-text hover:text-green-500
              focus-visible:outline-2 focus-visible:outline-offset-2
              focus-visible:outline-ctp-mauve"
              @click="onNext"
            >
              {{ nextCommand }}<TerminalCursor />
              <!-- A hint for visitors who don't read shell commands. Part of the
              click target, but kept out of the button's accessible name. -->
              <span
                aria-hidden="true"
                class="ml-3 inline-block text-ctp-overlay2 transition-transform duration-300
                group-hover:-translate-x-1 group-hover:text-green-500 motion-reduce:transition-none"
              >← click me</span>
            </button>
            <TerminalCursor v-else />
          </TerminalPrompt>
        </div>

        <TerminalStatusLine>
          <span class="px-4 py-1.5 text-ctp-subtext0">{{ ran }}/{{ total }} commands</span>
          <template #end>press ⏎ to run the next command</template>
        </TerminalStatusLine>
      </TerminalWindow>
    </div>
  </div>
</template>
