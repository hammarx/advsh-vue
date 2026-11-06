import { ref, computed, defineComponent, h } from 'vue'
import HomeView from '@/views/HomeView.vue'
import CounselingView from '@/views/CounselingView.vue'
import ContactView from '@/views/ContactView.vue'
import ReportView from '@/views/ReportView.vue'

const HASH_TO_PATH = {
  '#vorfall-melden': '/vorfall-melden',
  '#beratung': '/beratung',
  '#kontakt': '/kontakt',
  '#projekte': '/projekte',
  '#ueber-uns': '/ueber-uns',
  '#aktuelles': '/aktuelles',
  '#archiv': '/archiv',
  '#top': '/',
}

function normalizePath(rawPath, rawHash = '') {
  if (rawHash && HASH_TO_PATH[rawHash]) {
    return HASH_TO_PATH[rawHash]
  }
  if (!rawPath || rawPath === '/index.html') return '/'
  return rawPath.split('#')[0] || '/'
}

// Keep a single shared reactive ref on window so Vite HMR updates never split router state
const initialPath =
  typeof window !== 'undefined'
    ? normalizePath(window.location.pathname, window.location.hash)
    : '/'

export const currentPath =
  typeof window !== 'undefined'
    ? (window.__ADVSH_PATH_REF__ ||= ref(initialPath))
    : ref(initialPath)

if (typeof window !== 'undefined') {
  currentPath.value = normalizePath(window.location.pathname, window.location.hash)
}

export function push(target) {
  if (typeof window === 'undefined') return
  let raw = typeof target === 'string' ? target : target?.path || '/'
  let scrollSelector = null

  if (raw.includes('#')) {
    const [p, hashPart] = raw.split('#')
    raw = p || '/'
    if (hashPart === 'anfrage' || hashPart === 'faq' || hashPart === 'nachricht') {
      scrollSelector = `#${hashPart}`
    } else if (HASH_TO_PATH[`#${hashPart}`]) {
      raw = HASH_TO_PATH[`#${hashPart}`]
    }
  }

  const nextPath = raw || '/'
  window.history.pushState({}, '', nextPath)
  currentPath.value = nextPath

  if (scrollSelector) {
    setTimeout(() => {
      const el = document.querySelector(scrollSelector)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

if (typeof window !== 'undefined' && !window.__ADVSH_ROUTER_BOUND__) {
  window.__ADVSH_ROUTER_BOUND__ = true

  if (window.location.hash) {
    const clean = normalizePath(window.location.pathname, window.location.hash)
    window.history.replaceState({}, '', clean)
    currentPath.value = clean
  }

  window.addEventListener('popstate', () => {
    const clean = normalizePath(window.location.pathname, window.location.hash)
    if (window.location.hash) {
      window.history.replaceState({}, '', clean)
    }
    currentPath.value = clean
  })

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return
    }
    const anchor = e.target.closest('a')
    if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return
    const href = anchor.getAttribute('href')
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) {
      return
    }

    e.preventDefault()

    if (href === '#anfrage' || href === '#faq' || href === '#nachricht') {
      const targetEl = document.querySelector(href)
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      return
    }

    if (HASH_TO_PATH[href]) {
      push(HASH_TO_PATH[href])
      return
    }

    if (href.startsWith('/')) {
      push(href)
    }
  })
}

export function useRouter() {
  return { push }
}

export function useRoute() {
  return computed(() => ({
    path: currentPath.value,
    hash: '',
  })).value
}

export const RouterView = defineComponent({
  name: 'RouterView',
  setup() {
    return () => {
      if (currentPath.value === '/vorfall-melden') {
        return h(ReportView)
      }
      if (currentPath.value === '/beratung') {
        return h(CounselingView)
      }
      if (currentPath.value === '/kontakt') {
        return h(ContactView)
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
    const href = computed(() => {
      const raw = typeof props.to === 'string' ? props.to : props.to.path || '/'
      return raw.split('#')[0] || '/'
    })
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
