import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '@/pages/MainPage.vue';
import AboutPage from '@/pages/AboutPage.vue';
import TechsPage from '@/pages/TechsPage.vue';
import ContactPage from '@/pages/ContactPage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage, meta: { title: 'Danila Lutsai - Front-end developer' } },
    { path: '/about', name: 'about', component: AboutPage, meta: { title: 'About' } },
    { path: '/techs', name: 'techs', component: TechsPage, meta: { title: 'Contact' } },
    { path: '/contact', name: 'contact', component: ContactPage, meta: { title: 'Contact' } },
    // Must stay last so it never shadows a real page.
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage, meta: { title: 'Page not found' } },
  ],
  linkActiveClass: 'active-route',
})

export default router;
