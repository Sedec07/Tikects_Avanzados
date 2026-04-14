<template>
  <div style="padding: 20px;">
    <h1>Panel de Tickets</h1>
    <p>Bienvenido al sistema. Aquí se gestionarán los SLAs y asignaciones.</p>
    <button @click="logout">Cerrar Sesión</button>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const logout = () => {
  auth.logout()
  router.push('/')
}
</script>