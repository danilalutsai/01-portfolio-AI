<script setup lang="ts">
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

import { computed, onMounted, onUnmounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import TerminalWindow from '@/components/TerminalWindow.vue';
import { followPointer } from '@/animations/pointer';

const route = useRoute();

const section = ref<HTMLElement | null>(null);
const terminal = ref<HTMLElement | null>(null);
const caret = ref<HTMLElement | null>(null);
let motion: ReturnType<typeof gsap.matchMedia> | undefined;

const pages = [
  {
    label: 'Main',
    to: '/',
    keys: ['main', 'home', 'index'],
    hover: 'hover:from-[#f38ba8] hover:to-[#cba6f7]',
  },
  {
    label: 'About',
    to: '/about',
    keys: ['about'],
    hover: 'hover:from-[#cba6f7] hover:to-[#89b4fa]',
  },
  {
    label: 'Techs',
    to: '/techs',
    keys: ['techs', 'tech', 'skills', 'stack'],
    hover: 'hover:from-[#89b4fa] hover:to-[#a6e3a1]',
  },
  {
    label: 'Contact',
    to: '/contact',
    keys: ['contact', 'mail'],
    hover: 'hover:from-[#cba6f7] hover:to-[#fab387]',
  },
];

const quickLinks = pages.filter((page) => page.to !== '/');

// Number of single-character edits needed to turn one word into another.
function editDistance(a: string, b: string) {
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);

  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        (previous[j] ?? 0) + 1,
        (current[j - 1] ?? 0) + 1,
        (previous[j - 1] ?? 0) + cost,
      );
    }
    previous = current;
  }

  return previous[b.length] ?? 0;
}

// Suggest the page whose name is closest to the first segment of the attempted path.
const suggestion = computed(() => {
  const segment = route.path.split('/').find(Boolean)?.toLowerCase();
  if (!segment) return null;

  let best: { page: (typeof pages)[number]; distance: number } | undefined;
  for (const page of pages) {
    for (const key of page.keys) {
      const distance = editDistance(segment, key);
      if (!best || distance < best.distance) best = { page, distance };
    }
  }

  return best && best.distance <= 2 ? best.page : null;
});

function animateEntrance() {
  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .from(
      '[data-animate="not-found-digit"]',
      {
        opacity: 0,
        y: -120,
        rotate: () => gsap.utils.random(-25, 25),
        duration: 1,
        ease: 'bounce.out',
        stagger: 0.15,
      }
    )
    .from(
      '[data-animate="not-found-card"]',
      { opacity: 0, y: 40, duration: 0.7 },
      0.6
    )
    .from(
      '[data-animate="not-found-copy"]',
      { opacity: 0, y: 16, duration: 0.5, stagger: 0.1 },
      0.8
    )
}

function animateIdle() {
  // Keep the digits gently floating once they have landed.
  gsap.to('[data-animate="not-found-digit"]', {
    y: -12,
    duration: 1.6,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    stagger: { each: 0.25, from: 'start' },
    delay: 1.6,
  })

  // Drift the background blobs slowly around the page.
  gsap.utils.toArray<HTMLElement>('[data-animate="not-found-blob"]').forEach((blob) => {
    gsap.to(blob, {
      x: () => gsap.utils.random(-80, 80),
      y: () => gsap.utils.random(-60, 60),
      scale: () => gsap.utils.random(0.85, 1.2),
      duration: () => gsap.utils.random(6, 10),
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      repeatRefresh: true,
    })
  })
}

// Place the cursor at the right edge of an element inside the terminal.
function moveCursorTo(body: HTMLElement, cursor: HTMLElement, target: Element) {
  const bodyBox = body.getBoundingClientRect();
  const targetBox = target.getBoundingClientRect();

  gsap.set(cursor, {
    x: targetBox.right - bodyBox.left,
    y: targetBox.top - bodyBox.top,
    height: targetBox.height,
  });
}

function animateTerminal(body: HTMLElement, cursor: HTMLElement) {
  const lines = gsap.utils.toArray<HTMLElement>('[data-terminal-line]', body);

  const blink = gsap.to(cursor, {
    autoAlpha: 0,
    duration: 0.5,
    ease: 'steps(1)',
    repeat: -1,
    yoyo: true,
    paused: true,
  });

  gsap.set(lines, { autoAlpha: 0 });

  const typing = gsap.timeline({
    delay: 1.4,
    onComplete: () => {
      blink.play();
    },
  });

  typing.set(cursor, { autoAlpha: 1 });

  for (const line of lines) {
    typing.set(line, { autoAlpha: 1 }, '+=0.3');

    if (line.dataset.terminalLine === 'command') {
      // Type commands one character at a time.
      const split = SplitText.create(line.querySelector('[data-terminal-text]'), {
        type: 'chars',
      });
      typing.set(split.chars, { autoAlpha: 0 }, '<');
      for (const char of split.chars) {
        typing
          .set(char, { autoAlpha: 1 }, '+=0.05')
          .call(moveCursorTo, [body, cursor, char], '<');
      }
    } else {
      // Print output lines in one go, like a real terminal.
      typing.call(moveCursorTo, [body, cursor, line], '<');
    }
  }
}

