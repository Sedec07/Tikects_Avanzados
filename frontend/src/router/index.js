import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Layout
import MainLayout from '../layouts/MainLayout.vue'

// Vistas
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import ClubesView from '../views/ClubesView.vue'
import TicketsView from '../views/TicketsView.vue'
import CreateTicketView from '../views/CreateTicketView.vue'

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
        path: 'tickets',
        name: 'tickets',
        component: TicketsView,
        meta: { requiresAuth: true }
      },
      {
        path: 'crear-ticket',
        name: 'crear-ticket',
        component: CreateTicketView,
        meta: { requiresAuth: true }
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 🔒 Protección de rutas
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.token) {
    alert('Debes iniciar sesión para ver esta sección')
    next('/')
  } else {
    next()
  }
})

export default router