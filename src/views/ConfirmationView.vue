<template>
  <div class="container py-5">
    <!-- Encabezado -->
    <div class="text-center mb-4">
      <i class="bi bi-check-circle-fill text-success display-4"></i>
      <h2 class="fw-bold mt-3">¡Reservación Completada!</h2>
      <p class="text-muted">Gracias por reservar con nosotros.</p>
    </div>

    <!-- Detalles del tour -->
    <div class="card shadow-sm p-4 mb-4">
      <h5 class="mb-3">Detalles del Tour</h5>
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

    <!-- Botón de WhatsApp -->
    <div class="mb-4 text-center">
      <a href="https://wa.me/8097140305 " target="_blank" class="btn btn-success w-100 rounded-pill py-3">
        <i class="bi bi-whatsapp me-2"></i> Unirme al grupo de WhatsApp
      </a>
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

    <!-- Botón de regreso -->
    <button @click="goBack" class="btn btn-outline-secondary w-100 rounded-pill mt-4">Regresar al inicio</button>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.push('/reservar');
    }
  }
};
</script>

<style scoped>
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