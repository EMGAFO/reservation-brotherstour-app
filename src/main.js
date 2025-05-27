import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Firebase Auth
import { getAuth } from "firebase/auth";

// Firestore
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

// Bootstrap
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const app = createApp(App);
const auth = getAuth();

// Middleware para proteger rutas por rol
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const currentUser = auth.currentUser;

  if (requiresAuth && !currentUser) {
    next('/login');
  } else if (to.meta.role && currentUser) {
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const userData = userDoc.data();

      if (userData?.role === to.meta.role) {
        next();
      } else {
        next('/login'); // O redirige a otra ruta si no tiene permisos
      }
    } catch (error) {
      console.error('Error obteniendo datos del usuario:', error);
      next('/login');
    }
  } else {
    next();
  }
});


app.use(router).mount('#app');