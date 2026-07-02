<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'outline', 'accent'].includes(v)
  },
  type: {
    type: String,
    default: 'button'
  }
})

defineEmits(['click'])
</script>

<template>
  <button :type="type" class="btn" :class="`btn-${variant}`" @click="$emit('click', $event)">
    <slot />
  </button>
</template>
