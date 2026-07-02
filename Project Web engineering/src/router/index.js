import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/rooms',
    name: 'rooms',
    component: () => import('../views/RoomsView.vue')
  },
  {
    path: '/rooms/:id',
    name: 'room-details',
    component: () => import('../views/RoomDetailsView.vue'),
    props: true
  },
  {
    path: '/booking/:id',
    name: 'booking',
    component: () => import('../views/BookingView.vue'),
    props: true
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('../views/ContactView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
