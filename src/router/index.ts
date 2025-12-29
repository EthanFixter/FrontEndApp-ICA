import { createRouter, createWebHistory } from 'vue-router';
import ListDevices from '@/views/ListDevices.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ListDevices,
    },
    {
      path: '/reservations',
      name: 'reservations',
      component: () => import('@/views/ListReservations.vue'),
    },
  ],
});

export default router;
