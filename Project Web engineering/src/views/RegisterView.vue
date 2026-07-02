<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../store/booking'
import BaseAlert from '../components/common/BaseAlert.vue'

const router = useRouter()
const bookingStore = useBookingStore()

const form = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const error = ref('')

function handleRegister() {
  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match.'
    return
  }
  if (!form.fullName || !form.email || !form.password) {
    error.value = 'Please fill in all fields.'
    return
  }
  // Mock registration — will call the Express/MongoDB API in later phases.
  bookingStore.login({ name: form.fullName, email: form.email })
  router.push('/')
}
</script>

<template>
  <section class="section container auth-view">
    <div class="auth-card card">
      <h1>Create Account</h1>
      <p class="text-muted">Sign up to start booking your stays.</p>

      <BaseAlert v-if="error" type="error" :message="error" />

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="fullName">Full Name</label>
          <input id="fullName" v-model="form.fullName" type="text" class="form-control" required />
        </div>
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
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            class="form-control"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary auth-submit">Register</button>
      </form>

      <p class="auth-switch text-muted">
        Already have an account? <RouterLink to="/login">Login here</RouterLink>
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
