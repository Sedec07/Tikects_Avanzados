<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold text-primary">🎫 Centro de Soporte</h2>
      <button @click="logout" class="btn btn-outline-danger btn-sm">Cerrar Sesión</button>
    </div>

    <div class="card border-0 shadow-sm mb-5 bg-light">
      <div class="card-body p-4">
        <h5 class="mb-3">¿En qué podemos ayudarte hoy?</h5>
        <div class="row g-3">
          <div class="col-md-4">
            <input v-model="nuevoTicket.titulo" type="text" class="form-control" placeholder="Título corto del problema">
          </div>
          <div class="col-md-3">
            <select v-model="nuevoTicket.prioridad" class="form-select">
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
              <option value="Crítica">Crítica</option>
            </select>
          </div>
          <div class="col-md-5">
            <div class="input-group">
              <input v-model="nuevoTicket.descripcion" type="text" class="form-control" placeholder="Describe brevemente la falla...">
              <button @click="crearTicket" class="btn btn-primary">Crear Ticket</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <h4 class="mb-4">Mis Solicitudes Actuales</h4>

    <div class="d-flex flex-wrap gap-4 justify-content-center">
      <InfoCard 
        v-for="ticket in tickets" 
        :key="ticket.id"
        :title="`Ticket #${ticket.id}`"
        :name="ticket.titulo"
        :description="`Prioridad: ${ticket.prioridad}`"
        :body="ticket.descripcion"
        :image="obtenerImagen(ticket.prioridad)"
      />
      
      <div v-if="tickets.length === 0" class="text-muted text-center w-100 py-5">
        <p>No tienes tickets registrados aún. ¡Crea el primero arriba!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import axios from 'axios';
import InfoCard from '../components/InfoCard.vue'; // Importamos tu componente

const auth = useAuthStore();
const router = useRouter();
const tickets = ref([]);
const nuevoTicket = ref({ titulo: '', descripcion: '', prioridad: 'Media' });

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

const crearTicket = async () => {
  if (!nuevoTicket.value.titulo) return alert("Ponle un título");
  try {
    await axios.post('http://localhost:3000/api/tickets', nuevoTicket.value, {
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    nuevoTicket.value = { titulo: '', descripcion: '', prioridad: 'Media' };
    obtenerTickets(); // Recargar lista
  } catch (error) {
    alert("Error al crear el ticket. Revisa la consola del servidor.");
  }
};

// Función para poner una imagen según la prioridad
const obtenerImagen = (prioridad) => {
  if (prioridad === 'Crítica') return 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e84?q=80&w=400';
  return 'https://images.unsplash.com/photo-1454165833767-02754a7c1b21?q=80&w=400';
};

onMounted(obtenerTickets);
</script>