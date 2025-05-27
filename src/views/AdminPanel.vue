<template>
  <div class="container py-5">
    
    <div class="mt-5">
    <h2>Reservas del Tour a la Isla Saona</h2>
    </div>

    <!-- Selector de autobús -->
    <div class="mb-3">
      <label for="busSelector" class="form-label">Selecciona Autobús</label>
      <select v-model="selectedBusId" id="busSelector" class="form-select">
        <option value="0">Mostrar todos los autobuses</option>
        <option value="1">Autobús 1 </option>
        <option value="2">Autobús 2 </option>
      </select>
    </div>

    <!-- Búsqueda general -->
    <div class="mb-3">
      <input v-model="searchQuery" type="text" class="form-control" placeholder="Buscar por nombre o teléfono" />
    </div>

    <!-- Filtro por asiento -->
    <div class="mb-3">
      <input v-model.number="seatFilter" type="number" class="form-control" placeholder="Filtrar por asiento (ej: 17)" />
    </div>

    <!-- Botón limpiar filtros -->
    <button @click="clearFilters" class="btn btn-secondary ms-2">Limpiar</button>

    <!-- Tabla con paginación -->
<!--      <div class="table-responsive">
      <table class="table table-bordered table-hover mt-4">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th class="text-center">Asiento</th>
            <th class="text-center">Autobús</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(reservation, index) in filteredReservations" :key="index">
            <td>{{ reservation.id }}</td>
            <td>{{ reservation.data.name }}</td>
            <td>{{ reservation.data.phone }}</td>
            <td>{{ reservation.data.email }}</td>
            <td class="text-center">{{ reservation.data.seat }}</td>
            <td class="text-center">{{ reservation.data.busId || "1" }}</td>
            <td>{{ formatDate(reservation.data.timestamp) }}</td>
            <td class="text-center">
              <button @click="editReservation(reservation)" class="btn btn-sm btn-primary me-2">
                <i class="bi bi-pencil"></i> Editar
              </button>
              <button @click="confirmDelete(reservation)" class="btn btn-sm btn-danger">
                <i class="bi bi-trash"></i> Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
 -->


<!-- Tabla o tarjeta según tamaño de pantalla -->
<div v-if="isMobile">
  <!-- Vista móvil -->
  <div class="d-md-none">
    <div v-for="(reservation, index) in filteredReservations" :key="index" class="card mb-3 shadow-sm">
      <div class="card-body p-3">
        <p class="mb-1"><strong>Nombre:</strong> {{ reservation.data.name }}</p>
        <p class="mb-1"><strong>Teléfono:</strong> {{ reservation.data.phone }}</p>
        <p class="mb-1"><strong>Email:</strong> {{ reservation.data.email }}</p>
        <p class="mb-1"><strong>Asiento:</strong> {{ reservation.data.seat }}</p>
        <p class="mb-1"><strong>Autobús:</strong> {{ reservation.data.busId || "1" }}</p>
        <p class="mb-1"><strong>Fecha:</strong> {{ formatDate(reservation.data.timestamp) }}</p>
        <div class="d-flex justify-content-between mt-2">
          <button @click="editReservation(reservation)" class="btn btn-sm btn-primary w-49">
            <i class="bi bi-pencil"></i> Editar
          </button>
          <button @click="confirmDelete(reservation)" class="btn btn-sm btn-danger w-49">
            <i class="bi bi-trash"></i> Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Vista normal en desktop -->
<table v-else class="table table-bordered table-hover mt-4 d-none d-md-table">
  <thead class="table-light">
    <tr>
      <th>Nombre</th>
      <th>Teléfono</th>
      <th>Email</th>
      <th class="text-center">Asiento</th>
      <th class="text-center">Autobús</th>
      <th>Fecha</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(reservation, index) in filteredReservations" :key="index">
      <td>{{ reservation.id }}</td>
      <td>{{ reservation.data.name }}</td>
      <td>{{ reservation.data.phone }}</td>
      <td>{{ reservation.data.email }}</td>
      <td class="text-center">{{ reservation.data.seat }}</td>
      <td class="text-center">{{ reservation.data.busId || "1" }}</td>
      <td>{{ formatDate(reservation.data.timestamp) }}</td>
      <td class="text-center">
        <button @click="editReservation(reservation)" class="btn btn-sm btn-primary me-2">
          <i class="bi bi-pencil"></i> Editar
        </button>
        <button @click="confirmDelete(reservation)" class="btn btn-sm btn-danger">
          <i class="bi bi-trash"></i> Eliminar
        </button>
      </td>
    </tr>
  </tbody>
