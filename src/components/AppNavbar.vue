<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm fixed-top">
    <div class="container-fluid">
      <!-- Logo o nombre del sitio -->
      <router-link class="navbar-brand fw-bold text-primary" to="/">Tour Isla Saona</router-link>

      <!-- Botón para menú móvil -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" :data-bs-target="'#navbarSupportedContent'" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Opciones de navegación -->
      <div class="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
        <ul class="navbar-nav mb-2 mb-lg-0 align-items-center">
          <!-- Enlace a Inicio -->
          <li class="nav-item me-3">
            <router-link class="nav-link" to="/">Inicio</router-link>
          </li>

          <!-- Si hay un usuario logueado -->
          <li v-if="user" class="nav-item dropdown me-3">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              {{ user.email }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <!-- Solo mostrar si es admin -->
              <li v-if="isAdmin">
                <router-link class="dropdown-item" to="/admin">Panel de Administración</router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <!-- Botón de cerrar sesión -->
              <li>
                <a @click.prevent="logout" class="dropdown-item" href="#">Cerrar sesión</a>
              </li>
            </ul>
          </li>

          <!-- Si NO hay usuario logueado -->
          <li v-else class="nav-item me-3">
            <router-link class="nav-link" to="/login">Iniciar sesión</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  name: "AppNavbar",
  data() {
    return {
      user: null,
      isAdmin: false,
    };
  },
  methods: {
    async logout() {
      const auth = getAuth();
      try {
        await auth.signOut();
        this.user = null;
        this.isAdmin = false;
        this.$router.push("/login");
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        alert("Hubo un problema al cerrar la sesión.");
      }
    },
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.user = user;

        // Verificar si es administrador
        const userDoc = await getDoc(doc(db, "users", user.uid));
        this.isAdmin = userDoc.exists() && userDoc.data().role === "admin";
      } else {
        this.user = null;
        this.isAdmin = false;
      }
    });
  },
};
</script>

<style scoped>
.navbar-brand {
  font-size: 1.5rem;
}
.dropdown-item:hover {
  background-color: #f1f1f1;
  cursor: pointer;
}
</style>