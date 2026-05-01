import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import MainLayout from '../layouts/MainLayout.vue'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import ClubesView from '../views/ClubesView.vue'
import TicketsView from '../views/TicketsView.vue'
import TicketDetailView from '../views/TicketDetailView.vue'
import CreateTicketView from '../views/CreateTicketView.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'home', component: HomeView },
      { path: 'about', name: 'about', component: AboutView },
      { path: 'clubes', name: 'clubes', component: ClubesView },

      //  VER TICKETS
      { 
        path: 'tickets', 
        name: 'tickets', 
        component: TicketsView, 
        meta: { requiresAuth: true } 
      },

      //  CREAR TICKET
      { 
        path: 'tickets/nuevo', 
        name: 'create-ticket', 
        component: CreateTicketView, 
        meta: { requiresAuth: true } 
      },

      // DETALLE
      { 
        path: 'tickets/:id', 
        name: 'ticket-detail', 
        component: TicketDetailView, 
        props: true, 
        meta: { requiresAuth: true } 
      },
    ],
  },

  // RUTA NO ENCONTRADA 
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

//  GUARDIA GLOBAL MEJORADA
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  //  Protección básica
  if (to.meta.requiresAuth && !auth.token) {
    alert('Debes iniciar sesión para ver esta sección')
    return next('/')
  }

  //  VALIDAR ID EN DETALLE
  if (to.name === 'ticket-detail') {
    const id = parseInt(to.params.id)

    if (isNaN(id)) {
      return next('/tickets')
    }
  }

  next()
})

export default router