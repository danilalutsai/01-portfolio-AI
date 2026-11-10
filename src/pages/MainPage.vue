<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

import { onMounted, onUnmounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

import { SocialMedia } from '@/data/socialMedia'
import heroPattern from '@/assets/img/bg-main-about.webp';
import mainFooter from '@/assets/img/bg-footer-main.webp';

const slogan = ref<HTMLElement | null>(null);
const caret = ref<HTMLElement | null>(null);

const hero = ref<HTMLElement | null>(null)
const aboutSection = ref<HTMLElement | null>(null);
const passionSection = ref<HTMLElement | null>(null);
let motion: ReturnType<typeof gsap.matchMedia> | undefined;

function animateHero() {
  gsap
    .timeline()
    .from(
      '[data-animate="hero-bg"]',
      { opacity: 0, duration: 1 }
    )
    .from(
      '[data-animate="hero-summary"]',
      {
        opacity: 0,
        y: 16,
        duration: 0.5,
      },
      0.5
    )
    // Animate the wrapper so each button's transform stays available for CSS hover.
    .from(
      '[data-animate="hero-actions"]',
      {
        opacity: 0,
        y: 16,
        duration: 0.5,
      },
      0.6
    )
}

function animateAbout(section: HTMLElement) {
  // Animate the card and text when the section scrolls into view.
  gsap
    .timeline({
      defaults: {
        ease: 'power3.out',
      },
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        once: true,
      },
    })
    .from(
      '[data-animate="about-card"]',
      { opacity: 0, duration: 0.7 }
    )
    .from(
      '[data-animate="about-heading"]',
      { opacity: 0, y: 16, duration: 0.5 },
      0.2
    )
    .from(
      '[data-animate="about-copy"]',
      { opacity: 0, y: 16, duration: 0.6 },
      0.35
    )
    .from(
      '[data-animate="about-socials"]',
      { opacity: 0, y: 12, duration: 0.5 },
      0.5
    )

  // Animate the photo separately when the photo scrolls into view.
  const photo = section.querySelector<HTMLElement>(
    '[data-animate="about-photo"]',
  )

  if (!photo) return

  gsap.from(photo, {
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: photo,
      start: 'top 80%',
      once: true,
    },
  })
}

function animatePassion(section: HTMLElement) {
  gsap
    .timeline(
      { defaults: {
        ease: 'power3.out',
      }, scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          once: true,
        } }
    )
    .from(
      '[data-animate="passion-content"]',
      {
        opacity: 0,
        y: -80,
        duration: 0.7,
      }
    )
    .from(
      '[data-animate="passion-photo"]',
      {
        opacity: 0,
        x: -30,
        duration: 0.7,
      },
      0.2
    )
    .from(
      '[data-animate="passion-text"]',
      {
        opacity: 0,
        y: 20,
        duration: 0.7,
      },
      0.35
    )
}

function scrollToAbout() {
  if (!aboutSection.value) return;
  gsap.to(window, {
    duration: window.matchMedia(
      '(prefersreduced-motion: reduce)'
    ).matches ? 0 : 1,
    ease: 'power2.inOut',
    scrollTo: {
      y: aboutSection.value,
      offsetY: -30,
      autoKill: false,
    },
    overwrite: 'auto',
  });
}

function scrollToBottom() {
  if (!passionSection.value) return;
  gsap.to(window, {
    duration: window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches ? 0 : 1,
    ease: 'power2.inOut',
    scrollTo: {
      y: '.passion-content',
      offsetY: 20,
      autoKill: false,
    },
    overwrite: 'auto',
  });
}

function scrollToTop() {
  if (!hero.value) return;
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

function animateHeroBackground(section: HTMLElement) {
  const background = section.querySelector<HTMLElement>(
    '[data-animate="hero-bg"]',
  )

  if (!background) return

  gsap.to(background, {
    y: () => section.offsetHeight * 0.35,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      invalidateOnRefresh: true,
    },
  })
}

