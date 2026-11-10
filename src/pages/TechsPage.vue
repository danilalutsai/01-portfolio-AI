<script setup lang="ts">
import { gsap } from 'gsap';
import { onMounted, ref } from 'vue';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Images imports
import fundamentalsImage from '@/assets/img/TechsComputerScience.webp';
import cssImage from '@/assets/img/TechsCSS.webp';
import htmlImage from '@/assets/img/TechsHTML.webp';
import javascriptImage from '@/assets/img/TechsJS.webp';
import typescriptImage from '@/assets/img/TechsTS.webp';
import vueImage from '@/assets/img/TechsVueJS.webp';
import tailwindImage from '@/assets/img/TechsTailwindCSS.webp';
import aiImage from '@/assets/img/TechsAI.webp';

const techsDescription = ref<HTMLElement | null>(null);

gsap.registerPlugin(ScrollToPlugin);

onMounted(() => {
  gsap.from('.techs-title', {
    opacity: 0,
    y: -100,
    duration: 0.5,
  });
});

interface Techs {
  title: string;
  image: string;
  description: string;
}

const techs: Techs[] = [
  {
    title: 'Fundamentals',
    image: fundamentalsImage,
    description:
    "I don't claim to know everything, and I don't think anyone in this field does. What I do have is a habit of learning things properly, from the fundamentals up. When a new tool appears, I can usually see what problem it solves and where it fits. Frameworks change every few years. The basics stay the same.",
  },
  {
    title: 'HTML',
    image: htmlImage,
    description:
    "HTML is where I started, and it's still the layer I care about getting right. I write semantic, accessible markup — proper headings, landmarks, labels and alt text — rather than a wall of divs. Structure comes first, styling after. Done properly, the page already works before a single line of CSS or JavaScript runs.",
  },
  {
    title: 'CSS',
    image: cssImage,
    description:
    "I build layouts with Flexbox and Grid, and I design mobile-first — the small screen decides the structure, wider ones get more room. Custom properties keep colours and spacing consistent instead of scattered. I'd rather solve something with modern CSS than pull in a dependency for it.",
  },
  {
    title: 'JavaScript',
    image: javascriptImage,
    description:
    "JavaScript is the language I work in daily. I'm comfortable with modern syntax, async code and promises, and the DOM underneath the frameworks. Knowing how the event loop and scope actually behave is what makes debugging possible when something breaks in a way the framework doesn't explain.",
  },
  {
    title: 'TypeScript',
    image: typescriptImage,
    description: "TypeScript is my default for anything bigger than a quick script. I keep strict mode on and lean on interfaces, union types and generics to describe what data actually looks like. To me, types are documentation the compiler checks: they catch the mistake before the browser does. Underneath it's still JavaScript, so knowing the runtime matters more than writing clever types.",
  },
  {
    title: 'VueJS',
    image: vueImage,
    description: "Vue is my framework of choice, and I work with Vue 3 and the Composition API. I like how close it stays to plain HTML, CSS and JavaScript. Single-file components keep things readable. I split interfaces into small, focused components, handle routing with Vue Router, and type props and emits with TypeScript. The framework does the heavy lifting, but I want to understand what it's doing.",
  },
  {
    title: 'TailwindCSS',
    image: tailwindImage,
    description: "Tailwind is how I style most projects now. Utility classes keep the styles right next to the markup, so I'm not jumping between files or inventing class names. It works because I already know CSS: every utility maps to a real property, and when something looks off, I know what's happening underneath. I keep the config tidy and pull repeated patterns into components instead of copying long class strings around.",
  },
  {
    title: 'AI',
    image: aiImage,
    description: "I use AI tools as part of my workflow: for exploring an unfamiliar API, getting a first draft of boilerplate, or talking through a bug from a different angle. I treat the output as a suggestion from a fast but unreliable colleague. I read it, test it, and rewrite what doesn't fit. I don't ship code I can't explain. AI makes me faster, but the fundamentals are what let me tell when it's wrong.",
  }
]

function getImage(event: MouseEvent): HTMLImageElement | null {
  const card = event.currentTarget;
  if (!(card instanceof HTMLElement)) return null;

  const image = card.querySelector('.tech-image');
  return image instanceof HTMLImageElement ? image : null;
}

function onEnter(event: MouseEvent) {
  const image = getImage(event);
  if (!image) return;

  gsap.to(image, {
    rotationY: 360,
    transformPerspective: 600,
    duration: 1,
    ease: 'power2.out',
    overwrite: 'auto',
  });
}

function onLeave(event: MouseEvent) {
  const image = getImage(event);
  if (!image) return;

  gsap.to(image, {
    rotationY: 0,
    duration: 1,
    ease: 'power2.out',
    overwrite: 'auto',
  });
}

const selectedTech = ref<Techs | undefined>(techs[0]);

function onClick(tech: Techs, event: MouseEvent) {
  selectedTech.value = tech;
  scrollToDescription();

  const image = getImage(event);
  if (!image) return;

  gsap.fromTo(
    image,
    {
      rotationY: 0,
    },
    {
      rotationY: 360,
      duration: 1,
      ease: 'power2.out',
      overwrite: 'auto',
    },
  );
}

function scrollToDescription() {
  if (!techsDescription.value) return;
  if (!window.matchMedia('(max-width: 639px)').matches) return;

  gsap.to(window, {

    duration: window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches ? 0 : 1,

    delay: 0.5,
    ease: 'power2.inOut',
    scrollTo: {
      y: techsDescription.value,
      offsetY: 80,
      autoKill: false,
    },
    overwrite: 'auto',
  });
}

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

  <div class="mx-auto w-full max-w-300 mb-20">

    <h1 class="techs-title py-10 text-3xto-[#a6e3a1] font-semibold text-3xl sm:text-4xl pb-10 bg-linear-180 from-[#89b4fa] to-[#a6e3a1] bg-clip-text text-transparent text-center mb-10">
      Technologies
    </h1>

    <div class="techs-icons grid grid-cols-2 sm:grid-cols-4 gap-14 justify-items-center sm:max-w-200 max-w-100 mx-auto">
      <div v-for="tech in techs" :key="tech.title">
        <div class="text-gray-500 text-lg text-center">{{ tech.title }}</div>
        <div
          class="w-30 h-30 cursor-pointer"
          @mouseenter="onEnter"
          @mouseleave="onLeave"
          @click="onClick(tech, $event)"
        >
          <img
            :src="tech.image"
            :alt="tech.title"
            class="tech-image size-full object-cover transition-[filter] duration-500"
            :class="{ grayscale: selectedTech?.title === tech.title }"
          >
        </div>
      </div>
    </div>

    <div ref="techsDescription" class="techsDescription max-w-200 text-lg text-gray-500 mt-10 sm:mt-0 p-10 sm:p-20 mx-auto">
      <Transition
        mode="out-in"
        enter-active-class="transition-opacity duration-300"
        leave-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <p :key="selectedTech?.title">
          {{ selectedTech?.description }}
        </p>
      </Transition>
    </div>


      <button
        type="button"
        aria-label="Scroll to Top"
        class="group absolute left-1/2 flex size-12 -translate-x-1/2
        cursor-pointer items-center justify-center text-gray-500 pb-10 mx-auto"
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