</table>



    <!-- Paginación -->
    <nav aria-label="Paginación" class="d-flex justify-content-center mt-4">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="prevPage">Anterior</a>
        </li>
        <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
          <a class="page-link" href="#" @click.prevent="setPage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="nextPage">Siguiente</a>
        </li>
      </ul>
    </nav>

    <!-- Botón CSV -->
    <div class="mt-4 text-end">
      <button @click="exportToCSV" class="btn btn-outline-success">
        <i class="bi bi-filetype-csv"></i> Exportar a CSV
      </button>
    </div>

    <!-- Mapa de Asientos -->
    <div class="mt-5 card shadow-sm p-4">
      <h5 class="mb-3">Mapa de Asientos</h5>

      <div v-if="selectedBusId === '0'" class="d-flex flex-column gap-4">
        <!-- Autobús 1 -->
        <div>
          <h6 class="text-primary">Autobús 1 - 10:00 AM</h6>
          <div class="seat-map d-flex flex-wrap justify-content-center">
            <div v-for="seat in allSeats" :key="'bus1-' + seat" class="m-1">
              <button
                @click="highlightSeat(seat, bus1)"
                :disabled="isSeatTaken(seat, bus1)"
                :class="[
                  'btn seat-btn',
                  { 'btn-success': bus1.selectedSeat === seat },
                  { 'btn-danger': isSeatTaken(seat, bus1) },
                  { 'btn-secondary': !isSeatTaken(seat, bus1) && bus1.selectedSeat !== seat }
                ]"
                style="width: 40px; height: 40px; font-size: 0.8rem; padding: 0;"
              >
                {{ seat }}
              </button>
            </div>
          </div>
        </div>

        <!-- Autobús 2 -->
        <div>
          <h6 class="text-primary">Autobús 2 - 2:00 PM</h6>
          <div class="seat-map d-flex flex-wrap justify-content-center">
            <div v-for="seat in allSeats" :key="'bus2-' + seat" class="m-1">
              <button
                @click="highlightSeat(seat, bus2)"
                :disabled="isSeatTaken(seat, bus2)"
                :class="[
                  'btn seat-btn',
                  { 'btn-success': bus2.selectedSeat === seat },
                  { 'btn-danger': isSeatTaken(seat, bus2) },
                  { 'btn-secondary': !isSeatTaken(seat, bus2) && bus2.selectedSeat !== seat }
                ]"
                style="width: 40px; height: 40px; font-size: 0.8rem; padding: 0;"
              >
                {{ seat }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Si se selecciona un autobús específico -->
      <div v-else>
        <h6 class="text-primary">Autobús {{ currentBus.id }}</h6>
        <div class="seat-map d-flex flex-wrap justify-content-center">
          <div v-for="seat in allSeats" :key="currentBus.id + '-' + seat" class="m-1">
            <button
              @click="highlightSeat(seat, currentBus)"
              :disabled="isSeatTaken(seat, currentBus)"
              :class="[
                'btn seat-btn',
                { 'btn-success': currentBus.selectedSeat === seat },
                { 'btn-danger': isSeatTaken(seat, currentBus) },
                { 'btn-secondary': !isSeatTaken(seat, currentBus) && currentBus.selectedSeat !== seat }
              ]"
              style="width: 40px; height: 40px; font-size: 0.8rem; padding: 0;"
            >
              {{ seat }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Edición -->
    <div v-if="editing" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar Reserva</h5>
            <button @click="closeEditModal" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveChanges">
              <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input v-model="editing.data.name" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Teléfono</label>
                <input v-model="editing.data.phone" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="editing.data.email" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Asiento</label>
                <input v-model.number="editing.data.seat" type="number" class="form-control" required />
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
    <div v-if="deleting" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body text-center">
            <i class="bi bi-exclamation-circle-fill text-danger display-4 mb-3"></i>
            <h5 class="mb-3">¿Estás seguro de eliminar esta reserva?</h5>
            <div class="d-flex gap-2">
              <button @click="deleteReservation" class="btn btn-danger w-100">Eliminar</button>
              <button @click="closeDeleteModal" class="btn btn-outline-secondary w-100">Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  name: "AdminPanel",
  data() {
    return {
      reservations: [],
      editing: null,
      deleting: null,

      bus1: {
        id: 1,
        reservations: [],
        selectedSeat: null
      },
      bus2: {
        id: 2,
        reservations: [],
        selectedSeat: null
      },
      searchQuery: "",
      seatFilter: null,
      selectedBusId: "0", // '0' = todos los autobuses
      currentPage: 1,
      itemsPerPage: 10,
      allSeats: Array.from({ length: 49 }, (_, i) => i + 1)
    };
  },
  computed: {
    isMobile() {
      return window.innerWidth < 768;
    },
    currentBus() {
      if (this.selectedBusId === "0") return null;
      const id = parseInt(this.selectedBusId);
      return id === 1 ? this.bus1 : id === 2 ? this.bus2 : null;
    },
    filteredReservations() {
      let results = [];

      if (this.selectedBusId === "0") {
        results = [...this.bus1.reservations, ...this.bus2.reservations];
      } else {
        const bus = this.currentBus;
        if (bus) {
          results = [...bus.reservations];
        }
      }

      // Filtrar por nombre/teléfono
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        results = results.filter(
          (r) =>
            r.data.name?.toLowerCase().includes(query) ||
            r.data.phone?.toLowerCase().includes(query)
        );
      }

      // Filtrar por asiento
      if (this.seatFilter !== null && !isNaN(this.seatFilter)) {
        results = results.filter((r) => r.data.seat === parseInt(this.seatFilter));
      }

      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return results.slice(start, end);
    },
    totalPages() {
      let totalItems = 0;

      if (this.selectedBusId === "0") {
        totalItems = this.bus1.reservations.length + this.bus2.reservations.length;
      } else {
        const bus = this.currentBus;
        totalItems = bus ? bus.reservations.length : 0;
      }

      return Math.ceil(totalItems / this.itemsPerPage) || 1;
    }
  },
  methods: {
    async loadReservations() {
      try {
        const q = collection(db, "reservations");
        const querySnapshot = await getDocs(q);

        this.bus1.reservations = [];
        this.bus2.reservations = [];

        querySnapshot.forEach(doc => {
          const data = doc.data();
          const busId = data.busId || 1;

          if (busId === 1) {
            this.bus1.reservations.push({
              id: doc.id,
              data
            });
          } else if (busId === 2) {
            this.bus2.reservations.push({
              id: doc.id,
              data
            });
          }
        });

      } catch (error) {
        console.error("Error al cargar reservas:", error);
        alert("Hubo un problema al cargar las reservas.");
      }
    },
    setPage(page) {
      this.currentPage = page;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    editReservation(reservation) {
      if (!reservation || !reservation.id) return;
      this.editing = JSON.parse(JSON.stringify(reservation));
    },
    closeEditModal() {
      this.editing = null;
    },
    async saveChanges() {
      if (!this.editing) return;
      try {
        const reservationRef = doc(db, "reservations", this.editing.id);
        await updateDoc(reservationRef, this.editing.data);
        this.closeEditModal();
        this.loadReservations(); // Recargar datos
      } catch (error) {
        console.error("Error al guardar cambios:", error);
        alert("Hubo un problema al guardar los cambios.");
      }
    },
    confirmDelete(reservation) {
      if (!reservation || !reservation.id) return;
      this.deleting = reservation;
    },
    closeDeleteModal() {
      this.deleting = null;
    },
    async deleteReservation() {
      if (!this.deleting || !this.deleting.id) {
        alert("No se puede borrar este registro.");
        return;
      }

      try {
        await deleteDoc(doc(db, "reservations", this.deleting.id));
        this.closeDeleteModal();
        this.loadReservations(); // Refresca datos
      } catch (error) {
        console.error("Error al borrar:", error);
        alert("Hubo un problema al eliminar la reserva.");
      }
    },
    isSeatTaken(seat, bus) {
      return bus.reservations.some(r => r.data.seat === seat);
    },
    highlightSeat(seat, bus) {
      if (this.isSeatTaken(seat, bus)) return;
      bus.selectedSeat = bus.selectedSeat === seat ? null : seat;
    },
    formatDate(timestamp) {
      if (!timestamp) return "N/A";
      if (typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toLocaleString();
      } else if (timestamp instanceof Date) {
        return timestamp.toLocaleString();
      } else if (typeof timestamp === 'string') {
        const date = new Date(timestamp);
        return isNaN(date.getTime()) ? "Formato desconocido" : date.toLocaleString();
      } else if (typeof timestamp === 'number') {
        const date = new Date(timestamp);
        return isNaN(date.getTime()) ? "Fecha inválida" : date.toLocaleString();
      } else {
        console.error("Formato de fecha desconocido:", timestamp);
        return "Formato desconocido";
      }
    },
    exportToCSV() {
      const csvRows = [];
      csvRows.push(["Nombre", "Teléfono", "Email", "Asiento", "Autobús", "Fecha"].join(","));
      let allReservations = [];

      if (this.selectedBusId === "0") {
        allReservations = [...this.bus1.reservations, ...this.bus2.reservations];
      } else {
        const bus = this.currentBus;
        if (bus) {
          allReservations = [...bus.reservations];
        }
      }

      allReservations.forEach((r) => {
        csvRows.push(
          [
            `"${r.data.name || ""}"`,
            `"${r.data.phone || ""}"`,
            `"${r.data.email || ""}"`,
            `"${r.data.seat || ""}"`,
            `"${r.data.busId || "1"}"`,
            `"${this.formatDate(r.data.timestamp)}"`
          ].join(",")
        );
      });

      const csvString = csvRows.join("\n");
      const blob = new Blob([csvString], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", `reservas-${this.selectedBusId}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    clearFilters() {
      this.searchQuery = "";
      this.seatFilter = null;
      this.currentPage = 1;
    }
  },
  mounted() {
    this.loadReservations();
  }
};
</script>

<style scoped>
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

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.pagination .page-item.active .page-link {
  background-color: #0d6efd;
  border-color: #0d6efd;
  color: white;
}
</style>