function animatePassionBackground(section: HTMLElement) {
  const background = section.querySelector<HTMLElement>(
    '[data-animate="passion-bg"]',
  )

  if (!background) return;

  gsap.fromTo(background, {
    y: () => -section.offsetHeight * 0.175,
  }, {
      y: () => section.offsetHeight * 0.175,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    })
}

function animateTyping(heading: HTMLElement, cursor: HTMLElement) {
  const split = SplitText.create(heading, { type: 'chars' });
  const [firstChar] = split.chars;
  if (!firstChar) return;

  // Place the cursor at the left or right edge of a character.
  function moveCursorTo(char: Element, edge: 'left' | 'right') {
    const headingBox = heading.getBoundingClientRect();
    const charBox = char.getBoundingClientRect();

    gsap.set(cursor, {
      x: charBox[edge] - headingBox.left,
      y: charBox.top - headingBox.top,
      height: charBox.height,
    });
  }

  const blink = gsap.to(cursor, {
    autoAlpha: 0,
    duration: 0.5,
    ease: 'steps(1)',
    repeat: -1,
    yoyo: true,
    paused: true,
  });

  gsap.set(split.chars, { autoAlpha: 0 });
  moveCursorTo(firstChar, 'left');

  const typing = gsap.timeline({
    delay: 0.4,
    onComplete: () => {
      blink.play();
    },
  });

  typing.set(cursor, { autoAlpha: 1 });

  for (const char of split.chars) {
    typing
      .set(char, { autoAlpha: 1 }, '+=0.09')
      .call(moveCursorTo, [char, 'right'], '<');
  }
}

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);
  motion = gsap.matchMedia();
  const reducedMotionQuery = '(prefers-reduced-motion: no-preference)';

  const heroElement = hero.value;
  const heading = slogan.value;
  const cursor = caret.value;

  if (heroElement) {
    motion.add(
      reducedMotionQuery,
      () => {
        animateHero()
        animateHeroBackground(heroElement)
        if (heading && cursor) animateTyping(heading, cursor)
      },
      heroElement,
    )
  }

  const about = aboutSection.value
  if (about) motion.add(reducedMotionQuery, () => animateAbout(about), about)

  const passion = passionSection.value
  if (passion) {
    motion.add(reducedMotionQuery, () => {
      animatePassion(passion)
      animatePassionBackground(passion)
    }, passion)
  }
})

onUnmounted(() => {
  motion?.revert()
})


</script>

