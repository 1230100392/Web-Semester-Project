<script setup></script>

<template>
  <section class="section container not-found">
    <h1>404</h1>
    <p class="text-muted">The page you're looking for doesn't exist.</p>
    <RouterLink to="/" class="btn btn-primary">Back to Home</RouterLink>
  </section>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 6rem 0;
}

.not-found h1 {
  font-size: 4rem;
}
</style>
