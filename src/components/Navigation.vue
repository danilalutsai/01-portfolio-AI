<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { SocialMedia } from '@/data/socialMedia'
import logo from '@/assets/img/dl-logo-bolder.svg'
import githubLogo from '@/assets/img/github-logo.webp'
import telegramLogo from '@/assets/img/telegram-logo.webp'

const links = [
  { label: 'Main', to: '/', gradient: 'from-[#f38ba8] to-[#cba6f7]' },
  { label: 'About', to: '/about', gradient: 'from-[#cba6f7] to-[#89b4fa]' },
  { label: 'Techs', to: '/techs', gradient: 'from-[#89b4fa] to-[#a6e3a1]' },
  { label: 'Contact', to: '/contact', gradient: 'from-[#cba6f7] to-[#fab387]' },
]

const socialMediaNav = [
  { label: 'GitHub', href: 'https://github.com/danilalutsai', alt: 'Github', image: githubLogo, target: '_blank' },
  { label: 'Telegram', href: 'https://t.me/danilalutsai', alt: 'Telegram', image: telegramLogo, target: '_blank' },
]

const isOpen = ref(false);
const isHidden = ref(false);
const route = useRoute();
const currentGradient = computed(
  () => {
    return links.find((link) => {
      return link.to === route.path
    })?.gradient ?? 'from-[#cba6f7] to-[#f38ba8]'
  },
);

watch(
  () => route.fullPath,
  () => {
    isOpen.value = false
  },
)

let lastScrollY = 0;

function onScroll() {
  if (isOpen.value) return;

  const currentY = Math.max(window.scrollY, 0);

  if (currentY < 80) {
    isHidden.value = false;
    lastScrollY = currentY;
    return;
  }

  if (Math.abs(currentY - lastScrollY) < 10) return;

  isHidden.value = currentY > lastScrollY;
  lastScrollY = currentY;
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});


</script>

<template>
    <div
      class="sticky top-0 z-50 bg-white transition-transform duration-300 ease-out motion-reduce:transition-none"
      :class="{ '-translate-y-full': isHidden }"
    >
      <div class="h-2 bg-linear-to-r" :class="currentGradient" aria-hidden="true"></div>
      <div class="border-b border-gray-200 p-5 text-[1.1rem]">
        <header class="mx-auto flex max-w-5xl items-center justify-between">
          <RouterLink to="/" aria-label="Home" class="font-normal text-black">
            <img :src="logo" alt="" width="30" height="30" />
          </RouterLink>

          <nav class="hidden items-center md:inline-flex" aria-label="Main">
            <ul class="flex items-center gap-5">
              <li v-for="link in links" :key="link.to">
                <RouterLink
                  :to="link.to"
                  class="relative inline-block transition-[translate,opacity,color] duration-300 ease-standard motion-reduce:transition-none"
                  :class="
                  route.path === link.to
                    ? 'font-bold text-green-500 opacity-100'
                    : 'text-black opacity-50 hover:opacity-70'
                  "
                >
                  {{ link.label }}
                </RouterLink>
              </li>
            </ul>
            <ul class="ml-5 flex items-center gap-3">
              <li v-for="media in socialMediaNav" :key="media.href" class="inline-flex">
                <a
                  :href="media.href"
                  :aria-label="media.alt"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex"
                >
                  <img
                    :src="media.image"
                    :alt="media.alt"
                    width="25"
                    height="25"
                    class="size-6.25 cursor-pointer opacity-50 transition-[translate,opacity] duration-300 ease-standard hover:opacity-70 motion-reduce:transition-none"
                  />
                </a>
              </li>
            </ul>
          </nav>

          <button
            type="button"
            class="relative z-50 flex size-10 cursor-pointer flex-col items-center justify-center gap-1.5 md:hidden"
            :aria-expanded="isOpen"
            aria-controls="mobile-nav"
            aria-label="Toggle navigation"
            @click="isOpen = !isOpen"
          >
            <span
              class="block h-0.5 w-6 bg-black transition-transform duration-300 ease-standard motion-reduce:transition-none"
              :class="{ 'translate-y-2 rotate-45': isOpen }"
            />
            <span
              class="block h-0.5 w-6 bg-black transition-opacity duration-300 ease-standard motion-reduce:transition-none"
              :class="{ 'opacity-0': isOpen }"
            />
            <span
              class="block h-0.5 w-6 bg-black transition-transform duration-300 ease-standard motion-reduce:transition-none"
              :class="{ '-translate-y-2 -rotate-45': isOpen }"
            />
          </button>
        </header>

        <Transition
          enter-active-class="transition-[max-height,opacity] duration-300 ease-out motion-reduce:transition-none"
          enter-from-class="max-h-0 opacity-0"
          enter-to-class="max-h-96 opacity-100"
          leave-active-class="transition-[max-height,opacity] duration-200 ease-in motion-reduce:transition-none"
          leave-from-class="max-h-96 opacity-100"
          leave-to-class="max-h-0 opacity-0"
        >
          <nav v-show="isOpen" id="mobile-nav" class="overflow-hidden md:hidden" aria-label="Mobile">
            <ul class="flex flex-col py-2">
              <li v-for="link in links" :key="link.to">
                <RouterLink
                  :to="link.to"
                  class="block py-1 transition-opacity duration-150 ease-standard hover:opacity-100 motion-reduce:transition-none"
                  :class="
                  route.path === link.to
                    ? 'font-bold text-green-500 opacity-100'
                    : 'text-black opacity-40'
                  "
                >
                  {{ link.label }}
                </RouterLink>
              </li>
            </ul>
            <ul class="inline-flex gap-2 py-4 opacity-50">
              <li v-for="media in SocialMedia" :key="media.url">
                <a
                  :href="media.url"
                  :aria-label="media.alt"
                  :target="media.url.startsWith('http') ? '_blank' : undefined"
                  :rel="media.url.startsWith('http') ? 'noopener noreferrer' : undefined"
                >
                  <img
                    :src="media.image"
                    :alt="media.alt"
                    class="size-6.25 opacity-60 transition-[translate,opacity] duration-300 ease-standard hover:opacity-70 motion-reduce:transition-none"
                  />
                </a>
              </li>
            </ul>
          </nav>
        </Transition>
      </div>
    </div>
</template>
