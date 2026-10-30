import { onMounted, onBeforeUnmount } from 'vue'
import { useSiteStore } from '@/stores/siteStore'

/**
 * Observes section[id] elements in the viewport and automatically updates
 * the active navigation link in the Pinia store as the user scrolls.
 */
export function useScrollSpy(
  sectionIds = ['ueber-uns', 'angebote', 'beratung', 'projekte', 'aktuelles', 'archiv', 'kontakt']
) {
  const store = useSiteStore()
  let observer = null

  onMounted(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id')
            if (id) {
              // Map #angebote to #beratung if #angebote isn't a direct top-level nav item
              const navHasId = store.nav?.items?.some((item) => item.href === `#${id}`)
              if (navHasId) {
                store.activeHref = `#${id}`
              }
            }
          }
        }
      },
      {
        rootMargin: '-25% 0px -55% 0px',
        threshold: 0,
      }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
  })

  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })
}
