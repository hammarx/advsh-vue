<script setup>
import { computed } from 'vue'
import { useI18n } from '../i18n/useI18n'
import heroTeamImg from '../assets/img/hero-team.jpg'

const props = defineProps({
  heroData: {
    type: Object,
    default: undefined,
  },
  imageSrc: {
    type: String,
    default: heroTeamImg,
  },
})

const { t } = useI18n()
const hero = computed(() => props.heroData ?? t.value.hero)
</script>

<template>
  <section class="hero">
    <div class="shell hero-grid">
      <div class="hero-copy">
        <p class="label hero-kicker">{{ hero.kicker }}</p>
        <h1>
          {{ hero.titleLine1 }}<br />
          {{ hero.titleLine2 }}<br />
          <em>{{ hero.titleAccent }}</em>
        </h1>
        <p class="hero-lede">{{ hero.lede }}</p>

        <div class="btn-row hero-actions">
          <a
            v-if="hero.primaryCta"
            class="btn btn--primary"
            :href="hero.primaryCta.href"
          >
            {{ hero.primaryCta.label }}
            <span v-if="hero.primaryCta.arrow" class="arr">{{ hero.primaryCta.arrow }}</span>
          </a>
          <a
            v-if="hero.secondaryCta"
            class="btn btn--outline"
            :href="hero.secondaryCta.href"
          >
            {{ hero.secondaryCta.label }}
          </a>
        </div>

        <div class="hero-facts">
          <div
            v-for="(fact, idx) in hero.facts"
            :key="idx"
            class="hero-fact"
          >
            <strong>{{ fact.value }}</strong>
            <span>{{ fact.label }}</span>
          </div>
        </div>
      </div>

      <div class="hero-visual">
        <div class="hero-arch">
          <img
            :src="imageSrc"
            :alt="hero.imageAlt"
            width="1500"
            height="1000"
          />
        </div>
        <div class="hero-note">
          <span class="star" aria-hidden="true">✳</span>
          <strong>{{ hero.noteTitle }}</strong>
          <span>{{ hero.noteSub }}</span>
        </div>
        <a class="hero-circle" :href="hero.circleHref">
          {{ hero.circleLine1 }}<br />
          {{ hero.circleLine2 }}
          <b aria-hidden="true">↘</b>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  padding: clamp(54px, 7.5vw, 92px) 0 clamp(56px, 7vw, 86px);
}
.hero::before {
  content: "";
  position: absolute;
  top: -120px;
  right: -100px;
  width: 480px;
  height: 480px;
  border: 1px solid var(--line);
  border-radius: 50%;
  pointer-events: none;
}
.hero::after {
  content: "";
  position: absolute;
  top: 4%;
  left: -6%;
  width: 175px;
  height: 175px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(16, 32, 31, .18) 1.3px, transparent 1.4px) 0 0 / 13px 13px;
  opacity: .55;
  pointer-events: none;
}

.hero-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.06fr) minmax(0, .94fr);
  gap: clamp(34px, 5vw, 72px);
  align-items: center;
}

.hero-copy {
  min-width: 0;
}

.hero-kicker {
  margin-bottom: 24px;
}

