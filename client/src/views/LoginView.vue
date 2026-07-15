<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../store/booking'
import BaseAlert from '../components/common/BaseAlert.vue'

const router = useRouter()
const store = useBookingStore()

const form = reactive({
  email: '',
  password: ''
})

const loginAsAdmin = ref(false)
const roleError = ref('')

async function handleLogin() {
  roleError.value = ''
  const success = await store.login(form)
  if (!success) return

  const isAdmin = store.currentUser?.role === 'admin'

  if (loginAsAdmin.value && !isAdmin) {
    roleError.value = 'This account does not have admin access.'
    store.logout()
    return
  }

  if (isAdmin) {
    router.push({ name: 'admin-dashboard' })
  } else {
    router.push('/')
  }
}
</script>

<template>
  <section class="section container auth-view">
    <div class="auth-card card">
      <h1>Welcome Back</h1>
      <p class="text-muted">Log in to manage your bookings.</p>

      <BaseAlert v-if="roleError" type="error" :message="roleError" />
      <BaseAlert v-else-if="store.authError" type="error" :message="store.authError" />

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" v-model="form.email" type="email" class="form-control" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            class="form-control"
            required
          />
        </div>

        <label class="admin-toggle">
          <input type="checkbox" v-model="loginAsAdmin" />
          <span>Login as Admin</span>
        </label>

        <button type="submit" class="btn btn-primary auth-submit" :disabled="store.authLoading">
          {{ store.authLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <p class="auth-switch text-muted">
        Don't have an account? <RouterLink to="/register">Register here</RouterLink>
      </p>
    </div>
  </section>
</template>

<style scoped>
.auth-view {
  display: flex;
  justify-content: center;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  padding: 2rem;
}

.admin-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: 1.25rem;
  cursor: pointer;
}

.admin-toggle input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.auth-submit {
  width: 100%;
  margin-top: 0.5rem;
}

.auth-switch {
  text-align: center;
  margin-top: 1.25rem;
  font-size: 0.9rem;
}
</style>
