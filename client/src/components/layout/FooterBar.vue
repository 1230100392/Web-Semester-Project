<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer-inner">
      <div>
        <h3>StayEase</h3>
        <p class="text-muted">Simple, reliable hotel booking for every journey.</p>
      </div>
      <div class="footer-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/rooms">Rooms</RouterLink>
        <RouterLink to="/contact">Contact</RouterLink>
      </div>
      <p class="text-muted copyright">&copy; {{ year }} StayEase. University of Sialkot — Semester Project.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--color-primary);
  color: #e5e7eb;
  padding: 2.5rem 0 1.5rem;
  margin-top: 3rem;
}

.footer h3 {
  color: #fff;
  margin-bottom: 0.4rem;
}

.footer .text-muted {
  color: #cbd5e0;
}

.footer-inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.footer-links {
  display: flex;
  gap: 1.2rem;
}

.footer-links a {
  color: #e5e7eb;
}

.copyright {
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding-top: 1rem;
  font-size: 0.85rem;
  text-align: center;
}
</style>
