<script setup>
import { computed } from 'vue'
import { useRouter } from '@/router'
import { useSiteStore } from '@/stores/siteStore'

const props = defineProps({
  current: {
    type: String,
    required: true,
  },
  parents: {
    type: Array,
    default: () => [], // [{ label, to }]
  },
})

const router = useRouter()
const store = useSiteStore()

const homeLabel = computed(() => {
  const map = {
    de: 'Start',
    en: 'Home',
    ar: 'الرئيسية',
    tr: 'Ana Sayfa',
    ru: 'Главная',
    pl: 'Start',
  }
  return map[store.currentLang] || 'Start'
})

const ariaLabel = computed(() => {
  const map = {
    de: 'Brotkrumen-Navigation',
    en: 'Breadcrumb',
    ar: 'مسار التنقل',
    tr: 'Gezinti yolu',
    ru: 'Навигационная цепочка',
    pl: 'Ścieżka nawigacji',
  }
  return map[store.currentLang] || 'Breadcrumb'
})

function goTo(path, e) {
  if (e) e.preventDefault()
  if (path === '/') {
    store.clearActiveHref()
  } else {
    store.setActiveHref(path)
  }
  router.push(path)
}
</script>

<template>
  <nav class="breadcrumb" :aria-label="ariaLabel">
    <a href="/" class="breadcrumb-link" @click="goTo('/', $event)">
      <span class="breadcrumb-dot" aria-hidden="true"></span>
      <span>{{ homeLabel }}</span>
    </a>

    <template v-for="(parent, idx) in parents" :key="idx">
      <span class="breadcrumb-sep" aria-hidden="true">/</span>
      <a :href="parent.to" class="breadcrumb-link" @click="goTo(parent.to, $event)">
        {{ parent.label }}
      </a>
    </template>

    <span class="breadcrumb-sep" aria-hidden="true">/</span>
    <span class="breadcrumb-current" aria-current="page">{{ current }}</span>
  </nav>
</template>

<style scoped>
.breadcrumb {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 9px;
  color: var(--muted);
  font-size: 10.5px;
  font-weight: 750;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

html[lang='ar'] .breadcrumb {
  letter-spacing: 0.02em;
  font-size: 11.5px;
}

.breadcrumb-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: var(--logo-red);
}

.breadcrumb-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--logo-blue);
  transition: background 0.2s, transform 0.2s;
}

.breadcrumb-link:hover .breadcrumb-dot {
  background: var(--logo-red);
  transform: scale(1.2);
}

.breadcrumb-sep {
  opacity: 0.45;
  user-select: none;
}

.breadcrumb-current {
  color: var(--ink);
  font-weight: 800;
}
</style>
