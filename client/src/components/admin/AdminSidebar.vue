<script setup>
import { useRouter } from 'vue-router'
import { useBookingStore } from '../../store/booking'

const router = useRouter()
const store = useBookingStore()

function handleLogout() {
  store.logout()
  router.push('/login')
}
</script>

<template>
  <aside class="admin-sidebar">
    <div class="admin-brand">
      Stay<span>Ease</span>
      <span class="admin-tag">Admin</span>
    </div>

    <nav class="admin-nav">
      <RouterLink to="/admin" class="admin-link" exact-active-class="active">
        Dashboard
      </RouterLink>
      <RouterLink to="/admin/rooms" class="admin-link" active-class="active">
        Rooms
      </RouterLink>
      <RouterLink to="/admin/bookings" class="admin-link" active-class="active">
        Bookings
      </RouterLink>
    </nav>

    <div class="admin-footer">
      <RouterLink to="/" class="admin-link-muted">&larr; Back to Site</RouterLink>
      <button class="btn btn-outline btn-sm logout-btn" @click="handleLogout">Logout</button>
    </div>
  </aside>
</template>

<style scoped>
.admin-sidebar {
  width: 220px;
  min-height: 100vh;
  background: var(--color-primary);
  color: #e5e7eb;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  flex-shrink: 0;
}

.admin-brand {
  font-family: var(--font-heading);
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 2rem;
  padding: 0 0.5rem;
}

.admin-brand span {
  color: var(--color-accent);
}

.admin-tag {
  display: block;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  color: #9fb3cc;
  font-weight: 400;
  text-transform: uppercase;
}

.admin-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.admin-link {
  color: #cbd5e0;
  padding: 0.65rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.92rem;
  font-weight: 500;
}

.admin-link:hover {
  background: rgba(255, 255, 255, 0.08);
}

.admin-link.active {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.admin-footer {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding-top: 1rem;
}

.admin-link-muted {
  color: #9fb3cc;
  font-size: 0.85rem;
}

.logout-btn {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.4);
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
