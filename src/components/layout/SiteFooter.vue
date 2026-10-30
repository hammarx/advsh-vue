<script setup>
import { computed } from 'vue'
import { useSiteStore } from '@/stores/siteStore'
import BrandLogo from './BrandLogo.vue'

const props = defineProps({
  description: { type: String, default: null },
  email: { type: String, default: null },
  columns: { type: Array, default: null },
  contactTitle: { type: String, default: null },
  addressLines: { type: Array, default: null },
  phone: { type: String, default: null },
  phoneHref: { type: String, default: null },
  copyright: { type: String, default: null },
  funding: { type: String, default: null },
  legalLinks: { type: Array, default: null },
})

const store = useSiteStore()

const footer = computed(() => store.footer || {})
const displayDescription = computed(() => props.description ?? footer.value.description)
const displayEmail = computed(() => props.email ?? footer.value.email ?? store.contact.generalEmail)
const displayColumns = computed(() => props.columns ?? footer.value.columns ?? [])
const displayContactTitle = computed(() => props.contactTitle ?? footer.value.contactTitle)
const displayAddressLines = computed(
  () => props.addressLines ?? footer.value.addressLines ?? store.contact.addressLines
)
const displayPhone = computed(() => props.phone ?? footer.value.phone ?? store.contact.generalPhone)
const displayPhoneHref = computed(
  () => props.phoneHref ?? footer.value.phoneHref ?? store.contact.generalPhoneHref
)
const displayCopyright = computed(() => props.copyright ?? footer.value.copyright)
const displayFunding = computed(() => props.funding ?? footer.value.funding)
const displayLegalLinks = computed(() => props.legalLinks ?? footer.value.legalLinks ?? [])
</script>

<template>
  <footer class="site-footer">
    <div class="shell">
      <div class="footer-top">
        <div class="footer-brand">
          <BrandLogo variant="footer" href="#top" :showSubtitle="true" />
          <p>{{ displayDescription }}</p>
          <a class="footer-mail" :href="`mailto:${displayEmail}`">{{ displayEmail }}</a>
        </div>

        <div v-for="(col, idx) in displayColumns" :key="idx" class="footer-col">
          <h3>{{ col.title }}</h3>
          <a
            v-for="(link, lIdx) in col.links"
            :key="lIdx"
            :href="link.href"
            :target="link.external ? '_blank' : undefined"
            :rel="link.external ? 'noopener' : undefined"
          >
            {{ link.label }}
          </a>
        </div>

        <div class="footer-col">
          <h3>{{ displayContactTitle }}</h3>
          <address v-if="displayAddressLines.length">
            <template v-for="(line, aIdx) in displayAddressLines" :key="aIdx">
              {{ line }}<br v-if="aIdx < displayAddressLines.length - 1" />
            </template>
          </address>
          <a v-if="displayPhone" :href="displayPhoneHref">{{ displayPhone }}</a>
          <a :href="`mailto:${displayEmail}`">{{ displayEmail }}</a>
        </div>
      </div>

      <div class="footer-bottom">
        <p>{{ displayCopyright }}</p>
        <p>{{ displayFunding }}</p>
        <p v-if="displayLegalLinks.length">
          <template v-for="(link, idx) in displayLegalLinks" :key="idx">
            <a
              :href="link.href"
              :target="link.external ? '_blank' : undefined"
              :rel="link.external ? 'noopener' : undefined"
            >{{ link.label }}</a>
            <template v-if="idx < displayLegalLinks.length - 1"> · </template>
          </template>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  margin-top: clamp(60px, 8vw, 96px);
  padding: 66px 0 26px;
  color: var(--cream);
  background: var(--logo-blue);
}

.footer-top {
  display: grid;
  grid-template-columns: 1.7fr 1fr 1fr 1fr;
  gap: 40px;
  padding-bottom: 46px;
  border-bottom: 1px solid var(--line-on-dark);
}

.footer-brand > p {
  max-width: 34ch;
  margin-top: 20px;
  color: var(--text-on-dark-muted);
  font-size: 13px;
  line-height: 1.65;
}

.footer-brand .footer-mail {
  display: inline-block;
  margin-top: 15px;
  color: var(--text-on-dark);
  font-family: var(--display);
  font-size: 19px;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-brand .footer-mail:hover {
  color: var(--text-on-dark);
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.footer-col h3 {
  margin-bottom: 14px;
  color: var(--text-on-dark);
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

html[lang='ar'] .footer-col h3 {
  letter-spacing: 0.04em;
  font-size: 10.5px;
}

html[lang='ru'] .footer-col h3 {
  letter-spacing: 0.08em;
}

.footer-col a,
.footer-col address {
  display: block;
  padding: 5px 0;
  color: var(--text-on-dark-muted);
  font-size: 13px;
  font-style: normal;
  line-height: 1.55;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-col a:hover {
  color: var(--text-on-dark);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.footer-col address {
  margin-bottom: 6px;
}

[dir='rtl'] .footer-mail,
[dir='rtl'] .footer-col a[href^='tel:'],
[dir='rtl'] .footer-col a[href^='mailto:'],
[dir='rtl'] .footer-col address {
  direction: ltr;
  unicode-bidi: isolate;
  text-align: right;
}

.footer-bottom {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding-top: 22px;
  color: var(--text-on-dark-muted);
  font-size: 9px;
  font-weight: 650;
  letter-spacing: 0.08em;
  line-height: 1.7;
  text-transform: uppercase;
}

html[lang='ar'] .footer-bottom {
  letter-spacing: 0.02em;
  font-size: 10px;
}

.footer-bottom p {
  max-width: 44ch;
}

.footer-bottom a {
  text-decoration: none;
  transition: color 0.2s;
}

.footer-bottom a:hover {
  color: var(--text-on-dark);
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 3px;
}

@media (max-width: 980px) {
  .footer-top {
    grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr);
  }
  .footer-brand {
    grid-column: 1 / -1;
    margin-bottom: 8px;
  }
  .footer-brand > p {
    max-width: 48ch;
  }
}

@media (max-width: 760px) {
  .footer-top {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 28px;
  }
  .footer-brand {
    grid-column: 1 / -1;
  }
  .footer-bottom {
    flex-direction: column;
    gap: 10px;
  }
  .footer-bottom p {
    max-width: none;
  }
}

@media (max-width: 480px) {
  .footer-top {
    grid-template-columns: minmax(0, 1fr);
  }
  .footer-brand {
    grid-column: auto;
  }
}
</style>