onMounted(() => {
  gsap.registerPlugin(SplitText);

  const sectionElement = section.value;
  if (!sectionElement) return;

  const body = terminal.value;
  const cursor = caret.value;

  motion = gsap.matchMedia();
  motion.add(
    '(prefers-reduced-motion: no-preference)',
    () => {
      animateEntrance()
      animateIdle()
      if (body && cursor) animateTerminal(body, cursor)
    },
    sectionElement,
  )

  // Parallax only makes sense with a real mouse.
  motion.add(
    '(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)',
    () => followPointer(sectionElement),
    sectionElement,
  )
})

onUnmounted(() => {
  motion?.revert()
})
</script>

<template>
  <section
    ref="section"
    class="relative flex min-h-svh w-full items-center justify-center overflow-hidden
    bg-linear-to-br from-[#cba6f7] via-[#f38ba8] to-[#fab387] px-6 pt-28 pb-20"
  >
    <div data-parallax="-60" aria-hidden="true" class="absolute -top-20 -left-20">
      <div
        data-animate="not-found-blob"
        class="size-80 rounded-full bg-[#89b4fa] opacity-50 blur-3xl"
      ></div>
    </div>
    <div data-parallax="-40" aria-hidden="true" class="absolute top-1/3 -right-24">
      <div
        data-animate="not-found-blob"
        class="size-96 rounded-full bg-[#a6e3a1] opacity-40 blur-3xl"
      ></div>
    </div>
    <div data-parallax="-80" aria-hidden="true" class="absolute -bottom-24 left-1/4">
      <div
        data-animate="not-found-blob"
        class="size-72 rounded-full bg-[#cba6f7] opacity-60 blur-3xl"
      ></div>
    </div>

    <div class="relative flex w-full max-w-2xl flex-col items-center">
      <div
        aria-hidden="true"
        class="flex select-none gap-2 text-8xl font-bold text-white drop-shadow-lg sm:gap-4 sm:text-9xl"
      >
        <span data-parallax="20" class="inline-block">
          <span data-animate="not-found-digit" class="inline-block">4</span>
        </span>
        <span data-parallax="35" class="inline-block">
          <span data-animate="not-found-digit" class="inline-block text-green-500">0</span>
        </span>
        <span data-parallax="25" class="inline-block">
          <span data-animate="not-found-digit" class="inline-block">4</span>
        </span>
      </div>

      <div
        data-animate="not-found-card"
        class="mt-10 flex w-full flex-col items-center rounded-xl bg-white p-8 text-center shadow-card sm:p-10"
      >
        <h1
          data-animate="not-found-copy"
          class="relative pb-4 text-3xl font-semibold uppercase sm:text-4xl
          after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full
          after:content-[''] after:bg-linear-to-r after:from-[#cba6f7]
          after:to-[#f38ba8]"
        >
          <span class="inline-block bg-linear-to-r from-[#cba6f7] to-[#f38ba8] bg-clip-text text-transparent">
            Page not found
          </span>
        </h1>

        <p data-animate="not-found-copy" class="mt-6 text-lg text-gray-500">
          The page you're looking for doesn't exist. Maybe the link has a typo, or the page moved.
        </p>

        <TerminalWindow data-animate="not-found-copy" class="mt-6 text-left">

          <div
            ref="terminal"
            class="relative space-y-1 p-4 font-mono text-sm leading-6 sm:text-base"
          >
            <p data-terminal-line="command" class="break-all">
              <span aria-hidden="true" class="text-green-500">$ </span>
              <span data-terminal-text>cd {{ route.path }}</span>
            </p>
            <p data-terminal-line="output" class="w-fit text-ctp-red">
              error: page not found
            </p>
            <p data-terminal-line="command">
              <span aria-hidden="true" class="text-green-500">$ </span>
              <span data-terminal-text>suggest --fix</span>
            </p>
            <p data-terminal-line="output" class="w-fit">
              <template v-if="suggestion">
                did you mean
                <RouterLink
                  :to="suggestion.to"
                  class="text-ctp-blue underline underline-offset-4 hover:text-ctp-green"
                >{{ suggestion.label }}</RouterLink>?
              </template>
              <template v-else>
                try heading back to
                <RouterLink
                  to="/"
                  class="text-ctp-blue underline underline-offset-4 hover:text-ctp-green"
                >Main</RouterLink>
              </template>
            </p>

            <span
              ref="caret"
              aria-hidden="true"
              class="invisible absolute top-0 left-0 w-2 bg-green-500"
            ></span>
          </div>
        </TerminalWindow>

        <div data-animate="not-found-copy" class="mt-8">
          <RouterLink
            to="/"
            class="inline-flex cursor-pointer items-center rounded-lg border-4
            border-green-500 bg-green-500 px-4 py-2 text-lg font-semibold text-gray-600
            shadow-card transition-transform duration-300 ease-standard
            hover:translate-y-[-0.3rem] hover:duration-200
            motion-reduce:transition-none sm:px-6 sm:py-3"
          >
            Back to Main
          </RouterLink>
        </div>

        <nav data-animate="not-found-copy" aria-label="Other pages" class="mt-6">
          <p class="text-sm text-gray-500">Or jump to</p>
          <ul class="mt-3 flex flex-wrap justify-center gap-3">
            <li v-for="link in quickLinks" :key="link.to">
              <RouterLink
                :to="link.to"
                :class="link.hover"
                class="inline-flex rounded-lg border-2 border-gray-200 px-4 py-2
                font-semibold text-gray-600 transition-[translate,color,border-color]
                duration-300 ease-standard hover:-translate-y-1 hover:border-transparent
                hover:bg-linear-to-r hover:text-gray-800 motion-reduce:transition-none"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </section>
</template>
