import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '@/pages/MainPage.vue';
import AboutPage from '@/pages/AboutPage.vue';
import TechsPage from '@/pages/TechsPage.vue';
import ContactPage from '@/pages/ContactPage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/about', name: 'about', component: AboutPage },
    { path: '/techs', name: 'techs', component: TechsPage },
    { path: '/contact', name: 'contact', component: ContactPage },
    // Must stay last so it never shadows a real page.
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage },
  ],
  linkActiveClass: 'active-route',
})

export default router;
