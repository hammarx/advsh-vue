<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
    // { num, icon, variant, title, text, linkText, href, arrow }
  },
})
</script>

<template>
  <a
    class="service"
    :class="`service--${item.variant || 'cream'}`"
    :href="item.href"
  >
    <div class="service-top">
      <span class="service-num">{{ item.num }}</span>
      <span class="service-icon" aria-hidden="true">
        <slot name="icon">
          <!-- 01: Chat / Counseling -->
          <svg
            v-if="item.icon === 'chat'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 12a8 8 0 0 1-8 8H6l-3 2v-5a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8Z" />
            <path d="M8 11h8M8 15h5" />
          </svg>

          <!-- 02: Users / Workshops -->
          <svg
            v-else-if="item.icon === 'users'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="9" cy="8" r="3" />
            <circle cx="17" cy="10" r="2.3" />
            <path d="M3 20a6 6 0 0 1 12 0M14.5 20a4.5 4.5 0 0 1 7 0" />
          </svg>

          <!-- 03: Org / Organisational development -->
          <svg
            v-else-if="item.icon === 'org'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="4" y="4" width="6" height="6" rx="1" />
            <rect x="14" y="14" width="6" height="6" rx="1" />
            <path d="M10 7h5a3 3 0 0 1 3 3v4M7 10v4a3 3 0 0 0 3 3h4" />
          </svg>

          <!-- 04: Globe / Networking & policy -->
          <svg
            v-else
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
          </svg>
        </slot>
      </span>
    </div>

    <h3>{{ item.title }}</h3>
    <p>{{ item.text }}</p>
    <span class="service-link">
      {{ item.linkText }}
      <span class="arr">{{ item.arrow || '↗' }}</span>
    </span>
  </a>
</template>

<style scoped>
.service {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 322px;
  padding: 31px;
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: 26px;
  text-decoration: none;
  transition: transform 0.3s, box-shadow 0.3s;
}

.service::after {
  content: '';
  position: absolute;
  right: -66px;
  bottom: -88px;
  width: 220px;
  height: 220px;
  border: 1px solid currentColor;
  border-radius: 50%;
  opacity: 0.13;
  pointer-events: none;
}

[dir='rtl'] .service::after {
  right: auto;
  left: -66px;
}

.service:hover {
  transform: translateY(-5px);
  box-shadow: 0 28px 48px -36px rgba(16, 32, 31, 0.55);
}

.service-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 44px;
}

.service-num {
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.16em;
  opacity: 1;
}

.service-icon {
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  flex: none;
  padding: 12px;
  border: 1px solid currentColor;
  border-radius: 50%;
  opacity: 0.9;
}

.service-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.service h3 {
  font-family: var(--display);
  font-size: clamp(1.7rem, 2.6vw, 2.2rem);
  font-weight: 500;
  line-height: 1.02;
  letter-spacing: -0.03em;
  color: inherit;
}

html[lang='ar'] .service h3 {
  letter-spacing: 0;
  line-height: 1.25;
}

html[lang='ru'] .service h3 {
  letter-spacing: -0.02em;
}

.service p {
  max-width: 38ch;
  margin-top: 11px;
  font-size: 14px;
  line-height: 1.65;
  opacity: 0.9;
}

.service-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: auto;
  padding-top: 23px;
  border-top: 1px solid currentColor;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

html[lang='ar'] .service-link {
  letter-spacing: 0.04em;
}

html[lang='ru'] .service-link {
  letter-spacing: 0.06em;
}

.service-link .arr {
  display: grid;
  place-items: center;
  width: 35px;
  height: 35px;
  border: 1px solid currentColor;
  border-radius: 50%;
  font-size: 17px;
  transition: transform 0.3s;
}

.service:hover .service-link .arr {
  transform: translate(2px, -2px) rotate(0);
}

.service--teal {
  color: var(--text-on-dark);
  background: var(--logo-blue);
}

.service--teal .service-link {
  border-color: var(--line-on-dark);
}

.service--teal:hover .service-link {
  color: var(--text-on-dark);
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.service--cream {
  color: var(--ink);
  background: var(--paper);
  border-color: var(--line);
}

.service--cream .service-icon {
  color: var(--logo-blue);
  background: var(--logo-blue-soft);
  border-color: transparent;
}

.service--coral {
  color: var(--text-on-dark);
  background: var(--logo-red);
}

.service--coral .service-link {
  border-color: var(--line-on-dark);
}

.service--coral p {
  opacity: 0.95;
}

.service--yellow {
  color: var(--ink);
  background: var(--yellow);
}

.service--yellow .service-link {
  border-color: var(--line-strong);
}

@media (max-width: 760px) {
  .service {
    min-height: 280px;
    padding: 26px;
  }
}
</style>
