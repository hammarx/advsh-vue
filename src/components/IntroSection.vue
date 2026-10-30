<script setup>
import { computed } from 'vue'
import { useI18n } from '../i18n/useI18n'

const props = defineProps({
  sectionId: {
    type: String,
    default: 'ueber-uns',
  },
  introData: {
    type: Object,
    default: undefined,
  },
})

const { t } = useI18n()
const intro = computed(() => props.introData ?? t.value.intro)
</script>

<template>
  <section class="section" :id="sectionId">
    <div class="shell intro-grid">
      <div class="intro-side">
        <p class="label">{{ intro.label }}</p>
        <p class="intro-note">{{ intro.note }}</p>
      </div>

      <div class="intro-main">
        <h2>
          {{ intro.headingPrefix }}
          <em class="intro-accent">{{ intro.headingAccent }}</em>
        </h2>

        <div class="intro-text">
          <p v-for="(paragraph, idx) in intro.paragraphs" :key="idx">
            {{ paragraph }}
          </p>
        </div>

        <div class="stat-row">
          <div v-for="(stat, idx) in intro.stats" :key="idx" class="stat">
            <strong>
              <em v-if="stat.accent">{{ stat.value }}</em>
              <template v-else>{{ stat.value }}</template>
            </strong>
            <span>{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.intro-grid {
  display: grid;
  grid-template-columns: minmax(0, .62fr) minmax(0, 1.38fr);
  gap: clamp(28px, 5vw, 72px);
}
.intro-side,
.intro-main {
  min-width: 0;
}
.intro-side .label {
  margin-bottom: 24px;
}
.intro-side .intro-note {
  max-width: 24ch;
  color: var(--muted);
  font-family: var(--display);
  font-size: 19px;
  font-style: italic;
  line-height: 1.4;
}

.intro-main h2 {
  font-family: var(--display);
  font-size: clamp(2.5rem, 5.3vw, 4.5rem);
  font-weight: 500;
  line-height: .96;
  letter-spacing: -.045em;
}
html[lang="ru"] .intro-main h2 {
  font-size: clamp(2.2rem, 4.4vw, 3.8rem);
  letter-spacing: -.02em;
}
html[lang="ar"] .intro-main h2 {
  letter-spacing: 0;
  line-height: 1.12;
}

.intro-main h2 .intro-accent {
  display: inline-block;
  margin-left: .12em;
  font-style: italic;
  font-weight: 400;
  color: var(--logo-red, #db2a26);
}
[dir="rtl"] .intro-main h2 .intro-accent {
  margin-left: 0;
  margin-right: .12em;
}

.intro-text {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  margin-top: 27px;
}
.intro-text p {
  color: var(--muted);
  font-size: 15.5px;
  line-height: 1.7;
}

.stat-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
  margin-top: 38px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
}
.stat strong {
  display: block;
  font-family: var(--display);
  font-size: clamp(2rem, 3.6vw, 3rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -.04em;
}
html[lang="ar"] .stat strong,
[dir="rtl"] .stat strong {
  direction: ltr;
  unicode-bidi: isolate;
  text-align: right;
}
.stat strong em {
  font-style: normal;
  color: var(--logo-red, #db2a26);
}
.stat span {
  display: block;
  margin-top: 7px;
  color: var(--muted);
  font-size: 9.5px;
  font-weight: 750;
  letter-spacing: .11em;
  text-transform: uppercase;
}

@media (max-width: 980px) {
  .intro-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 26px;
  }
  .intro-side {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
  }
  .intro-side .label {
    margin-bottom: 0;
  }
}

@media (max-width: 760px) {
  .intro-side {
    display: block;
  }
  .intro-side .label {
    margin-bottom: 12px;
  }
  .intro-side .intro-note {
    max-width: 40ch;
  }
  .intro-text {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
  }
  .stat-row {
    gap: 14px;
  }
  .stat strong {
    font-size: 1.9rem;
  }
}

@media (max-width: 480px) {
  .stat-row {
    grid-template-columns: minmax(0, 1fr);
    gap: 15px;
  }
  .stat {
    display: flex;
    align-items: baseline;
    gap: 12px;
  }
  .stat strong {
    font-size: 1.8rem;
  }
  .stat span {
    margin-top: 0;
  }
}
</style>
