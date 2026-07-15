<script setup>
import { ref } from 'vue'
import { useBookingStore } from '../../store/booking'

const bookingStore = useBookingStore()
const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}
</script>

<template>
  <header class="navbar">
    <div class="container navbar-inner">
      <RouterLink to="/" class="brand">Stay<span>Ease</span></RouterLink>

      <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle navigation">
        &#9776;
      </button>

      <nav class="nav-links" :class="{ open: menuOpen }">
        <RouterLink to="/" class="nav-link" @click="menuOpen = false">Home</RouterLink>
        <RouterLink to="/rooms" class="nav-link" @click="menuOpen = false">Rooms</RouterLink>
        <RouterLink to="/contact" class="nav-link" @click="menuOpen = false">Contact</RouterLink>

        <template v-if="bookingStore.currentUser">
          <RouterLink
            v-if="bookingStore.currentUser.role === 'admin'"
            to="/admin"
            class="nav-link"
            @click="menuOpen = false"
          >
            Admin Panel
          </RouterLink>
          <RouterLink v-else to="/my-bookings" class="nav-link" @click="menuOpen = false">
            My Bookings
          </RouterLink>
          <span class="nav-user">Hi, {{ bookingStore.currentUser.fullName }}</span>
          <button class="btn btn-outline btn-sm" @click="bookingStore.logout()">Logout</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="btn btn-outline btn-sm" @click="menuOpen = false">
            Login
          </RouterLink>
        </template>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 50;
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.9rem;
  padding-bottom: 0.9rem;
}

.brand {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-primary);
}

.brand span {
  color: var(--color-accent);
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: var(--color-primary);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: var(--color-text);
  font-weight: 500;
  padding: 0.3rem 0;
  border-bottom: 2px solid transparent;
}

.nav-link.router-link-exact-active {
  color: var(--color-primary);
  border-bottom-color: var(--color-accent);
}

.nav-user {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.btn-sm {
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }
  .nav-links {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--color-surface);
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem 1.5rem;
    gap: 1rem;
    border-bottom: 1px solid var(--color-border);
    display: none;
  }
  .nav-links.open {
    display: flex;
  }
}
</style>
