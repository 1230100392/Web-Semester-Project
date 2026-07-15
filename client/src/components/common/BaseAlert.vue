<script setup>
defineProps({
  type: {
    type: String,
    default: 'success',
    validator: (v) => ['success', 'error', 'info'].includes(v)
  },
  message: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="alert" :class="`alert-${type}`">
    {{ message }}
  </div>
</template>

<style scoped>
.alert {
  padding: 0.85rem 1.1rem;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}
.alert-success {
  background: #e6f4ea;
  color: var(--color-success);
  border: 1px solid #b7e0c4;
}
.alert-error {
  background: #fdecec;
  color: var(--color-danger);
  border: 1px solid #f3b7b7;
}
.alert-info {
  background: #eaf2fb;
  color: var(--color-primary-light);
  border: 1px solid #bcd7f0;
}
</style>
