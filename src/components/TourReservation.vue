<template>
  <div class="container py-5">
    <!-- Encabezado -->
    <div class="text-center mb-4">
      <h2 class="fw-bold text-primary">Reserva tu Tour hacia la</h2>
      <h3 class="fw-bold text-secondary">Isla Saona</h3>
    </div>

    <!-- Barra de progreso -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div :class="step >= 1 ? 'progress-step active' : 'progress-step'">Datos Personales</div>
      <div :class="step >= 2 ? 'progress-step active' : 'progress-step'">Asiento</div>
      <div :class="step >= 3 ? 'progress-step active' : 'progress-step'">Confirmación</div>
    </div>

    <!-- Step 1: Datos Personales -->
    <div v-if="step === 1" class="card shadow-sm rounded-4 border-0 p-4">
      <h5 class="mb-4 text-primary">Tus datos personales</h5>
      <form @submit.prevent="nextStep">
        <div class="mb-3">
          <label>Nombre completo</label>
          <input v-model="formData.name" required type="text" class="form-control form-control-sm rounded-pill" placeholder="Ej: María Pérez" />
        </div>
        <div class="mb-3">
          <label>Email</label>
          <input v-model="formData.email" required type="email" class="form-control form-control-sm rounded-pill" placeholder="ejemplo@correo.com" />
        </div>
        <div class="mb-3">
          <label>Teléfono</label>
          <input v-model="formData.phone" required type="tel" class="form-control form-control-sm rounded-pill" placeholder="+1 809 123 4567" />
        </div>
        <!-- Nuevo campo: Cumpleaños -->
        <div class="mb-3">
          <label>¿Cuándo es tu cumpleaños?</label>
          <input v-model="formData.birthday" type="date" class="form-control form-control-sm rounded-pill" />
        </div>
        <!-- Viajes realizados -->
        <div class="mb-3">
          <label>¿Cuántos viajes has hecho con nosotros?</label>
          <select v-model="formData.trips" required class="form-select form-select-sm rounded-pill">
            <option value="">Selecciona</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5+">5 o más</option>
          </select>
        </div>
        <!-- Niños que lleva -->
        <div class="mb-3">
          <label>¿Cuántos niños llevas?</label>
          <input v-model.number="formData.children" type="number" min="0" class="form-control form-control-sm rounded-pill" />
        </div>
        <!-- ¿Cómo nos conociste? -->
        <div class="mb-3">
          <label>¿Cómo nos conociste?</label>
          <select v-model="formData.recommendationSource" required class="form-select form-select-sm rounded-pill">
            <option value="">Selecciona</option>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="Amigo/Familiar">Amigo / Familia</option>
            <option value="Google">Google</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <button type="submit" class="btn btn-lg btn-primary w-100 rounded-pill mt-3">Siguiente</button>
      </form>
    </div>

    <!-- Step 2: Seleccionar Asiento -->
    <div v-if="step === 2" class="card shadow-sm rounded-4 border-0 p-4">
      <h5 class="mb-3 text-primary">Elige tu asiento</h5>
      <p class="small text-muted mb-3">Selecciona un único asiento disponible.</p>

      <!-- Leyenda -->
      <div class="d-flex gap-3 justify-content-center mb-3">
        <span><i class="bi bi-square-fill text-primary"></i> Disponible</span>
        <span><i class="bi bi-square-fill text-success"></i> Seleccionado</span>
        <span><i class="bi bi-square-fill text-danger"></i> Ocupado</span>
      </div>

      <!-- Imagen del Autobús -->
      <div class="mb-4 text-center">
        <img src="../assets/bus.jpg" alt="Autobús con asientos numerados" class="img-fluid rounded shadow-sm" style="max-height: 200px; object-fit: cover;" />
      </div>

      <!-- Mapa de Asientos -->
      <div class="seat-map d-flex flex-wrap justify-content-center">
        <div v-for="seat in 49" :key="seat" class="m-1">
          <button
            @click="toggleSeat(seat)"
            :disabled="isSeatTaken(seat)"
            :class="[
              'btn seat',
              selectedSeat === seat ? 'btn-success' : 'btn-outline-primary',
              takenSeats.includes(seat) ? 'btn-danger' : ''
            ]"
            style="width: 38px; height: 38px; font-size: 0.8rem; padding: 0;"
          >
            {{ seat }}
          </button>
        </div>
      </div>

      <p class="mt-3 text-center small">Asiento seleccionado: {{ selectedSeat || 'Ninguno' }}</p>

      <div class="d-grid gap-2 d-md-flex justify-content-md-between mt-4">
        <button @click="prevStep" class="btn btn-outline-secondary rounded-pill">Anterior</button>
        <button @click="nextStep" :disabled="!selectedSeat" class="btn btn-primary rounded-pill">
          Confirmar
        </button>
      </div>
    </div>

    <!-- Step 3: Confirmación -->
    <div v-if="step === 3 && !showFinalInfo" class="card shadow-sm rounded-4 border-0 p-4">
      <div class="text-center mb-4">
        <i class="bi bi-check-circle-fill text-success display-4"></i>
        <h4 class="mt-3 fw-bold">¡Reservación Completada!</h4>
        <p class="text-muted">Gracias por reservar con nosotros.</p>
      </div>

      <ul class="list-group list-group-flush mb-4">
        <li class="list-group-item"><strong>Nombre:</strong> {{ formData.name }}</li>
        <li class="list-group-item"><strong>Email:</strong> {{ formData.email }}</li>
        <li class="list-group-item"><strong>Teléfono:</strong> {{ formData.phone }}</li>
        <li v-if="formData.birthday" class="list-group-item"><strong>Cumpleaños:</strong> {{ formData.birthday }}</li>
        <li v-if="formData.trips" class="list-group-item"><strong>Viajes realizados:</strong> {{ formData.trips }}</li>
        <li v-if="formData.children > 0" class="list-group-item"><strong>Niños:</strong> {{ formData.children }}</li>
        <li v-if="formData.recommendationSource" class="list-group-item"><strong>Recomendado por:</strong> {{ formData.recommendationSource }}</li>
        <li class="list-group-item">
          <strong>Asiento:</strong> {{ selectedSeat }}
        </li>
      </ul>

      <button @click="submitForm" class="btn btn-success w-100 rounded-pill py-3">Finalizar Reserva</button>
    </div>

    <!-- Step 4: Información Final -->
    <div v-if="showFinalInfo" class="card shadow-sm rounded-4 border-0 p-4 text-center">
      <!-- Mensaje de éxito -->
      <h4 class="my-3 fw-bold">¡Nos vemos pronto!</h4>
      <p class="text-muted mb-4">Tu reserva ha sido confirmada. A continuación encontrarás los detalles finales del tour.</p>

      <!-- Botón de WhatsApp -->
      <div class="mb-4">
        <a href="https://wa.me/8097140305 " target="_blank" class="btn btn-success w-100 rounded-pill py-3">
          <i class="bi bi-whatsapp me-2"></i> Unirme al grupo de WhatsApp
        </a>
      </div>

      <!-- Detalles del tour -->
      <div class="card shadow-sm p-4 mb-4">
        <h5 class="mb-3 text-center">Detalles del Tour</h5>
        <ul class="list-group list-group-flush">
          <li class="list-group-item"><span class="emoji-badge">🍴</span> Desayuno</li>
          <li class="list-group-item"><span class="emoji-badge">🥘</span> Almuerzo Criollo</li>
          <li class="list-group-item"><span class="emoji-badge">🍪</span> Snack</li>
          <li class="list-group-item"><span class="emoji-badge">🚗</span> Transporte ejecutivo</li>
          <li class="list-group-item"><span class="emoji-badge">🏥</span> Asistencia médica</li>
          <li class="list-group-item"><span class="emoji-badge">🎲</span> Juegos de Mesa y playa</li>
          <li class="list-group-item"><span class="emoji-badge">👩‍🏫</span> Guías</li>
          <li class="list-group-item"><span class="emoji-badge">🛡️</span> Chalecos y equipo de seguridad</li>
          <li class="list-group-item"><span class="emoji-badge">📸</span> Fotos y vídeos</li>
          <li class="list-group-item"><span class="emoji-badge">🚤</span> Recorrido en lancha rápida y catamarán</li>
          <li class="list-group-item"><span class="emoji-badge">🏊‍♂️</span> Instrucciones básicas de natación</li>
          <li class="list-group-item"><span class="emoji-badge">🌐</span> Internet</li>
        </ul>
      </div>

      <!-- Información de contacto -->
      <div class="card shadow-sm p-4">
        <h5 class="mb-3">Reservaciones y Contactos</h5>
        <p class="mb-1"><strong>Teléfono:</strong> (809) 714 - 0305</p>
        <p class="mb-1"><strong>Hora de Salida:</strong> 5:00 AM</p>
        <p class="mb-1"><strong>Fecha:</strong> 15 de Junio</p>
        <p class="mb-2"><strong>Puntos de Partida:</strong></p>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Supermercado Central</li>
          <li class="list-group-item">Elevado de Cienfuegos</li>
          <li class="list-group-item">Av. 27 Plaza Lama</li>
        </ul>
      </div>

      <!-- Botón para regresar -->
      <button @click="goBack" class="btn btn-outline-secondary w-100 rounded-pill mt-4">Regresar al inicio</button>
    </div>
  </div>
