<template>
  <div class="container py-5">
    <div class="row justify-content-center mt-5">
      <div class="col-md-6 col-12">
        <div class="card shadow-sm border-0">
          <div class="card-body p-5 text-center">
            <h3 class="mb-4 text-primary">Acceso de Administrador</h3>
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="email" class="visually-hidden">Correo Electrónico</label>
                <input
                  v-model="email"
                  type="email"
                  id="email"
                  required
                  placeholder="Correo electrónico"
                  class="form-control form-control-lg"
                />
              </div>
              <div class="mb-3">
                <label for="password" class="visually-hidden">Contraseña</label>
                <input
                  v-model="password"
                  type="password"
                  id="password"
                  required
                  placeholder="Contraseña"
                  class="form-control form-control-lg"
                />
              </div>
              <button type="submit" class="btn btn-primary btn-lg w-100 mt-3">Ingresar</button>
              <div class="mt-3">
                <a href="#" @click="recoverPassword" class="text-decoration-none small">¿Olvidaste tu contraseña?</a>
              </div>
            </form>

            <!-- Mensaje de error -->
            <div v-if="error" class="alert alert-danger mt-3 mb-0 small" role="alert">
              {{ error }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  name: 'LoginForm', // ✅ Muy importante
  data() {
    return {
      email: "",
      password: "",
      error: ""
    };
  },
  methods: {
    async handleLogin() {
      this.error = "";

      if (!this.email || !this.password) {
        this.error = "Por favor, completa todos los campos";
        return;
      }

      try {
        const auth = getAuth();
        const { user } = await signInWithEmailAndPassword(auth, this.email, this.password);

        // Verificar si el usuario es admin en Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        if (userData?.role === "admin") {
          this.$router.push("/admin");
        } else {
          this.error = "No tienes permiso para acceder aquí";
          await auth.signOut();
        }
      } catch (err) {
        console.error("Error al iniciar sesión:", err);
        this.error = "Correo o contraseña incorrectos";
      }
    },
    async recoverPassword() {
      if (!this.email) {
        this.error = "Ingresa tu correo primero";
        return;
      }

      const auth = getAuth();
      try {
        await sendPasswordResetEmail(auth, this.email);
        alert("Se ha enviado un enlace de recuperación a tu correo.");
      } catch (err) {
        console.error("Error al recuperar contraseña:", err);
        this.error = "Hubo un problema al enviar el correo de recuperación.";
      }
    }
  }
};
</script>

<style scoped>
.card {
  border-radius: 1rem;
}
.input-group-text {
  background-color: #f8f9fa;
}
.btn {
  font-weight: bold;
}
.alert {
  font-size: 0.875em;
}
</style>