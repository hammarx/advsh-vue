<script setup>
import { computed } from 'vue'
import { useSiteStore } from '@/stores/siteStore'
import { SectionLabel, AppBreadcrumb } from '@/components/ui'

const store = useSiteStore()
const p = computed(() => store.contactPage)
</script>

<template>
  <div class="contact-page">
    <!-- 1. CLEAN PAGE HERO -->
    <section class="page-hero">
      <div class="shell page-hero-inner">
        <div class="top-nav-row">
          <AppBreadcrumb :current="p.breadcrumb" />
        </div>

        <SectionLabel class="hero-kicker" :text="p.kicker" />
        <h1>
          <span class="hero-line">{{ p.titleLine1 }}</span>
          <span class="hero-line"><em>{{ p.titleAccent }}</em></span>
        </h1>
        <p class="page-lede">{{ p.lede }}</p>
      </div>
    </section>

    <!-- 2. THREE DIRECT CONTACT CARDS -->
    <section class="section section--tight">
      <div class="shell">
        <h2 class="sr-only">Kontaktmöglichkeiten</h2>
        <div class="contact-grid">
          <div v-for="card in p.cards" :key="card.id" class="contact-card">
            <span class="contact-icon" aria-hidden="true">
              <!-- Phone Icon -->
              <svg
                v-if="card.id === 'phone'"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z"
                />
              </svg>
              <!-- Email Icon -->
              <svg
                v-else-if="card.id === 'email'"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
              </svg>
              <!-- Address Pin Icon -->
              <svg
                v-else
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 10c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.6" />
              </svg>
            </span>

            <h3>{{ card.title }}</h3>
            <a v-if="card.href" :href="card.href" class="contact-main-link">
              {{ card.value }}
            </a>
            <address v-else class="contact-address">
              <template v-for="(line, i) in card.addressLines" :key="i">
                {{ line }}<br v-if="i < card.addressLines.length - 1" />
              </template>
            </address>

            <span class="contact-note">{{ card.note }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. ANFAHRT & BESUCH (KIEL MAP + DETAILS) -->
    <section class="section section--paper">
      <div class="shell visit-grid">
        <div class="visit-copy">
          <SectionLabel :text="p.visit.label" />
          <h2>
            {{ p.visit.headingLine1 }}<br />
            <em class="accent-teal">{{ p.visit.headingLine2 }}</em>
          </h2>
          <p class="visit-text">{{ p.visit.text }}</p>

          <div class="visit-list">
            <div v-for="row in p.visit.list" :key="row.label" class="visit-row">
              <span>{{ row.label }}</span>
              <strong>{{ row.value }}</strong>
            </div>
          </div>

          <a
            class="link-more"
            :href="p.visit.routeHref"
            target="_blank"
            rel="noopener"
          >
            {{ p.visit.routeLabel }} <span class="arr" aria-hidden="true">↗</span>
          </a>
        </div>

        <div class="map-art" role="img" :aria-label="p.visit.mapAria">
          <span class="water" aria-hidden="true"></span>
          <span class="road r1" aria-hidden="true"></span>
          <span class="road r2" aria-hidden="true"></span>
          <span class="road r3" aria-hidden="true"></span>
          <span class="road r4" aria-hidden="true"></span>
          <span class="map-pin" aria-hidden="true"><b>✳</b></span>
          <span class="map-label">{{ p.visit.mapPinLabel }}</span>
          <span class="map-caption">{{ p.visit.mapCaption }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.contact-page {
  overflow-x: clip;
}

.contact-page *,
.contact-page *::before,
.contact-page *::after {
  box-sizing: border-box;
}

.top-nav-row {
  margin-bottom: 24px;
}

/* PAGE HERO (NO WATERMARK, NO REPETITIVE STATS) */
.page-hero {
  position: relative;
  overflow: hidden;
  padding: clamp(32px, 5vw, 56px) 0 clamp(42px, 5vw, 60px);
  border-bottom: 1px solid var(--line);
}

.page-hero-inner {
  position: relative;
  z-index: 1;
}

.hero-kicker {
  margin-bottom: 18px;
}

.page-hero h1 {
  max-width: 920px;
  font-family: var(--display);
  font-size: clamp(3rem, 6.6vw, 5.8rem);
  font-weight: 400;
  line-height: 0.94;
  letter-spacing: -0.05em;
}

.hero-line {
  display: block;
}

.page-hero h1 em {
  color: var(--logo-blue);
  font-style: italic;
}

.page-lede {
  max-width: 62ch;
  margin-top: 22px;
  color: var(--muted);
  font-size: 17px;
  line-height: 1.65;
}

/* SECTIONS */
.section {
  padding: clamp(64px, 8vw, 104px) 0;
}

.section--tight {
  padding: clamp(44px, 6vw, 72px) 0;
}

.section--paper {
  background: var(--paper);
  border-top: 1px solid var(--line);
}

.accent-teal {
  color: var(--logo-blue);
  font-style: italic;
}

/* 3 DIRECT CONTACT CARDS */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.contact-card {
  display: flex;
  flex-direction: column;
  min-height: 228px;
  padding: 30px;
  border: 1px solid var(--line);
  border-radius: 24px;
  background: var(--paper);
  transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
}

.contact-card:hover {
  transform: translateY(-3px);
  border-color: var(--line-strong);
  box-shadow: 0 22px 40px -30px rgba(16, 32, 31, 0.35);
}

.contact-icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  margin-bottom: 24px;
  padding: 11px;
  border-radius: 50%;
  color: var(--logo-blue);
  background: rgba(8, 47, 119, 0.09);
}

.contact-icon svg {
  width: 100%;
  height: 100%;
}

.contact-card h3 {
  color: var(--muted);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.contact-main-link,
.contact-address {
  margin-top: 8px;
  font-family: var(--display);
  font-size: clamp(1.35rem, 2.2vw, 1.65rem);
  font-style: normal;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--ink);
  text-decoration: none;
  transition: color 0.2s;
}

.contact-main-link:hover {
  color: var(--logo-red);
}

.contact-note {
  margin-top: auto;
  padding-top: 18px;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.55;
}

/* VISIT & STYLIZED MAP */
.visit-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(30px, 5vw, 60px);
  align-items: center;
}

