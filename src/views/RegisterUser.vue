<template>
  <div class="container py-5">
    <h2 class="mb-4">Registrar Nuevo Administrador</h2>
    <p class="text-muted mb-4">Solo los administradores pueden registrar o editar usuarios.</p>

    <!-- Formulario de registro -->
    <form @submit.prevent="registerAdmin" class="row g-3 mb-5">
      <div class="col-md-6">
        <label for="name" class="form-label">Nombre Completo</label>
        <input v-model="newUser.name" type="text" id="name" class="form-control" required />
      </div>
      <div class="col-md-6">
        <label for="email" class="form-label">Correo Electrónico</label>
        <input v-model="newUser.email" type="email" id="email" class="form-control" required />
      </div>
      <div class="col-md-6">
        <label for="password" class="form-label">Contraseña</label>
        <input v-model="newUser.password" type="password" id="password" class="form-control" required />
      </div>
      <div class="col-md-6">
        <label for="role" class="form-label">Rol del Usuario</label>
        <select v-model="newUser.role" id="role" class="form-select">
          <option value="admin">Administrador</option>
          <option value="editor">Editor</option>
          <option value="viewer">Solo Visualización</option>
        </select>
      </div>
      <div class="col-12 d-grid">
        <button type="submit" class="btn btn-primary btn-lg mt-3">Registrar Admin</button>
      </div>
    </form>

    <!-- Lista de Usuarios -->
    <div class="card shadow-sm border-0">
      <div class="card-header bg-white">
        <h5 class="mb-0">Usuarios Registrados</h5>
      </div>
      <div class="card-body p-0">
        <table class="table table-hover table-striped table-bordered mb-0">
          <thead class="table-light">
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="index">
              <td>{{ user.data.name }}</td>
              <td>{{ user.data.email }}</td>
              <td>{{ user.data.role }}</td>
              <td class="text-center">
                <button @click="editUser(user)" class="btn btn-sm btn-warning me-2">
                  <i class="bi bi-pencil-square"></i> Editar
                </button>
                <button @click="confirmDeleteUser(user)" class="btn btn-sm btn-danger">
                  <i class="bi bi-trash"></i> Borrar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Edición -->
    <div v-if="editingUser" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar Usuario</h5>
            <button @click="closeEditModal" type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveUserChanges">
              <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input v-model="editingUser.data.name" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Correo Electrónico</label>
                <input v-model="editingUser.data.email" class="form-control" disabled />
              </div>
              <div class="mb-3">
                <label class="form-label">Rol</label>
                <select v-model="editingUser.data.role" class="form-select">
                  <option value="admin">Administrador</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Solo Visualización</option>
                </select>
              </div>
              <div class="d-flex gap-2 mt-4">
                <button type="submit" class="btn btn-success w-100">Guardar Cambios</button>
                <button @click="closeEditModal" type="button" class="btn btn-secondary w-100">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación de Eliminación -->
    <div v-if="deletingUser" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body text-center">
            <i class="bi bi-exclamation-circle-fill text-danger display-4 mb-3"></i>
            <h5 class="mb-3">¿Estás seguro de eliminar este usuario?</h5>
            <div class="d-flex gap-2">
              <button @click="deleteUser" class="btn btn-danger w-100">Eliminar</button>
              <button @click="closeDeleteModal" class="btn btn-outline-secondary w-100">Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, doc, updateDoc, deleteDoc, query, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "@/firebase";

export default {
  name: "RegisterUser",
  data() {
    return {
      newUser: {
        name: "",
        email: "",
        password: "",
        role: "admin"
      },
      editingUser: null,
      deletingUser: null,
      users: [],
      auth: getAuth()
    };
  },
  mounted() {
    this.loadUsers();
  },
  methods: {
    async loadUsers() {
      try {
        const q = query(collection(db, "users"));
        const snapshot = await getDocs(q);
        this.users = snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        }));
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
        alert("Hubo un problema al cargar los usuarios.");
      }
    },
    async registerAdmin() {
      if (!this.newUser.email || !this.newUser.password || !this.newUser.name) {
        alert("Por favor, completa todos los campos.");
        return;
      }

      try {
        // Registrar en Firebase Auth
        const { user } = await createUserWithEmailAndPassword(
          this.auth,
          this.newUser.email,
          this.newUser.password
        );

        // Guardar información adicional en Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: this.newUser.name,
          email: this.newUser.email,
          role: this.newUser.role,
          createdAt: new Date(),
        });

        alert("Usuario registrado como administrador.");
        this.newUser = {
          name: "",
          email: "",
          password: "",
          role: "admin"
        };

        this.loadUsers(); // Recargar lista
      } catch (error) {
        console.error("Error al registrar admin:", error);
        alert("Hubo un problema al registrar el usuario.");
      }
    },
    editUser(user) {
      this.editingUser = JSON.parse(JSON.stringify(user));
    },
    closeEditModal() {
      this.editingUser = null;
    },
    async saveUserChanges() {
      try {
        const userRef = doc(db, "users", this.editingUser.id);
        await updateDoc(userRef, {
          name: this.editingUser.data.name,
          role: this.editingUser.data.role
        });
        this.closeEditModal();
        this.loadUsers(); // Refrescar
      } catch (error) {
        console.error("Error al guardar cambios:", error);
        alert("Hubo un problema al guardar los cambios.");
      }
    },
    confirmDeleteUser(user) {
      this.deletingUser = user;
    },
    closeDeleteModal() {
      this.deletingUser = null;
    },
    async deleteUser() {
      try {
        const userRef = doc(db, "users", this.deletingUser.id);
        await deleteDoc(userRef);

        this.closeDeleteModal();
        this.loadUsers(); // Refrescar
      } catch (error) {
        console.error("Error al borrar:", error);
        alert("Hubo un problema al eliminar el usuario.");
      }
    }
  }
};
</script>

<style scoped>
.card {
  border-radius: 1rem;
}
.seat-btn {
  width: 40px;
  height: 40px;
  font-size: 0.8rem;
  padding: 0;
  transition: transform 0.2s ease;
}
.seat-btn:hover:not(.btn-danger):not(:disabled) {
  transform: scale(1.1);
}
.btn {
  transition: all 0.2s ease;
}
.emoji-badge {
  font-size: 1.2em;
  margin-right: 0.5rem;
  color: #0d6efd;
}
.list-group-item {
  display: flex;
  align-items: center;
}
</style>