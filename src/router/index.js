import { ref, computed, defineComponent, h } from 'vue'
import HomeView from '@/views/HomeView.vue'
import ReportView from '@/views/ReportView.vue'

const currentPath = ref(typeof window !== 'undefined' ? window.location.pathname : '/')
const currentHash = ref(typeof window !== 'undefined' ? window.location.hash : '')

// Automatically clean old #vorfall-melden hash to /vorfall-melden path
if (typeof window !== 'undefined') {
  if (currentHash.value === '#vorfall-melden') {
    window.history.replaceState({}, '', '/vorfall-melden')
    currentPath.value = '/vorfall-melden'
    currentHash.value = ''
  }

  window.addEventListener('popstate', () => {
    currentPath.value = window.location.pathname
    currentHash.value = window.location.hash
  })
}

function push(target) {
  if (typeof window === 'undefined') return
  if (typeof target === 'string') {
    const [pathPart, hashPart] = target.split('#')
    const nextPath = pathPart || '/'
    const nextHash = hashPart ? `#${hashPart}` : ''
    window.history.pushState({}, '', nextPath + nextHash)
    currentPath.value = nextPath
    currentHash.value = nextHash
    if (nextHash) {
      setTimeout(() => {
        const el = document.querySelector(nextHash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 30)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } else if (target && typeof target === 'object') {
    const nextPath = target.path || '/'
    const nextHash = target.hash || ''
    window.history.pushState({}, '', nextPath + nextHash)
    currentPath.value = nextPath
    currentHash.value = nextHash
    if (nextHash) {
      setTimeout(() => {
        const el = document.querySelector(nextHash)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 30)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}

export function useRouter() {
  return { push }
}

export function useRoute() {
  return computed(() => ({
    path: currentPath.value,
    hash: currentHash.value,
  })).value
}

export const RouterView = defineComponent({
  name: 'RouterView',
  setup() {
    return () => {
      if (currentPath.value === '/vorfall-melden') {
        return h(ReportView)
      }
      return h(HomeView)
    }
  },
})

export const RouterLink = defineComponent({
  name: 'RouterLink',
  props: {
    to: { type: [String, Object], required: true },
  },
  setup(props, { slots, attrs }) {
    const href = computed(() =>
      typeof props.to === 'string' ? props.to : props.to.path || '/'
    )
    function onClick(e) {
      e.preventDefault()
      push(props.to)
    }
    return () =>
      h(
        'a',
        {
          ...attrs,
          href: href.value,
          onClick,
        },
        slots.default ? slots.default() : []
      )
  },
})

export default {
  install(app) {
    app.component('RouterView', RouterView)
    app.component('RouterLink', RouterLink)
  },
}