</template>

<script>
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

export default {
  data() {
    return {
      step: 1,
      showFinalInfo: false,
      formData: {
        name: '',
        email: '',
        phone: '',
        birthday: '',
        trips: '',
        children: 0,
        recommendationSource: ''
      },
      fixedDate: '2025-06-01',
      fixedTime: '10:00',
      selectedSeat: null,
      takenSeats: []
    };
  },
  watch: {
    // Cuando entramos al paso 2, recargamos los asientos ocupados
    step(newStep) {
      if (newStep === 2) {
        this.loadTakenSeats();
      }
    }
  },
  methods: {
    nextStep() {
      this.step++;
    },
    prevStep() {
      this.step--;
    },
    toggleSeat(seat) {
      if (this.isSeatTaken(seat)) return;

      // Si ya está seleccionado, lo deselecciona
      if (this.selectedSeat === seat) {
        this.selectedSeat = null;
      } else {
        this.selectedSeat = seat;
      }
    },
    isSeatTaken(seat) {
      return this.takenSeats.includes(seat);
    },
    async loadTakenSeats() {
      try {
        const reservationsRef = collection(db, "reservations");
        const q = query(
          reservationsRef,
          where("date", "==", this.fixedDate),
          where("time", "==", this.fixedTime)
        );
        const querySnapshot = await getDocs(q);

        const allSeats = [];
        querySnapshot.forEach((doc) => {
          const seat = doc.data().seat;
          if (seat) allSeats.push(seat);
        });

        this.takenSeats = [...new Set(allSeats)];
        console.log('Asientos ocupados:', this.takenSeats);
      } catch (error) {
        console.error("Error al cargar asientos:", error);
      }
    },
    async submitForm() {
      try {
        await this.loadTakenSeats();

        if (!this.selectedSeat) {
          alert("Por favor, selecciona un asiento.");
          return;
        }

        if (this.isSeatTaken(this.selectedSeat)) {
          alert(`El asiento ${this.selectedSeat} ya está ocupado.`);
          return;
        }

        await addDoc(collection(db, "reservations"), {
          ...this.formData,
          seat: this.selectedSeat,
          date: this.fixedDate,
          time: this.fixedTime,
          timestamp: new Date()
        });

        // Ocultar formulario y mostrar pantalla final
        this.showFinalInfo = true;
      } catch (error) {
        console.error("Error al guardar la reserva:", error);
        alert("❌ Hubo un error al guardar tu reserva.");
      }
    },
    goBack() {
      this.step = 1;
      this.showFinalInfo = false;
      this.resetForm();
    },
    resetForm() {
      this.formData = {
        name: '',
        email: '',
        phone: '',
        birthday: '',
        trips: '',
        children: 0,
        recommendationSource: ''
      };
      this.selectedSeat = null;
      this.takenSeats = [];
    }
  },
  mounted() {
    this.loadTakenSeats(); // Cargar los asientos ocupados al iniciar
  }
};
</script>

<style scoped>
.progress-step {
  flex: 1;
  text-align: center;
  font-weight: bold;
  color: #999;
  transition: color 0.3s ease;
}
.progress-step.active {
  color: #0d6efd;
}
.seat {
  width: 38px;
  height: 38px;
  padding: 0;
  font-size: 0.8rem;
  transition: transform 0.2s ease;
}
.seat:hover:not(.btn-danger):not(:disabled) {
  transform: scale(1.1);
}
.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}
.btn-success:hover {
  background-color: #218838;
}
.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
  pointer-events: none;
}
.card {
  border-radius: 1rem;
}
@media (min-width: 768px) {
  .seat {
    width: 42px;
    height: 42px;
    font-size: 0.9rem;
  }
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