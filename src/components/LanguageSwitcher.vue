<script setup>
import { computed } from 'vue'
import { useI18n } from '../i18n/useI18n'

const props = defineProps({
  currentLang: {
    type: String,
    default: undefined,
  },
  ariaLabel: {
    type: String,
    default: undefined,
  },
  languages: {
    type: Array,
    default: undefined,
  },
})

const emit = defineEmits(['change'])
const { currentLang: i18nLang, languages: defaultLanguages, t, setLang } = useI18n()

const activeLang = computed(() => props.currentLang ?? i18nLang.value)
const langList = computed(() => props.languages ?? defaultLanguages)
const navAriaLabel = computed(() => props.ariaLabel ?? t.value.nav.chooseLanguage)

function selectLanguage(lang) {
  setLang(lang.code)
  emit('change', lang)
}
</script>

<template>
  <nav class="lang-switch" :aria-label="navAriaLabel">
    <template v-for="(lang, index) in langList" :key="lang.code">
      <span
        v-if="lang.code === activeLang"
        aria-current="page"
        :lang="lang.code"
        :title="lang.name"
      >
        {{ lang.label }}
      </span>
      <a
        v-else
        :href="`#${lang.code}`"
        :hreflang="lang.code"
        :lang="lang.code"
        :aria-label="lang.name"
        @click.prevent="selectLanguage(lang)"
      >
        {{ lang.label }}
      </a>
      <span
        v-if="index < langList.length - 1"
        class="sep"
        aria-hidden="true"
      >·</span>
    </template>
  </nav>
</template>

<style scoped>
.lang-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(244, 239, 228, .72);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .17em;
  text-transform: uppercase;
  direction: ltr;
}
.lang-switch a {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  padding-bottom: 1px;
  cursor: pointer;
}
.lang-switch a:hover {
  color: #ffffff;
  font-weight: 800;
  border-color: #ffffff;
}
.lang-switch [aria-current="page"] {
  color: var(--cream);
  border-bottom: 1px solid var(--logo-red, #db2a26);
  padding-bottom: 1px;
}
.lang-switch .sep {
  color: rgba(244, 239, 228, .42);
}

@media (max-width: 760px) {
  .lang-switch {
    gap: 10px;
    font-size: 11px;
  }
  .lang-switch a,
  .lang-switch [aria-current="page"] {
    padding: 3px 2px;
  }
}

:global(html[lang="ar"]) .lang-switch {
  letter-spacing: .04em;
}
:global(html[lang="ru"]) .lang-switch {
  letter-spacing: .05em;
}
</style>