.hero h1 {
  font-family: var(--display);
  font-size: clamp(3.5rem, 7.2vw, 7.05rem);
  font-weight: 500;
  line-height: .88;
  letter-spacing: -.055em;
  overflow-wrap: break-word;
}
.hero h1 em {
  position: relative;
  font-style: italic;
  font-weight: 400;
  color: var(--logo-red, #db2a26);
}
.hero h1 em::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: .04em;
  left: 0;
  height: .05em;
  background: var(--logo-blue, #082f77);
  z-index: -1;
}

html[lang="ru"] .hero h1 {
  font-size: clamp(2.8rem, 5.6vw, 5.3rem);
  letter-spacing: -.02em;
}
html[lang="pl"] .hero h1 {
  font-size: clamp(3rem, 6.2vw, 6.1rem);
}
html[lang="ar"] .hero h1 {
  letter-spacing: 0;
  line-height: 1.08;
}

.hero-lede {
  max-width: 51ch;
  margin-top: 27px;
  color: var(--muted);
  font-size: 17.5px;
  line-height: 1.68;
}
.hero-actions {
  margin-top: 31px;
}

.hero-facts {
  display: flex;
  gap: 28px;
  margin-top: 42px;
  flex-wrap: wrap;
}
.hero-fact {
  padding-left: 16px;
  border-left: 1px solid var(--line-strong);
}
[dir="rtl"] .hero-fact {
  padding-left: 0;
  padding-right: 16px;
  border-left: 0;
  border-right: 1px solid var(--line-strong);
}
.hero-fact strong {
  display: block;
  font-family: var(--display);
  font-size: 22px;
  font-weight: 550;
  line-height: 1;
}
[dir="rtl"] .hero-fact strong {
  direction: ltr;
  unicode-bidi: isolate;
}
.hero-fact span {
  display: block;
  margin-top: 5px;
  color: var(--muted);
  font-size: 9.5px;
  font-weight: 750;
  letter-spacing: .12em;
  text-transform: uppercase;
}

.hero-visual {
  position: relative;
  min-height: 550px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.hero-visual::before {
  content: "";
  position: absolute;
  top: 4%;
  right: 2%;
  width: 285px;
  height: 285px;
  border-radius: 50%;
  background: var(--yellow);
  opacity: .92;
}
.hero-visual::after {
  content: "";
  position: absolute;
  bottom: 2%;
  left: 2%;
  width: 170px;
  height: 170px;
  border-radius: 50%;
  border: 1px solid var(--line-strong);
}

.hero-arch {
  position: relative;
  z-index: 1;
  width: min(100%, 432px);
  margin-left: auto;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-radius: 230px 230px 22px 22px;
  background: var(--mint);
  box-shadow: 0 40px 70px -48px rgba(16, 32, 31, .75);
}
[dir="rtl"] .hero-arch {
  margin-left: 0;
  margin-right: auto;
}
.hero-arch::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, rgba(13, 92, 80, .06), rgba(16, 32, 31, .18));
  pointer-events: none;
}
.hero-arch img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(.82) contrast(1.03);
}

