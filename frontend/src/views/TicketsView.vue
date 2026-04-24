<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-5">
      <h2 class="fw-bold text-dark m-0">🎫 Centro de Soporte</h2>
      <div class="d-flex gap-2">
        <button @click="$router.push('/tickets/nuevo')" class="btn btn-success fw-bold">+ Nuevo Ticket</button>
        <button @click="logout" class="btn btn-outline-danger btn-sm">Cerrar Sesión</button>
      </div>
    </div>

    <h4 class="mb-4 text-secondary">Mis Solicitudes Actuales</h4>

    <div class="row row-cols-1 row-cols-md-3 g-4">
      <div class="col" v-for="ticket in tickets" :key="ticket.id">
        <div @click="$router.push(`/tickets/${ticket.id}`)" style="cursor: pointer;" class="h-100">
          <InfoCard 
            :title="`Ticket #${ticket.id}`"
            :name="ticket.titulo"
            :description="`Prioridad: ${ticket.prioridad}`"
            :body="ticket.descripcion"
            :image="obtenerImagen(ticket.prioridad)"
            class="h-100"
          />
        </div>
      </div>
    </div>
    
    <div v-if="tickets.length === 0" class="text-muted text-center w-100 py-5">
      <p class="lead">No tienes tickets registrados aún.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import axios from 'axios';
import InfoCard from '../components/InfoCard.vue';

const auth = useAuthStore();
const router = useRouter();
const tickets = ref([]);

const logout = () => { auth.logout(); router.push('/'); };

const obtenerTickets = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/tickets', {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    tickets.value = res.data;
  } catch (error) {
    console.error("Error cargando tickets", error);
  }
};

const obtenerImagen = (prioridad) => {
  if (prioridad === 'Crítica') return 'https://img.freepik.com/vector-gratis/simbolo-signo-exclamacion-rojo-e-icono-signo-atencion-o-precaucion-problema-peligro-alerta_40876-3505.jpg';
  return 'https://img.freepik.com/vector-gratis/simbolo-alerta-campana-amarilla-vectorial-3d-redes-sociales-icono-notificacion-signo-exclamacion-rojo-aislado_40876-3504.jpg';
};

onMounted(obtenerTickets);
</script>