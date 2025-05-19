import { createRouter, createWebHistory } from 'vue-router';
import TourReservation from '../components/TourReservation.vue';

const routes = [
  {
    path: '/',
    name: 'Reserva',
    component: TourReservation
  },
  {
    path: '/confirmacion',
    name: 'Confirmacion',
    component: () => import('../views/ConfirmationView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;