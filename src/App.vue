<script setup lang="ts">
import { RouterView } from 'vue-router';
import Footer from './components/Footer.vue';
import Navigation from './components/Navigation.vue';
import gsap from 'gsap';

function enter(el: Element, done: () => void) {
  gsap.fromTo(
    el,
    { opacity: 0 },
    { opacity: 1, duration: 0.3, onComplete: done },
  );
}

function leave(el: Element, done: () => void) {
  gsap.to(
    el,
    {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        window.scrollTo(0, 0);
        done();
      },
    });
}

</script>

<template>
  <Navigation />

  <main>
    <RouterView v-slot="{ Component }">
      <Transition
        mode="out-in"
        :css="false"
        @enter="enter"
        @leave="leave"
      >
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>

  <Footer />
</template>
