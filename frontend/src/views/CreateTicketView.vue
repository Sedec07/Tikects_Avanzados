<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card shadow-lg border-0">
          <div class="card-header bg-primary text-white p-3">
            <h4 class="m-0 text-center">📝 Generar Nueva Solicitud</h4>
          </div>
          <div class="card-body p-4">
            <form @submit.prevent="enviarTicket">
              <div class="mb-3">
                <label class="form-label fw-bold">Asunto / Título</label>
                <input 
                  v-model="ticket.titulo" 
                  type="text" 
                  class="form-control" 
                  placeholder="Ej: Falla en acceso a base de datos" 
                  required
                >
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold">Prioridad de la falla</label>
                <select v-model="ticket.prioridad" class="form-select">
                  <option value="Baja">Baja - No urgente</option>
                  <option value="Media">Media - Normal</option>
                  <option value="Alta">Alta - Prioritario</option>
                  <option value="Crítica">Crítica - Bloqueo total</option>
                </select>
              </div>

              <div class="mb-4">
                <label class="form-label fw-bold">Descripción detallada</label>
                <textarea 
                  v-model="ticket.descripcion" 
                  class="form-control" 
                  rows="4" 
                  placeholder="Describe qué sucede, pasos para replicar o errores que ves..." 
                  required
                ></textarea>
              </div>

              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary w-100 fw-bold shadow-sm">
                  🚀 Crear Solicitud
                </button>
                <button 
                  type="button" 
                  @click="$router.push('/tickets')" 
                  class="btn btn-outline-secondary w-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const ticket = ref({
  titulo: '',
  descripcion: '',
  prioridad: 'Media'
});

const enviarTicket = async () => {
  try {
    // IMPORTANTE: Enviamos el token en los headers para que el controlador sepa quién eres
    await axios.post('http://localhost:3000/api/tickets', ticket.value, {
      headers: { 
        Authorization: Bearer ${auth.token} 
      }
    });

    alert("✅ Ticket registrado correctamente. El equipo de soporte será notificado.");
    router.push('/tickets'); // Regresamos al listado automáticamente
  } catch (error) {
    console.error("Error al crear ticket:", error);
    const msg = error.response?.data?.error || "Error de conexión con el servidor";
    alert("❌ Hubo un fallo: " + msg);
  }
};
</script>

<style scoped>
.card {
  border-radius: 15px;
}
.card-header {
  border-radius: 15px 15px 0 0 !important;
}
</style>