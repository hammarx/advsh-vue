<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [],
    // [{ value, label, accent }]
  },
  variant: {
    type: String,
    default: 'intro', // 'intro' | 'hero'
  },
})
</script>

<template>
  <div v-if="variant === 'hero'" class="hero-facts">
    <div v-for="(fact, idx) in items" :key="idx" class="hero-fact">
      <strong>{{ fact.value }}</strong>
      <span>{{ fact.label }}</span>
    </div>
  </div>

  <div v-else class="stat-row">
    <div v-for="(stat, idx) in items" :key="idx" class="stat">
      <strong>
        <em v-if="stat.accent">{{ stat.value }}</em>
        <template v-else>{{ stat.value }}</template>
      </strong>
      <span>{{ stat.label }}</span>
    </div>
  </div>
</template>

<style scoped>
/* Hero Facts Variant */
.hero-facts {
  display: flex;
  gap: 32px;
  margin-top: 44px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
}

.hero-fact {
  padding-left: 16px;
  border-left: 1px solid var(--line);
}

.hero-fact:first-child {
  padding-left: 0;
  border-left: 0;
}

[dir='rtl'] .hero-fact {
  padding-left: 0;
  padding-right: 16px;
  border-left: 0;
  border-right: 1px solid var(--line);
}

[dir='rtl'] .hero-fact:first-child {
  padding-right: 0;
  border-right: 0;
}

.hero-fact strong {
  display: block;
  font-family: var(--display);
  font-size: 23px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.03em;
}

.hero-fact span {
  display: block;
  margin-top: 5px;
  color: var(--muted);
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

html[lang='ar'] .hero-fact span {
  letter-spacing: 0.04em;
}

html[lang='ru'] .hero-fact span {
  letter-spacing: 0.05em;
}

/* Intro Stat Row Variant */
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
  letter-spacing: -0.04em;
}

.stat strong em {
  font-style: normal;
  color: var(--logo-red);
}

.stat span {
  display: block;
  margin-top: 7px;
  color: var(--muted);
  font-size: 9.5px;
  font-weight: 750;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

/* Shared Arabic / RTL number alignment fix */
html[lang='ar'] .hero-fact strong,
[dir='rtl'] .hero-fact strong,
html[lang='ar'] .stat strong,
[dir='rtl'] .stat strong {
  direction: ltr;
  unicode-bidi: isolate;
  text-align: right;
}

@media (max-width: 760px) {
  .hero-facts {
    gap: 19px;
    margin-top: 33px;
  }
  .hero-fact strong {
    font-size: 20px;
  }
  .stat-row {
    gap: 14px;
  }
  .stat strong {
    font-size: 1.9rem;
  }
}

@media (max-width: 480px) {
  .hero-facts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
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
