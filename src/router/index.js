import { createRouter, createWebHistory } from 'vue-router';
import TourReservation from '../components/TourReservation.vue';
import LoginForm from '../views/LoginForm.vue';
import ConfirmationView from '../views/ConfirmationView.vue';
import AdminPanel from '../views/AdminPanel.vue';
import RegisterUser from '../views/RegisterUser.vue';

const routes = [
  {
    path: '/',
    name: 'Reserva',
    component: TourReservation
  },
  {
    path: '/confirmacion',
    name: 'Confirmacion',
    component: ConfirmationView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginForm
  },
  {
    path: '/registrar-admin',
    name: 'RegisterUser',
    component: RegisterUser,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanel,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;