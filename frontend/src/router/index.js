import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth' // 1. Importamos el almacén de seguridad
import MainLayout from '../layouts/MainLayout.vue'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import ClubesView from '../views/ClubesView.vue'
import TicketsView from '../views/TicketsView.vue' // 2. Importamos la nueva vista

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView,
      },
      {
        path: 'about',
        name: 'about',
        component: AboutView,
      },
      {
        path: 'clubes',
        name: 'clubes',
        component: ClubesView,
      },
      {
        path: 'tickets', // 3. Nueva ruta de tickets
        name: 'tickets',
        component: TicketsView,
        meta: { requiresAuth: true } // 🔒 Etiqueta para proteger esta ruta
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 👮 4. GUARDIA DE NAVEGACIÓN (Navigation Guard)
router.beforeEach((to, from, next) => {
  const auth = useAuthStore() // Accedemos al estado de Pinia
  
  // Si la ruta pide estar logueado y el usuario no tiene token...
  if (to.meta.requiresAuth && !auth.token) {
    alert('Debes iniciar sesión para ver esta sección')
    next('/') // Lo mandamos al Home (Login)
  } else {
    next() // Si todo está bien, lo dejamos pasar
  }
})

export default router