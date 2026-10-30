<script setup>
import { computed } from 'vue'
import { useI18n } from '../i18n/useI18n'
import defaultBeratungImg from '../assets/beratung.jpg'

const props = defineProps({
  sectionId: { type: String, default: 'beratung' },
  imageSrc: { type: String, default: defaultBeratungImg },
  imageAlt: { type: String, default: null },
  tag: { type: String, default: null },
  label: { type: String, default: null },
  headingPrefix: { type: String, default: null },
  headingAccent: { type: String, default: null },
  text: { type: String, default: null },
  list: { type: Array, default: null },
  meta: { type: Array, default: null },
  cta: { type: Object, default: null },
})

const { t } = useI18n()

const feature = computed(() => t.value.feature || {})
const displayImageAlt = computed(() => props.imageAlt ?? feature.value.imageAlt)
const displayTag = computed(() => props.tag ?? feature.value.tag)
const displayLabel = computed(() => props.label ?? feature.value.label)
const displayHeadingPrefix = computed(() => props.headingPrefix ?? feature.value.headingPrefix)
const displayHeadingAccent = computed(() => props.headingAccent ?? feature.value.headingAccent)
const displayText = computed(() => props.text ?? feature.value.text)
const displayList = computed(() => props.list ?? feature.value.list ?? [])
const displayMeta = computed(() => props.meta ?? feature.value.meta ?? [])
const displayCta = computed(() => props.cta ?? feature.value.cta)
</script>

<template>
  <section class="section" :id="sectionId">
    <div class="shell">
      <div class="feature">
        <div class="feature-media">
          <img :src="imageSrc" :alt="displayImageAlt" width="1200" height="800" />
          <span v-if="displayTag" class="feature-tag">{{ displayTag }}</span>
        </div>

        <div class="feature-copy">
          <p class="label label--light">{{ displayLabel }}</p>
          <h2>
            {{ displayHeadingPrefix }}
            <em>{{ displayHeadingAccent }}</em>
          </h2>
          <p>{{ displayText }}</p>

          <ul v-if="displayList.length" class="feature-list">
            <li v-for="(item, idx) in displayList" :key="idx">{{ item }}</li>
          </ul>

          <div v-if="displayMeta.length" class="feature-meta">
            <div v-for="(m, idx) in displayMeta" :key="idx">
              <span>{{ m.label }}</span>
              <a v-if="m.href" :href="m.href">{{ m.value }}</a>
              <strong v-else>{{ m.value }}</strong>
            </div>
          </div>

          <a v-if="displayCta" class="btn btn--light" :href="displayCta.href">
            {{ displayCta.label }}
            <span class="arr">{{ displayCta.arrow || '↗' }}</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.feature {
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  overflow: hidden;
  border-radius: 30px;
  color: var(--cream);
  background: var(--logo-blue, #082f77);
}

.feature-media {
  position: relative;
  min-height: 560px;
}

.feature-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.72) contrast(1.05);
}

.feature-media::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(8, 47, 119, 0.04) 35%, rgba(8, 47, 119, 0.55));
}

.feature-tag {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 2;
  padding: 8px 13px;
  border: 1px solid rgba(244, 239, 228, 0.35);
  border-radius: 999px;
  color: var(--cream);
  background: rgba(16, 32, 31, 0.38);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  backdrop-filter: blur(8px);
}

[dir='rtl'] .feature-tag {
  left: auto;
  right: 24px;
  letter-spacing: 0.04em;
}

.feature-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(34px, 5vw, 64px);
}

.feature-copy .label {
  margin-bottom: 20px;
}

.feature-copy h2 {
  color: #ffffff;
  font-family: var(--display);
  font-size: clamp(2.4rem, 4.2vw, 3.9rem);
  line-height: 0.96;
  letter-spacing: -0.045em;
  overflow-wrap: break-word;
  hyphens: auto;
}

html[lang='ar'] .feature-copy h2 {
  letter-spacing: 0;
  line-height: 1.2;
}

html[lang='ru'] .feature-copy h2 {
  letter-spacing: -0.02em;
}

.feature-copy h2 em {
  color: #ffffff;
  font-weight: 700;
}

.feature-copy > p:not(.label) {
  max-width: 50ch;
  margin-top: 19px;
  color: rgba(244, 239, 228, 0.78);
  font-size: 15px;
  line-height: 1.7;
}

.feature-list {
  display: grid;
  gap: 9px;
  margin-top: 24px;
  list-style: none;
}

.feature-list li {
  display: flex;
  gap: 11px;
  color: rgba(244, 239, 228, 0.9);
  font-size: 13.5px;
}

.feature-list li::before {
  content: '✳';
  flex: none;
  color: var(--logo-red, #db2a26);
  font-size: 12px;
  line-height: 1.6;
}

.feature-meta {
  display: flex;
  gap: 26px;
  margin-top: 27px;
  flex-wrap: wrap;
}

.feature-meta div {
  padding-left: 13px;
  border-left: 1px solid rgba(244, 239, 228, 0.22);
}

[dir='rtl'] .feature-meta div {
  padding-left: 0;
  padding-right: 13px;
  border-left: 0;
  border-right: 1px solid rgba(244, 239, 228, 0.22);
}

.feature-meta span {
  display: block;
  color: rgba(244, 239, 228, 0.65);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

html[lang='ar'] .feature-meta span {
  letter-spacing: 0.04em;
}

.feature-meta a,
.feature-meta strong {
  display: block;
  margin-top: 3px;
  color: var(--cream);
  font-size: 13px;
  font-weight: 650;
  text-decoration: none;
}

[dir='rtl'] .feature-meta a[href^='tel:'],
[dir='rtl'] .feature-meta a[href^='mailto:'] {
  direction: ltr;
  unicode-bidi: isolate;
  text-align: right;
}

.feature-meta a:hover {
  color: #ffffff;
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.feature-copy .btn {
  align-self: flex-start;
  margin-top: 30px;
}

@media (max-width: 980px) {
  .feature {
    grid-template-columns: minmax(0, 1fr);
  }
  .feature-media {
    min-height: 340px;
  }
  .feature-media img {
    height: 340px;
  }
}

@media (max-width: 480px) {
  .feature-copy {
    padding: 28px 24px;
  }
  .feature-copy h2,
  html[lang='ru'] .feature-copy h2 {
    font-size: clamp(2rem, 9vw, 3rem);
  }
}
</style>
