<template>
  <div class="container py-4" v-if="ticket">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <button @click="$router.push('/tickets')" class="btn btn-outline-secondary">← Volver al listado</button>
      <h2 class="text-primary fw-bold m-0">Detalle del Ticket #{{ ticket.id }}</h2>
    </div>

    <div class="card shadow-sm border-0">
      <div class="card-header bg-dark text-white p-3">
        <h4 class="m-0">{{ ticket.titulo }}</h4>
      </div>
      <div class="card-body p-4">
        <div class="row">
          <div class="col-md-4">
            <h5 class="fw-bold text-secondary">Descripción</h5>
            <p class="lead">{{ ticket.descripcion }}</p>
          </div>
          <div class="col-md-5 border-start">
            <div class="p-3 bg-light rounded">
              <div class="mb-3">
                <label class="small fw-bold text-muted d-block">ESTADO</label>
                <span class="badge bg-white text-dark border">{{ ticket.estado }}</span>
              </div>
              <div class="mb-3">
                <label class="small fw-bold text-muted d-block">PRIORIDAD</label>
                <span :class="badgePrio(ticket.prioridad)">{{ ticket.prioridad }}</span>
              </div>
              <div class="mb-3">
                <label class="small fw-bold text-muted d-block">LÍMITE SLA</label>
                <p class="text-danger fw-bold m-0">{{ formatearFecha(ticket.fecha_limite) }}</p>
              </div>
              <div>
                <label class="small fw-bold text-muted d-block">NIVEL DE SOPORTE</label>
                <p class="m-0">Escalado Nivel: {{ ticket.nivel_escalado }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-5">
    <div class="spinner-border text-primary" role="status"></div>
    <p class="mt-2">Cargando detalles...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const auth = useAuthStore()
const ticket = ref(null)

const badgePrio = (p) => {
  if (p === 'Crítica') return 'badge bg-danger'
  if (p === 'Alta') return 'badge bg-warning text-dark'
  return 'badge bg-info text-dark'
}

const formatearFecha = (f) => new Date(f).toLocaleString('es-CO')

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:3000/api/tickets/${route.params.id}`, {
      headers: { Authorization: `Bearer ${auth.token}` }
    })
    ticket.value = res.data
  } catch (error) {
    console.error("Error cargando el detalle:", error)
  }
})
</script>