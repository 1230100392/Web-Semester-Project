import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useBookingStore } from './store/booking'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Restore the logged-in session (if a token is saved) before mounting.
const store = useBookingStore()
store.restoreSession().finally(() => {
  app.mount('#app')
})
