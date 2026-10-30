<script setup>
defineProps({
  text: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: 'default', // 'default' | 'light'
  },
})
</script>

<template>
  <p class="label" :class="{ 'label--light': variant === 'light' }">
    <slot>{{ text }}</slot>
  </p>
</template>
