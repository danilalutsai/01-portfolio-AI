<script setup lang="ts">

type FooterLink =
  | { kind: 'internal'; label: string; to: string }
  | { kind: 'external'; label: string; href: string };

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const columns: FooterColumn[] = [
  { title: "Explore",
    links: [
      {
        kind: 'internal',
        label: "Home",
        to: "/",
      },
      {
        kind: 'internal',
        label: "Techs",
        to: "/techs",

      },
      {
        kind: 'internal',
        label: "About",
        to: "/about",
      },
      {
        kind: 'internal',
        label: "Contact",
        to: "/contact",
      },
    ],
  },
  {
    title: "Social",
    links: [
      {
        kind: 'external',
        label: "GitHub",
        href: "https://github.com/danilalutsai",
      },
      {
        kind: 'external',
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/danila-lutsai-4a1b8b174/",
      },
      {
        kind: 'external',
        label: "LeetCode",
        href: "https://leetcode.com/u/danilalutsai/",
      },
    ],
  },
  {
    title: "Dependencies",
    links: [
      {
        kind: 'external',
        label: "Vue",
        href: "https://developer.mozilla.org/en-US/",
      },
      {
        kind: 'external',
        label: "Zod",
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      },
      {
        kind: 'external',
        label: "GSAP",
        href: "https://www.typescriptlang.org/",
      },
      {
        kind: 'external',
        label: "Tailwind",
        href: "https://tailwindcss.com/",
      },
    ],
  },
  {
    title: "Learning Journay",
    links: [
      {
        kind: 'external',
        label: "HTML/CSS",
        href: "https://developer.mozilla.org/en-US/",
      },
      {
        kind: 'external',
        label: "JavaScript",
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      },
      {
        kind: 'external',
        label: "TypeScript",
        href: "https://www.typescriptlang.org/",
      },
      {
        kind: 'external',
        label: "Vue",
        href: "https://vuejs.org/",
      },
    ],
  },
];

</script>

<template>
  <footer
    class="relative isolate bg-cover bg-center bg-gray-600"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-10 bg-black/50"
    </div>
    <nav
      aria-label="Footer"
      class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-10 min-w-50  "
    >
      <div
        v-for="column in columns"
        :key="column.title"
      >
        <h2 class="text-xl text-green-500 font-bold mb-5">{{ column.title }}</h2>
        <ul class="space-y-2">
          <li
            v-for="link in column.links"
            :key="link.label"
          >
            <RouterLink
              v-if="link.kind === 'internal'"
              :to="link.to"
              class="opacity-60 text-white hover:opacity-90"
            >
              {{ link.label }}
            </RouterLink>
            <a
              v-if="link.kind === 'external'"
              target="_blank"
              rel="noopener noreferrer"
              :href="link.href"
              class="opacity-60 text-white hover:opacity-90"
            >{{ link.label }}</a>
          </li>
        </ul>
      </div>
    </nav>
    <div
      class="flex mx-auto justify-center pt-10 pb-5 text-white opacity-50"
    ><span>Copyright &#169; 2026 Danila Lutsai</span>
    </div>
  </footer>
</template>
