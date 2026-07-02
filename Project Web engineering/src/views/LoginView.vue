<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../store/booking'
import BaseAlert from '../components/common/BaseAlert.vue'

const router = useRouter()
const bookingStore = useBookingStore()

const form = reactive({
  email: '',
  password: ''
})

const error = ref('')

function handleLogin() {
  if (!form.email || !form.password) {
    error.value = 'Please fill in both fields.'
    return
  }
  // Mock authentication — real credential check will be handled by the backend API.
  bookingStore.login({ name: form.email.split('@')[0], email: form.email })
  router.push('/')
}
</script>

<template>
  <section class="section container auth-view">
    <div class="auth-card card">
      <h1>Welcome Back</h1>
      <p class="text-muted">Log in to manage your bookings.</p>

      <BaseAlert v-if="error" type="error" :message="error" />

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
        <button type="submit" class="btn btn-primary auth-submit">Login</button>
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
