<script setup>
import { useRouter } from '@/router'

const props = defineProps({
  href: {
    type: String,
    default: '#',
  },
  label: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: 'primary', // 'primary' | 'coral' | 'outline' | 'light' | 'ghost-light'
  },
  arrow: {
    type: [String, Boolean],
    default: false,
  },
  external: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()

function handleClick(e) {
  if (props.external) return
  if (props.href.startsWith('/')) {
    e.preventDefault()
    router.push(props.href)
  }
}
</script>

<template>
  <a
    class="btn"
    :class="`btn--${variant}`"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener' : undefined"
    @click="handleClick"
  >
    <slot>{{ label }}</slot>
    <span v-if="arrow" class="arr">{{ typeof arrow === 'string' ? arrow : '↗' }}</span>
  </a>
</template>