<template>
  <div>
    <section ref="hero" class="pt-20 pb-40 relative flex flex-col w-full overflow-hidden min-h-svh">
      <img
        data-animate="hero-bg"
        :src="heroPattern"
        alt=""
        class="absolute inset-0 h-full w-full object-cover"
      />

      <div class="relative mx-auto my-auto w-full max-w-3xl px-6 sm:px-10 pb-20">
        <div
          class="container flex flex-row items-center justify-center gap-16 sm:flex-row sm:gap-20"
        >
          <h1
            ref="slogan"
            class="relative grid grid-cols-[auto_auto] justify-center text-6xl font-semibold uppercase leading-tight text-white"
          >
            <span class="text-right text-green-500">B</span>
            <span>uild</span>

            <span class="text-right">de<span class="text-green-500">b</span></span>
            <span>ug</span>

            <span class="text-right text-green-500">B</span>
            <span>oost</span>

            <span
              ref="caret"
              aria-hidden="true"
              class="invisible absolute top-0 left-0 w-2 bg-green-500"
            ></span>
          </h1>
        </div>

        <p
          data-animate="hero-summary"
          class="mx-auto mt-8 mb-8 max-w-100 text-center font-mono text-lg leading-8 font-semibold text-gray-100"
        >
          Self-taught front-end developer based in Tallinn. I learned by building, breaking and
          rebuilding — and I'm still doing exactly that.
        </p>

        <div data-animate="hero-actions" class="flex flex-wrap justify-center gap-3 pt-5">
          <button
            type="button"
            class="inline-flex cursor-pointer items-center rounded-lg border-4
            bg-green-500 px-4 py-2 text-lg font-semibold text-gray-600
            shadow-card transition-transform duration-300 ease-standard
            hover:translate-y-[-0.3rem] hover:duration-200 motion-reduce:transition-none sm:px-6 sm:py-3 border-green-500"
            @click="scrollToAbout"
          >
            About
          </button>
          <RouterLink
            to="/contact"
            class="group inline-flex cursor-pointer items-center rounded-lg
            border-4 bg-green-500 px-4 py-2 text-lg font-semibold text-gray-600
            shadow-card transition-transform duration-300 ease-standard
            hover:translate-y-[-0.3rem] hover:duration-200
            motion-reduce:transition-none sm:px-6 sm:py-3 min-w-5 border-gray-600"
          >Get in touch
            <span
              aria-hidden="true"
              class="relative block size-6 shrink-0
              transition-transform duration-300
              group-hover:translate-x-2
              motion-reduce:transition-none"
            >
              <!-- The straight line -->
              <div>
                <span
                  class="absolute left-0.75 top-1/2 h-1 w-4.5
                  origin-right -translate-y-1/2
                  scale-x-0 rounded-full bg-current opacity-0
                  transition-[scale,opacity] duration-300
                  group-hover:scale-x-100 group-hover:opacity-100
                  motion-reduce:transition-none"
                ></span>

                <!-- The arrow tip -->
                <span
                  class="absolute right-0.75 top-1/2 size-4
                  -translate-y-1/2 -rotate-45 rounded-full"
                >
                  <span
                    class="absolute bottom-0 left-0 h-1 w-full
                    rounded-full bg-current"
                  ></span>

                  <span
                    class="absolute right-0 top-0 h-full w-1
                    rounded-full bg-current"
                  ></span>
                </span>
              </div>
            </span>

          </RouterLink>
        </div>
      </div>
      <button
        type="button"
        aria-label="Scroll to About"
        class="group relative bottom-10 left-1/2 flex size-12 -translate-x-1/2
        cursor-pointer items-center justify-center text-white"
        @click="scrollToAbout"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-10 transition-transform duration-300 group-hover:translate-y-2
          motion-reduce:transition-none"
        >
          <path
            d="M12 4v12"
            class="origin-bottom transform-fill scale-y-0 opacity-0
            transition-[scale,opacity] duration-300
            group-hover:scale-y-100 group-hover:opacity-100
            motion-reduce:transition-none"
          />
          <path d="m5 9 7 7 7-7" />
        </svg>
      </button>
    </section>

    <section
      ref="aboutSection"
      class="flex justify-center bg-white -pb-10 sm:p-20
      md:mx-auto rounded-xl"
    >
      <div
        data-animate="about-card"
        class="relative flex w-full rounded-xl max-w-276 flex-col gap-8
        bg-white p-10 pb-24 transition-transform
        duration-300 ease-standard md:flex-row md:justify-between"
      >
        <div class="min-w-0 flex-1 md:mb-10">
          <h2
            data-animate="about-heading"
            class="relative  py-5 text-left text-2xl
            font-semibold text-gray-600 uppercase sm:text-3xl lg:text-4xl ml-5
            after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full
            after:content-[''] after:bg-linear-to-r after:from-[#cba6f7]
            after:to-[#f38ba8]"
          > <span class="inline-block bg-linear-to-r from-[#cba6f7]
              to-[#f38ba8] bg-clip-text text-transparent">
              DANILA LUTSAI </span>
          </h2>
          <p data-animate="about-copy" class="p-5 text-lg text-gray-500">
            I’m a self-taught web developer from Tallinn, Estonia, with a growing passion for turning
            ideas into useful, thoughtful web experiences. I began my journey into programming at the
            start of 2026, driven by curiosity about how the websites and applications I use every day
            are made.
          </p>
          <ul
            data-animate="about-socials"
            class="flex flex-wrap items-center justify-center gap-3 md:ml-5 md:justify-start"
          >
            <li v-for="media in SocialMedia" :key="media.url" class="inline-flex">
              <a
                :href="media.url"
                :aria-label="media.alt"
                class="inline-flex"
                :target="media.url.startsWith('http') ? '_blank' : undefined"
                :rel="media.url.startsWith('http') ? 'noopener noreferrer' : undefined"
              >
                <img
                  :src="media.image"
                  :alt="media.alt"
                  width="40"
                  height="40"
                  class="size-10 cursor-pointer opacity-30 transition-[translate,opacity]
                  duration-200 ease-standard hover:-translate-y-1 hover:opacity-50
                  motion-reduce:transition-none"
                />
              </a>
            </li>
          </ul>
        </div>
        <img
          data-animate="about-photo"
          src="@/assets/img/avatar.webp"
          alt="Danila Lutsai"
          class="m-5 aspect-square w-full max-w-60 shrink-0 self-center rounded-full object-cover"
        />
        <button
          type="button"
          aria-label="Scroll to Bottom"
          class="group absolute bottom-10 left-1/2 flex size-12
          -translate-x-1/2 cursor-pointer items-center justify-center text-gray-500"
          @click="scrollToBottom"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-10 transition-transform duration-300 group-hover:translate-y-2
            motion-reduce:transition-none"
          >
            <path
              d="M12 4v12"
              class="origin-bottom transform-fill scale-y-0 opacity-0
              transition-[scale,opacity] duration-300
              group-hover:scale-y-100 group-hover:opacity-100
              motion-reduce:transition-none"
            />
            <path d="m5 9 7 7 7-7" />
          </svg>
        </button>
      </div>
    </section>

    <section
      ref="passionSection"
      class="relative mx-auto flex justify-center overflow-hidden sm:p-30 py-20
      px-5"
    >
      <img
        data-animate="passion-bg"
        :src="mainFooter"
        loading="lazy"
        alt=""
        class="absolute inset-0 left-0 w-full h-full object-cover"
      />
      <div
        data-animate="passion-content"
        class="passion-content relative flex h-full max-w-276 flex-col gap-8
        transition-transform duration-300 ease-standard lg:flex-row
        lg:justify-between p-10 my-10 rounded-xl bg-white"
      >
        <img
          data-animate="passion-photo"
          src="@/assets/img/avatar-01.webp"
          loading="lazy"
          alt="Danila Lutsai"
          class="order-2 mx-auto aspect-square w-full max-w-80 shrink-0 self-center
          object-cover lg:order-1 rounded-xl"
        />
        <div
          data-animate="passion-text"
          class="rounded-xl order-1 min-w-0 flex-1 lg:order-2"
        >
          <h2
            class="relative py-5 text-left text-2xl
            font-semibold uppercase sm:text-3xl lg:text-4xl ml-5
            after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full
            after:content-[''] after:bg-linear-to-r after:from-[#E6A1D5]
            after:to-[#A4A6FB]"
          >
            <span class="inline-block bg-linear-to-r from-[#E6A1D5] to-[#A4A6FB]
              bg-clip-text text-transparent sm:text-3xl">
              Passion
            </span>
          </h2>
          <p class="m-10 ml-5 text-lg text-gray-500 xl:order-1">
            What I enjoy most about development is that it combines creativity with logic. There is
            always another detail to improve: making an interface clearer, refining a layout for
            smaller screens, improving performance, or finding a cleaner solution to a technical
            challenge.<br /><br />
            I like the balance between careful problem-solving and the visual side of creating an
            experience that people genuinely enjoy using.
          </p>
        </div>
      </div>
      <button
        type="button"
        aria-label="Scroll to Top"
        class="group absolute bottom-30 left-1/2 flex size-12 -translate-x-1/2
        cursor-pointer items-center justify-center text-white pb-10 mx-auto"
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
    </section>
  </div>
</template>

