<template>
  <div class="container mt-4">

    <!-- BOTONES -->
    <div class="d-flex gap-2 mb-3">
      <router-link to="/crear-ticket" class="btn btn-success">
        ➕ Crear Ticket
      </router-link>

      <router-link to="/tickets" class="btn btn-outline-primary">
        📋 Ver Tickets
      </router-link>
    </div>

    <!-- HEADER -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold text-primary">🎫 Centro de Soporte</h2>
      <button @click="logout" class="btn btn-outline-danger btn-sm">
        Cerrar Sesión
      </button>
    </div>
    <p>Tickets: {{ tickets }}</p>

    <!-- LISTA -->
    <div class="tickets-grid">
      <InfoCard 
        v-for="ticket in tickets" 
        :key="ticket.id"
        :title="`Ticket #${ticket.id}`"
        :name="ticket.titulo"
        :description="`Prioridad: ${ticket.prioridad}`"
        :body="ticket.descripcion"
        :image="obtenerImagen(ticket.prioridad)"
      />
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import axios from 'axios';
import InfoCard from '../components/InfoCard.vue'; // Importamos tu componente InfoCard   
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

const obtenerImagen = (prioridad) => {
  if (prioridad === 'Crítica') return 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e84?q=80&w=400';
  return 'https://images.unsplash.com/photo-1454165833767-02754a7c1b21?q=80&w=400';
};

onMounted(obtenerTickets);
</script>

<style scoped>

.tickets-layout {
  max-width: 1200px;
}

/* GRID DE TICKETS */
.tickets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

/* MEJORA CARDS */
.info-card {
  transition: all 0.2s ease;
}

.info-card:hover {
  transform: translateY(-5px);
}

/* FORMULARIO MÁS LIMPIO */
.card input,
.card select {
  border-radius: 8px;
}

.card button {
  border-radius: 8px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .row {
    display: flex;
    flex-direction: column;
  }
}

</style>