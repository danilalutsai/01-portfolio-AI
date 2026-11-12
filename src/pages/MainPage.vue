<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

import { onMounted, onUnmounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

import { followPointer } from '@/animations/pointer'
import { SocialMedia } from '@/data/socialMedia'

const terminal = ref<HTMLElement | null>(null);
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
      '[data-animate="hero-terminal"]',
      {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: 'power3.out',
      },
      0.2
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
      '[data-animate="about-socials"] li',
      { opacity: 0, y: 16, scale: 0.6, duration: 0.5, ease: 'back.out(2)', stagger: 0.08 },
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

function animatePassionCopy(section: HTMLElement) {
  const copy = section.querySelector<HTMLElement>(
    '[data-animate="passion-copy"]',
  )

  if (!copy) return

  // Slide each line up from behind a mask once the paragraph comes into view.
  // autoSplit re-splits on resize so lines always match the current layout.
  SplitText.create(copy, {
    type: 'lines',
    mask: 'lines',
    autoSplit: true,
    onSplit: (self) => gsap.from(self.lines, {
      yPercent: 100,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: copy,
        start: 'top 85%',
        once: true,
      },
    }),
  })
}

function animateName(section: HTMLElement) {
  const name = section.querySelector<HTMLElement>(
    '[data-animate="about-name"]',
  )

  if (!name) return

  const text = name.textContent?.trim() ?? ''
  const scramble = (speed: number) => ({
    text,
    chars: 'upperCase',
    speed,
  })

  // Decode the name like a terminal when the card scrolls into view...
  gsap.to(name, {
    duration: 1.4,
    scrambleText: { ...scramble(0.5), revealDelay: 0.3 },
    scrollTrigger: {
      trigger: section,
      start: 'top 75%',
      once: true,
    },
  })

  // ...and again whenever the pointer touches it.
  function onEnter() {
    gsap.to(name, { duration: 0.8, scrambleText: scramble(0.8), overwrite: true })
  }

  name.addEventListener('pointerenter', onEnter)

  return () => {
    name.removeEventListener('pointerenter', onEnter)
  }
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

function animateBlobs(section: HTMLElement) {
  // Drift the soft colour blobs slowly around the section.
  gsap.utils.toArray<HTMLElement>('[data-animate="blob"]', section).forEach((blob) => {
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

// Place the cursor at the left or right edge of an element inside the terminal.
function moveCursorTo(
  body: HTMLElement,
  cursor: HTMLElement,
  target: Element,
  edge: 'left' | 'right',
) {
  const bodyBox = body.getBoundingClientRect();
  const targetBox = target.getBoundingClientRect();

  gsap.set(cursor, {
    x: targetBox[edge] - bodyBox.left,
    y: targetBox.top - bodyBox.top,
    height: targetBox.height,
  });
}

function animateTyping(body: HTMLElement, cursor: HTMLElement) {
  const lines = gsap.utils.toArray<HTMLElement>('[data-terminal-line]', body);
  const [firstLine] = lines;
  if (!firstLine) return;

  const blink = gsap.to(cursor, {
    autoAlpha: 0,
    duration: 0.5,
    ease: 'steps(1)',
    repeat: -1,
    yoyo: true,
    paused: true,
  });

  gsap.set(lines, { autoAlpha: 0 });
  moveCursorTo(body, cursor, firstLine, 'left');

  const typing = gsap.timeline({
    delay: 0.6,
    onComplete: () => {
      blink.play();
    },
  });

  typing.set(cursor, { autoAlpha: 1 });

  for (const line of lines) {
    typing.set(line, { autoAlpha: 1 }, '+=0.25');

    if (line.dataset.terminalLine === 'command') {
      // Type commands one character at a time.
      const split = SplitText.create(line, { type: 'chars' });
      typing.set(split.chars, { autoAlpha: 0 }, '<');
      for (const char of split.chars) {
        typing
          .set(char, { autoAlpha: 1 }, '+=0.08')
          .call(moveCursorTo, [body, cursor, char, 'right'], '<');
      }
    } else {
      // Print output lines in one go, like a real terminal.
      typing.call(moveCursorTo, [body, cursor, line, 'right'], '<');
    }
  }
}

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText, ScrambleTextPlugin);
  motion = gsap.matchMedia();
  const reducedMotionQuery = '(prefers-reduced-motion: no-preference)';

  const heroElement = hero.value;
  const body = terminal.value;
  const cursor = caret.value;

  if (heroElement) {
    motion.add(
      reducedMotionQuery,
      () => {
        animateHero()
        animateHeroBackground(heroElement)
        animateBlobs(heroElement)
        if (body && cursor) animateTyping(body, cursor)
      },
      heroElement,
    )

    // The parallax and glow only make sense with a real mouse.
    motion.add(
      `${reducedMotionQuery} and (hover: hover) and (pointer: fine)`,
      () => followPointer(heroElement),
      heroElement,
    )
  }

  const about = aboutSection.value
  if (about) {
    motion.add(reducedMotionQuery, () => {
      animateAbout(about)
      return animateName(about)
    }, about)
  }

  const passion = passionSection.value
  if (passion) {
    motion.add(reducedMotionQuery, () => {
      animatePassion(passion)
      animatePassionCopy(passion)
      animatePassionBackground(passion)
      animateBlobs(passion)
    }, passion)
  }
})

onUnmounted(() => {
  motion?.revert()
})


</script>

<template>
  <div>
    <section
      ref="hero"
      class="pt-20 pb-40 relative flex flex-col w-full overflow-hidden min-h-svh
      bg-linear-to-br from-[#c4a0f0] via-[#dc9bd8] to-[#f28fa6]"
    >
      <div data-animate="hero-bg" aria-hidden="true" class="absolute inset-0">
        <div data-parallax="-60" class="absolute -top-20 -left-20">
          <div
            data-animate="blob"
            class="size-96 rounded-full bg-[#b48cf0] opacity-60 blur-3xl"
          ></div>
        </div>
        <div data-parallax="-40" class="absolute top-1/4 -right-24">
          <div
            data-animate="blob"
            class="size-96 rounded-full bg-[#f38ba8] opacity-50 blur-3xl"
          ></div>
        </div>
        <div data-parallax="-80" class="absolute bottom-0 left-1/3">
          <div
            data-animate="blob"
            class="size-80 rounded-full bg-[#e6a1d5] opacity-60 blur-3xl"
          ></div>
        </div>
      </div>

      <div
        data-pointer-glow
        aria-hidden="true"
        class="pointer-events-none invisible absolute top-0 left-0 size-112 rounded-full bg-white/25 blur-3xl"
      ></div>

      <div class="relative mx-auto my-auto w-full max-w-3xl px-6 sm:px-10 pb-20">
        <div
          data-animate="hero-terminal"
          class="mx-auto w-full max-w-xl overflow-hidden rounded-xl bg-[#1e1e2e]/75
          shadow-card backdrop-blur-md"
        >
          <div aria-hidden="true" class="flex items-center gap-2 bg-[#181825]/80 px-4 py-3">
            <span class="size-3 rounded-full bg-[#f38ba8]"></span>
            <span class="size-3 rounded-full bg-[#f9e2af]"></span>
            <span class="size-3 rounded-full bg-[#a6e3a1]"></span>
            <span class="ml-3 font-mono text-sm text-[#a6adc8]">danila@portfolio: ~</span>
          </div>

          <div ref="terminal" class="relative space-y-4 p-6 sm:p-8">
            <h1
              data-terminal-line="command"
              class="mx-auto grid w-fit grid-cols-[auto_auto] text-5xl font-semibold uppercase
              leading-tight text-white sm:text-6xl"
            >
              <span class="text-right text-green-500">B</span>
              <span>uild</span>

              <span class="text-right">de<span class="text-green-500">b</span></span>
              <span>ug</span>

              <span class="text-right text-green-500">B</span>
              <span>oost</span>
            </h1>

            <p data-terminal-line="command" class="w-fit font-mono text-base text-[#cdd6f4]">
              <span aria-hidden="true" class="mr-3 text-green-500">$</span>whoami
            </p>
            <p
              data-terminal-line="output"
              class="font-mono text-base leading-7 text-[#cdd6f4]"
            >
              Self-taught front-end developer based in Tallinn. I learned by building, breaking and
              rebuilding — and I'm still doing exactly that.
            </p>
            <p
              data-terminal-line="output"
              aria-hidden="true"
              class="w-fit font-mono text-base text-green-500"
            >$</p>

            <span
              ref="caret"
              aria-hidden="true"
              class="invisible absolute top-0 left-0 w-2 bg-green-500"
            ></span>
          </div>
        </div>

        <div data-animate="hero-actions" class="flex flex-wrap justify-center gap-3 pt-10">
          <button
            type="button"
            class="inline-flex cursor-pointer items-center rounded-lg border-4
            bg-green-500 px-4 py-2 text-lg font-semibold text-gray-600
            shadow-card transition-transform duration-300 ease-standard
            hover:-translate-y-1 hover:scale-105 hover:duration-200 active:scale-95 motion-reduce:transition-none sm:px-6 sm:py-3 border-green-500"
            @click="scrollToAbout"
          >
            About
          </button>
          <RouterLink
            to="/contact"
            class="group inline-flex cursor-pointer items-center rounded-lg
            border-4 bg-green-500 px-4 py-2 text-lg font-semibold text-gray-600
            shadow-card transition-transform duration-300 ease-standard
            hover:-translate-y-1 hover:scale-105 hover:duration-200 active:scale-95
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
            aria-label="Danila Lutsai"
            class="relative  py-5 text-left text-2xl
            font-semibold text-gray-600 uppercase sm:text-3xl lg:text-4xl ml-5
            after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full
            after:content-[''] after:bg-linear-to-r after:from-[#cba6f7]
            after:to-[#f38ba8]"
          > <span data-animate="about-name" class="inline-block bg-linear-to-r from-[#cba6f7]
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
      px-5 bg-linear-to-br from-[#c49cf4] via-[#b6a2f4] to-[#a2a9f4]"
    >
      <div data-animate="passion-bg" aria-hidden="true" class="absolute inset-0">
        <div
          data-animate="blob"
          class="absolute -top-16 -left-16 size-96 rounded-full bg-[#cba6f7] opacity-60 blur-3xl"
        ></div>
        <div
          data-animate="blob"
          class="absolute top-1/3 -right-20 size-96 rounded-full bg-[#89b4fa] opacity-40 blur-3xl"
        ></div>
        <div
          data-animate="blob"
          class="absolute -bottom-20 left-1/4 size-80 rounded-full bg-[#b4befe] opacity-60 blur-3xl"
        ></div>
      </div>
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
          <p data-animate="passion-copy" class="m-10 ml-5 text-lg text-gray-500 xl:order-1">
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