.hero-note {
  position: absolute;
  bottom: 44px;
  left: 0;
  z-index: 3;
  width: 208px;
  padding: 15px 17px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--paper);
  box-shadow: 0 22px 40px -28px rgba(16, 32, 31, .5);
  transform: rotate(-2.5deg);
}
[dir="rtl"] .hero-note {
  left: auto;
  right: 0;
  transform: rotate(2.5deg);
}
.hero-note .star {
  display: block;
  margin-bottom: 5px;
  color: var(--logo-red, #db2a26);
  font-size: 17px;
  line-height: 1;
}
.hero-note strong {
  display: block;
  font-family: var(--display);
  font-size: 18px;
  font-weight: 550;
  line-height: 1.15;
}
.hero-note span {
  display: block;
  margin-top: 4px;
  color: var(--muted);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
}

.hero-circle {
  position: absolute;
  right: -4px;
  bottom: 8px;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 124px;
  height: 124px;
  padding: 12px;
  border-radius: 50%;
  color: #ffffff;
  background: var(--logo-red, #db2a26);
  box-shadow: 0 0 0 7px var(--cream);
  font-size: 11.5px;
  font-weight: 800;
  line-height: 1.25;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: .06em;
  transform: rotate(7deg);
  transition: transform .3s, background .3s, color .3s;
}
[dir="rtl"] .hero-circle {
  right: auto;
  left: -4px;
  transform: rotate(-7deg);
}
.hero-circle b {
  display: block;
  margin-top: 4px;
  font-size: 20px;
  font-weight: 500;
  line-height: 1;
}
.hero-circle:hover {
  background: var(--logo-blue, #082f77);
  color: #ffffff;
  transform: rotate(0deg) scale(1.04);
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.hero-copy > * {
  animation: rise .75s cubic-bezier(.22, 1, .36, 1) both;
}
.hero-copy > :nth-child(2) {
  animation-delay: .07s;
}
.hero-copy > :nth-child(3) {
  animation-delay: .14s;
}
.hero-copy > :nth-child(4) {
  animation-delay: .2s;
}
.hero-copy > :nth-child(5) {
  animation-delay: .26s;
}
.hero-visual {
  animation: rise .9s .12s cubic-bezier(.22, 1, .36, 1) both;
}

@media (max-width: 1120px) {
  .hero h1 {
    font-size: clamp(3.3rem, 6.8vw, 5.8rem);
  }
}

@media (max-width: 980px) {
  .hero-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 44px;
  }
  .hero h1,
  html[lang="ru"] .hero h1,
  html[lang="pl"] .hero h1 {
    font-size: clamp(3.2rem, 9.5vw, 5.5rem);
  }
  .hero-visual {
    min-height: 0;
    width: min(100%, 480px);
    margin: 0 auto;
    justify-content: center;
  }
  .hero-arch,
  [dir="rtl"] .hero-arch {
    width: 100%;
    margin: 0 auto;
  }
  .hero-note {
    left: 12px;
    bottom: 24px;
  }
  [dir="rtl"] .hero-note {
    left: auto;
    right: 12px;
  }
  .hero-circle {
    right: 6px;
    bottom: -6px;
  }
  [dir="rtl"] .hero-circle {
    right: auto;
    left: 6px;
  }
}

@media (max-width: 760px) {
  .hero {
    padding: 36px 0 54px;
  }
  .hero-kicker {
    margin-bottom: 18px;
  }
  .hero h1,
  html[lang="pl"] .hero h1 {
    font-size: clamp(2.75rem, 11vw, 4.4rem);
  }
  html[lang="ru"] .hero h1 {
    font-size: clamp(2.35rem, 9.2vw, 3.8rem);
  }
  .hero-lede {
    margin-top: 20px;
    font-size: 16px;
    line-height: 1.62;
  }
  .hero-actions {
    margin-top: 24px;
  }
  .hero-facts {
    gap: 20px;
    margin-top: 30px;
  }
  .hero-fact strong {
    font-size: 20px;
  }
  .hero-circle {
    width: 106px;
    height: 106px;
    font-size: 10px;
    right: 4px;
    bottom: -14px;
  }
  [dir="rtl"] .hero-circle {
    right: auto;
    left: 4px;
  }
  .hero-note {
    width: 182px;
    padding: 13px 15px;
    left: 6px;
    bottom: 16px;
  }
  [dir="rtl"] .hero-note {
    left: auto;
    right: 6px;
  }
  .hero-note strong {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 28px 0 48px;
  }
  .hero h1,
  html[lang="pl"] .hero h1 {
    font-size: clamp(2.35rem, 10.5vw, 3.3rem);
  }
  html[lang="ru"] .hero h1 {
    font-size: clamp(2.05rem, 8.8vw, 2.9rem);
  }
  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }
  .hero-actions .btn {
    width: 100%;
  }
  .hero-facts {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
    margin-top: 26px;
  }
  .hero-fact {
    padding-left: 11px;
  }
  [dir="rtl"] .hero-fact {
    padding-left: 0;
    padding-right: 11px;
  }
  .hero-fact strong {
    font-size: 18px;
  }
  .hero-fact span {
    font-size: 8.5px;
    letter-spacing: .08em;
  }
  .hero-visual::before {
    width: 190px;
    height: 190px;
  }
  .hero-visual::after {
    width: 120px;
    height: 120px;
  }
  .hero-note {
    width: 158px;
    padding: 11px 13px;
    left: 4px;
    bottom: 12px;
  }
  .hero-note .star {
    font-size: 14px;
    margin-bottom: 3px;
  }
  .hero-note strong {
    font-size: 14.5px;
  }
  .hero-note span {
    font-size: 9px;
  }
  .hero-circle {
    width: 94px;
    height: 94px;
    font-size: 9px;
    padding: 8px;
    bottom: -12px;
  }
  .hero-circle b {
    font-size: 16px;
  }
}
</style>
