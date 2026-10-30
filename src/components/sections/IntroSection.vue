<script setup>
import { computed } from 'vue'
import { useSiteStore } from '../../stores/siteStore'
import SectionLabel from '../ui/SectionLabel.vue'
import StatList from '../ui/StatList.vue'

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

const store = useSiteStore()
const intro = computed(() => props.introData ?? store.intro)
</script>

<template>
  <section class="section" :id="sectionId">
    <div class="shell intro-grid">
      <div class="intro-side">
        <SectionLabel :text="intro.label" />
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

        <StatList :items="intro.stats" variant="intro" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.intro-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.62fr) minmax(0, 1.38fr);
  gap: clamp(28px, 5vw, 72px);
}
.intro-side,
.intro-main {
  min-width: 0;
}
.intro-side :deep(.label) {
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
  line-height: 0.96;
  letter-spacing: -0.045em;
}
html[lang='ru'] .intro-main h2 {
  font-size: clamp(2.2rem, 4.4vw, 3.8rem);
  letter-spacing: -0.02em;
}
html[lang='ar'] .intro-main h2 {
  letter-spacing: 0;
  line-height: 1.12;
}

.intro-main h2 .intro-accent {
  display: inline-block;
  margin-left: 0.12em;
  font-style: italic;
  font-weight: 400;
  color: var(--logo-red);
}
[dir='rtl'] .intro-main h2 .intro-accent {
  margin-left: 0;
  margin-right: 0.12em;
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
  .intro-side :deep(.label) {
    margin-bottom: 0;
  }
}

@media (max-width: 760px) {
  .intro-side {
    display: block;
  }
  .intro-side :deep(.label) {
    margin-bottom: 12px;
  }
  .intro-side .intro-note {
    max-width: 40ch;
  }
  .intro-text {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
  }
}
</style>
