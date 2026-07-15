import { createRouter, createWebHistory } from 'vue-router'
import { useBookingStore } from '../store/booking'

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
    path: '/my-bookings',
    name: 'my-bookings',
    component: () => import('../views/MyBookingsView.vue')
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
    path: '/admin',
    component: () => import('../views/AdminLayoutView.vue'),
    meta: { requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('../views/admin/AdminDashboardView.vue')
      },
      {
        path: 'rooms',
        name: 'admin-rooms',
        component: () => import('../views/admin/AdminRoomsView.vue')
      },
      {
        path: 'bookings',
        name: 'admin-bookings',
        component: () => import('../views/admin/AdminBookingsView.vue')
      }
    ]
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

// Route guard: only logged-in users with the 'admin' role may access /admin/*.
router.beforeEach((to) => {
  if (to.meta.requiresAdmin) {
    const store = useBookingStore()
    if (!store.isLoggedIn || store.currentUser?.role !== 'admin') {
      return { name: 'login' }
    }
  }
  return true
})

export default router