.visit-copy h2 {
  margin-top: 16px;
  font-family: var(--display);
  font-size: clamp(2.2rem, 4.4vw, 3.6rem);
  font-weight: 400;
  line-height: 0.98;
  letter-spacing: -0.04em;
}

.visit-text {
  max-width: 50ch;
  margin-top: 16px;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.68;
}

.visit-list {
  display: grid;
  margin-top: 26px;
  border-top: 1px solid var(--line);
}

.visit-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 20px;
  padding: 13px 0;
  border-bottom: 1px solid var(--line);
  font-size: 13.5px;
}

.visit-row span {
  color: var(--muted);
}

.visit-row strong {
  font-weight: 700;
  text-align: right;
  color: var(--ink);
}

.link-more {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 24px;
  padding-bottom: 5px;
  border-bottom: 1.5px solid var(--ink);
  color: var(--ink);
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  transition: color 0.2s, border-color 0.2s;
}

.link-more:hover {
  color: var(--logo-red);
  border-color: var(--logo-red);
}

.map-art {
  position: relative;
  aspect-ratio: 1 / 0.86;
  overflow: hidden;
  border-radius: 26px;
  border: 1px solid var(--line);
  background:
    linear-gradient(90deg, transparent 49.6%, rgba(16, 32, 31, 0.05) 50%, transparent 50.4%),
    linear-gradient(0deg, transparent 49.6%, rgba(16, 32, 31, 0.05) 50%, transparent 50.4%),
    rgba(8, 47, 119, 0.07);
  background-size: 56px 56px, 56px 56px, auto;
}

.map-art .water {
  position: absolute;
  right: -12%;
  bottom: -28%;
  width: 70%;
  height: 58%;
  border-radius: 50%;
  background: var(--logo-blue);
  opacity: 0.88;
  transform: rotate(-14deg);
}

.map-art .road {
  position: absolute;
  height: 9px;
  border-radius: 9px;
  background: var(--cream);
  box-shadow: 0 0 0 1px rgba(16, 32, 31, 0.07);
}

.map-art .road.r1 {
  top: 26%;
  left: -8%;
  width: 85%;
  transform: rotate(9deg);
}

.map-art .road.r2 {
  top: 58%;
  left: -4%;
  width: 70%;
  transform: rotate(-17deg);
}

.map-art .road.r3 {
  top: -10%;
  left: 53%;
  width: 74%;
  transform: rotate(84deg);
}

.map-art .road.r4 {
  top: 18%;
  left: 76%;
  width: 46%;
  transform: rotate(64deg);
}

.map-art .map-pin {
  position: absolute;
  top: 36%;
  left: 44%;
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 50% 50% 50% 4px;
  color: #fff;
  background: var(--logo-red);
  box-shadow: 0 0 0 8px rgba(219, 42, 38, 0.2);
  font-size: 20px;
  transform: rotate(-45deg);
}

.map-art .map-pin b {
  font-weight: 500;
  transform: rotate(45deg);
}

.map-label {
  position: absolute;
  top: 53%;
  left: 47%;
  padding: 9px 14px;
  border-radius: 10px;
  background: var(--paper);
  border: 1px solid var(--line);
  box-shadow: 0 12px 24px -14px rgba(16, 32, 31, 0.5);
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}

.map-caption {
  position: absolute;
  right: 16px;
  bottom: 14px;
  color: rgba(244, 239, 228, 0.9);
  font-size: 9px;
  font-weight: 750;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* MOBILE & TABLET RESPONSIVENESS */
@media (max-width: 980px) {
  .contact-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .contact-card {
    min-height: 0;
  }

  .visit-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .map-art {
    max-height: 360px;
  }
}
</style>
