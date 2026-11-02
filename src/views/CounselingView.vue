<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from '@/router'
import { useSiteStore } from '@/stores/siteStore'
import { SectionLabel, StatList, AppBreadcrumb } from '@/components/ui'
import beratungImg from '@/assets/img/beratung.jpg'

const router = useRouter()
const store = useSiteStore()
const c = computed(() => store.counseling)
const contact = computed(() => store.contact)

const inquiry = reactive({
  team: 'beaggtiv',
  format: 'phone',
  name: '',
  email: '',
  phone: '',
  language: '',
  availability: '',
  topic: '',
  urgent: false,
  consent: false,
})

const openDropdown = ref(null)
const showValidationError = ref(false)
const isSubmitted = ref(false)
const referenceId = ref('')

function toggleDropdown(name) {
  openDropdown.value = openDropdown.value === name ? null : name
}

function closeDropdown() {
  openDropdown.value = null
}

function handleOutsideClick(e) {
  if (!e.target.closest('.custom-dd') && !e.target.closest('.dd-backdrop')) {
    openDropdown.value = null
  }
}

onMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('click', handleOutsideClick)
  }
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', handleOutsideClick)
  }
})

const selectedTeamOption = computed(
  () =>
    c.value.form.teamOptions.find((o) => o.id === inquiry.team) ||
    c.value.form.teamOptions[0]
)

const selectedFormatOption = computed(
  () =>
    c.value.form.formatOptions.find((o) => o.id === inquiry.format) ||
    c.value.form.formatOptions[0]
)

function selectDropdownValue(field, val) {
  inquiry[field] = val
  openDropdown.value = null
}

function selectTeamAndScroll(teamId) {
  inquiry.team = teamId === 'arbeitsrecht' ? 'eufam' : 'beaggtiv'
  scrollToId('anfrage')
}

function scrollToId(id) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const isNameInvalid = computed(() => showValidationError.value && !inquiry.name.trim())
const isContactInvalid = computed(
  () =>
    showValidationError.value &&
    !inquiry.phone.trim() &&
    (!inquiry.email.trim() || !inquiry.email.includes('@'))
)
const isTopicInvalid = computed(() => showValidationError.value && !inquiry.topic.trim())
const isConsentInvalid = computed(() => showValidationError.value && !inquiry.consent)

function handleSubmit() {
  showValidationError.value = true
  if (
    isNameInvalid.value ||
    isContactInvalid.value ||
    isTopicInvalid.value ||
    isConsentInvalid.value
  ) {
    return
  }

  const year = new Date().getFullYear()
  const rand = Math.floor(1000 + Math.random() * 9000)
  referenceId.value = `BERATUNG-${year}-${rand}`
  isSubmitted.value = true
  showValidationError.value = false
  scrollToId('anfrage')
}

function resetInquiry() {
  inquiry.team = 'beaggtiv'
  inquiry.format = 'phone'
  inquiry.name = ''
  inquiry.email = ''
  inquiry.phone = ''
  inquiry.language = ''
  inquiry.availability = ''
  inquiry.topic = ''
  inquiry.urgent = false
  inquiry.consent = false
  showValidationError.value = false
  isSubmitted.value = false
}

function buildInquirySummary() {
  return [
    `advsh e. V. — Beratungsanfrage (${referenceId.value})`,
    `================================================`,
    `Gewünschtes Team: ${selectedTeamOption.value.title}`,
    `Gewünschtes Format: ${selectedFormatOption.value.label}`,
    `Name: ${inquiry.name}`,
    `E-Mail: ${inquiry.email || '-'}`,
    `Telefon: ${inquiry.phone || '-'}`,
    `Sprache: ${inquiry.language || 'Deutsch'}`,
    `Erreichbarkeit: ${inquiry.availability || '-'}`,
    `Dringende Frist: ${inquiry.urgent ? 'JA (Bitte zeitnah prüfen)' : 'Nein'}`,
    ``,
    `Anliegen / Frage:`,
    inquiry.topic,
  ].join('\n')
}

const targetEmail = computed(() => {
  if (inquiry.team === 'beaggtiv') return contact.value.beaggtivEmail
  return contact.value.generalEmail
})

const mailtoHref = computed(() => {
  const subject = encodeURIComponent(
    `Beratungsanfrage [${referenceId.value}] – ${inquiry.name}`
  )
  const body = encodeURIComponent(buildInquirySummary())
  return `mailto:${targetEmail.value}?subject=${subject}&body=${body}`
})

function downloadInquiryReceipt() {
  const text = buildInquirySummary()
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${referenceId.value || 'advsh-beratungsanfrage'}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="counseling-page">
    <!-- Mobile Backdrop for Bottom-Sheet Dropdowns -->
    <div
      v-if="openDropdown"
      class="dd-backdrop"
      aria-hidden="true"
      @click="closeDropdown"
    ></div>

    <!-- 1. HERO SECTION -->
    <section class="counsel-hero">
      <div class="shell">
        <div class="top-nav-row">
          <AppBreadcrumb :current="store.nav.cta?.label || 'Beratung'" />
        </div>

        <div class="counsel-hero-grid">
          <div class="counsel-hero-copy">
            <SectionLabel class="hero-kicker" :text="c.kicker" />
            <h1>
              <span class="hero-line">{{ c.titleLine1 }}</span>
              <span class="hero-line"><em>{{ c.titleAccent }}</em></span>
            </h1>
            <p class="hero-lede">{{ c.lede }}</p>

            <div class="btn-row hero-actions">
              <a class="btn btn--primary" href="#anfrage" @click.prevent="scrollToId('anfrage')">
                {{ c.primaryCta.label }}
                <span class="arr" aria-hidden="true">{{ c.primaryCta.arrow }}</span>
              </a>
              <a class="btn btn--outline" :href="c.secondaryCta.href">
                {{ c.secondaryCta.label }}
              </a>
            </div>

            <StatList :items="c.facts" variant="hero" />
          </div>

          <div class="counsel-hero-visual">
            <div class="counsel-img-frame">
              <img
                :src="beratungImg"
                :alt="c.imageAlt"
                width="1200"
                height="800"
                fetchpriority="high"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. SECTION 01: WANN WIR HELFEN (6 AGG GROUNDS) -->
    <section class="section">
      <div class="shell intro-grid">
        <div class="intro-side">
          <SectionLabel :text="c.grounds.label" />
          <p class="intro-note">{{ c.grounds.note }}</p>
        </div>
        <div class="intro-main">
          <h2>
            {{ c.grounds.headingPrefix }}
            <em class="accent-teal">{{ c.grounds.headingAccent }}</em>
            {{ c.grounds.headingSuffix }}
          </h2>
          <div class="intro-text">
            <p v-for="(p, idx) in c.grounds.paragraphs" :key="idx">{{ p }}</p>
          </div>

          <div class="grounds-grid">
            <div v-for="item in c.grounds.items" :key="item" class="ground-chip">
              <i aria-hidden="true">✳</i>
              <span>{{ item }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. SECTION 02: UNSERE BERATUNGSTEAMS (BeAGGtiv & EU-FAM / FI.SH) -->
    <section class="section section--paper">
      <div class="shell">
        <div class="section-head">
          <div>
            <SectionLabel :text="c.teams.label" />
            <h2>
              {{ c.teams.headingPrefix }}
              <em class="accent-teal">{{ c.teams.headingAccent }}</em>
            </h2>
          </div>
          <p class="section-sub">{{ c.teams.sub }}</p>
        </div>

        <div class="counsel-grid">
          <article
            v-for="card in c.teams.cards"
            :key="card.id"
            class="counsel-card"
            :class="{ 'counsel-card--dark': card.dark }"
          >
            <SectionLabel :text="card.kicker" :light="card.dark" />
            <h3>{{ card.title }}</h3>
            <p>{{ card.text }}</p>

            <ul class="counsel-list">
              <li v-for="li in card.list" :key="li">{{ li }}</li>
            </ul>

            <div class="counsel-contacts">
              <div v-for="ct in card.contacts" :key="ct.label" class="counsel-contact-row">
                <span>{{ ct.label }}</span>
                <a :href="ct.href">{{ ct.value }}</a>
              </div>
            </div>

            <button
              type="button"
              class="btn"
              :class="card.dark ? 'btn--light' : 'btn--outline'"
              @click="selectTeamAndScroll(card.id)"
            >
              <span>{{ card.ctaLabel }}</span>
              <span class="arr" aria-hidden="true">↓</span>
            </button>
          </article>
        </div>
      </div>
    </section>

    <!-- 4. SECTION 03: SO LÄUFT ES AB (4 STEPS) -->
    <section class="section">
      <div class="shell">
        <div class="section-head">
          <div>
            <SectionLabel :text="c.steps.label" />
            <h2>
              {{ c.steps.headingPrefix }}<br />
              <em class="accent-teal">{{ c.steps.headingAccent }}</em>
            </h2>
          </div>
        </div>

        <div class="process-grid">
          <div v-for="st in c.steps.items" :key="st.num" class="process-step">
            <span class="num">{{ st.num }}</span>
            <h3>{{ st.title }}</h3>
            <p>{{ st.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. SECTION 04: BERATUNG ANFRAGEN FORM (#anfrage) -->
    <section id="anfrage" class="section section--paper inquiry-section">
      <div class="shell">
        <div class="inquiry-head">
          <SectionLabel :text="c.form.label" />
          <h2>
            {{ c.form.titlePrefix }}
            <em class="accent-teal">{{ c.form.titleAccent }}</em>
          </h2>
          <p class="inquiry-lede">{{ c.form.lede }}</p>

          <!-- Clear Cross-Link Banner to Vorfall melden -->
          <div class="switch-to-report-banner">
            <span>{{ c.form.reportBannerText }}</span>
            <RouterLink to="/vorfall-melden" class="switch-link">
              {{ c.form.reportBannerLink }}
            </RouterLink>
          </div>
        </div>

        <!-- Confirmation Screen after Submitting Inquiry -->
        <div v-if="isSubmitted" class="inquiry-success">
          <div class="inquiry-success-top">
            <SectionLabel :text="referenceId" light />
            <h3>{{ c.form.successTitle }}</h3>
            <p>{{ c.form.successText }}</p>
          </div>
          <div class="inquiry-success-actions">
            <a class="btn btn--primary" :href="mailtoHref">
              {{ c.form.sendMailBtn }}
              <span class="arr" aria-hidden="true">↗</span>
            </a>
            <button type="button" class="btn btn--outline" @click="downloadInquiryReceipt">
              {{ c.form.downloadBtn }}
            </button>
            <button type="button" class="btn btn--outline" @click="resetInquiry">
              {{ c.form.newInquiryBtn }}
            </button>
          </div>
        </div>

        <!-- Inquiry Form Card -->
        <form v-else class="inquiry-form-card" novalidate @submit.prevent="handleSubmit">
          <!-- Row 1: Counseling Team Dropdown + Format Dropdown (Same Horizontal Level!) -->
          <div class="field-row">
            <div class="field-group">
              <label class="field-label">{{ c.form.teamLabel }}</label>
              <div class="custom-dd" :class="{ 'is-open': openDropdown === 'team' }">
                <button
                  type="button"
                  class="dd-trigger"
                  :aria-expanded="openDropdown === 'team'"
                  @click="toggleDropdown('team')"
                >
                  <span class="dd-trigger-content">
                    <span class="dd-dot" aria-hidden="true"></span>
                    <span class="dd-value">{{ selectedTeamOption.title }}</span>
                  </span>
                  <span class="dd-chevron" aria-hidden="true">▾</span>
                </button>

                <div v-if="openDropdown === 'team'" class="dd-menu" role="listbox">
                  <div class="dd-sheet-header">
                    <span class="dd-sheet-handle" aria-hidden="true"></span>
                    <strong>{{ c.form.teamLabel.replace(' *', '') }}</strong>
                    <button type="button" class="dd-sheet-close" @click="closeDropdown">✕</button>
                  </div>
                  <div class="dd-menu-body">
                    <button
                      v-for="opt in c.form.teamOptions"
                      :key="opt.id"
                      type="button"
                      class="dd-option dd-option--rich"
                      :class="{ 'is-selected': inquiry.team === opt.id }"
                      @click="selectDropdownValue('team', opt.id)"
                    >
                      <span class="dd-radio" aria-hidden="true"></span>
                      <span class="dd-opt-copy">
                        <strong>{{ opt.title }}</strong>
                        <small>{{ opt.desc }}</small>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="field-group">
              <label class="field-label">{{ c.form.formatLabel }}</label>
              <div class="custom-dd" :class="{ 'is-open': openDropdown === 'format' }">
                <button
                  type="button"
                  class="dd-trigger"
                  :aria-expanded="openDropdown === 'format'"
                  @click="toggleDropdown('format')"
                >
                  <span class="dd-trigger-content">
                    <span class="dd-dot dd-dot--red" aria-hidden="true"></span>
                    <span class="dd-value">{{ selectedFormatOption.label }}</span>
                  </span>
                  <span class="dd-chevron" aria-hidden="true">▾</span>
                </button>

                <div v-if="openDropdown === 'format'" class="dd-menu" role="listbox">
                  <div class="dd-sheet-header">
                    <span class="dd-sheet-handle" aria-hidden="true"></span>
                    <strong>{{ c.form.formatLabel }}</strong>
                    <button type="button" class="dd-sheet-close" @click="closeDropdown">✕</button>
                  </div>
                  <div class="dd-menu-body">
                    <button
                      v-for="fOpt in c.form.formatOptions"
                      :key="fOpt.id"
                      type="button"
                      class="dd-option"
                      :class="{ 'is-selected': inquiry.format === fOpt.id }"
                      @click="selectDropdownValue('format', fOpt.id)"
                    >
                      <span class="dd-radio" aria-hidden="true"></span>
                      <span class="dd-opt-label">{{ fOpt.label }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Row 2: Name + E-Mail (Same Horizontal Level!) -->
          <div class="field-row field-row--top-gap">
            <div class="field-group">
              <label class="field-label" for="inq-name">{{ c.form.nameLabel }}</label>
              <input
                id="inq-name"
                v-model="inquiry.name"
                type="text"
                autocomplete="name"
                class="text-input"
                :class="{ 'is-invalid': isNameInvalid }"
                :placeholder="c.form.namePlaceholder"
                required
              />
            </div>

            <div class="field-group">
              <label class="field-label" for="inq-email">{{ c.form.emailLabel }}</label>
              <input
                id="inq-email"
                v-model="inquiry.email"
                type="email"
                inputmode="email"
                autocomplete="email"
                class="text-input"
                :class="{ 'is-invalid': isContactInvalid }"
                :placeholder="c.form.emailPlaceholder"
                required
              />
            </div>
          </div>

          <!-- Row 3: Phone + Language (Same Horizontal Level!) -->
          <div class="field-row field-row--top-gap">
            <div class="field-group">
              <label class="field-label" for="inq-phone">{{ c.form.phoneLabel }}</label>
              <input
                id="inq-phone"
                v-model="inquiry.phone"
                type="tel"
                inputmode="tel"
                autocomplete="tel"
                class="text-input"
                :class="{ 'is-invalid': isContactInvalid }"
                :placeholder="c.form.phonePlaceholder"
              />
            </div>

            <div class="field-group">
              <label class="field-label" for="inq-lang">{{ c.form.langLabel }}</label>
              <input
                id="inq-lang"
                v-model="inquiry.language"
                type="text"
                class="text-input"
                :placeholder="c.form.langPlaceholder"
              />
            </div>
          </div>

          <!-- Row 4: Availability -->
          <div class="field-group field-row--top-gap">
            <label class="field-label" for="inq-avail">{{ c.form.availabilityLabel }}</label>
            <input
              id="inq-avail"
              v-model="inquiry.availability"
              type="text"
              class="text-input"
              :placeholder="c.form.availabilityPlaceholder"
            />
          </div>

          <!-- Row 5: Short Topic / Question -->
          <div class="field-group field-row--top-gap">
            <label class="field-label" for="inq-topic">{{ c.form.topicLabel }}</label>
            <p class="field-hint">{{ c.form.topicHint }}</p>
            <textarea
              id="inq-topic"
              v-model="inquiry.topic"
              rows="5"
              class="text-input textarea-input"
              :class="{ 'is-invalid': isTopicInvalid }"
              :placeholder="c.form.topicPlaceholder"
              required
            ></textarea>
          </div>

          <!-- Urgent Deadline Checkbox -->
          <label class="checkbox-row">
            <input v-model="inquiry.urgent" type="checkbox" />
            <span>{{ c.form.urgentLabel }}</span>
          </label>

          <!-- Consent Checkbox -->
          <div class="consent-box" :class="{ 'is-invalid': isConsentInvalid }">
            <label class="checkbox-row checkbox-row--consent">
              <input v-model="inquiry.consent" type="checkbox" required />
              <span>
                {{ c.form.consentLabel }}
                <a
                  href="https://advsh.de/datenschutzerklaerung/"
                  target="_blank"
                  rel="noopener"
                  class="privacy-link"
                >
                  {{ c.form.privacyLinkText }} ↗
                </a>
              </span>
            </label>
          </div>

          <p
            v-if="showValidationError && (isNameInvalid || isContactInvalid || isTopicInvalid || isConsentInvalid)"
            class="validation-banner"
            role="alert"
          >
            {{ c.form.validationError }}
          </p>

          <div class="submit-bar">
            <div class="submit-actions">
              <button type="submit" class="btn btn--primary">
                {{ c.form.submitBtn }}
                <span class="arr" aria-hidden="true">↗</span>
              </button>
              <button type="button" class="btn btn--outline" @click="resetInquiry">
                {{ c.form.resetBtn }}
              </button>
            </div>
            <small class="required-note">{{ c.form.requiredNote }}</small>
          </div>
        </form>
      </div>
    </section>

    <!-- 6. SECTION 05: FAQ (#faq) -->
    <section id="faq" class="section">
      <div class="shell intro-grid">
        <div class="intro-side">
          <SectionLabel :text="c.faq.label" />
          <p class="intro-note">{{ c.faq.note }}</p>
        </div>
        <div class="intro-main">
          <h2>
            {{ c.faq.headingPrefix }}
            <em class="accent-teal">{{ c.faq.headingAccent }}</em>
          </h2>

          <div class="faq-list">
            <details
              v-for="(item, idx) in c.faq.items"
              :key="idx"
              class="faq-item"
              :open="idx === 0"
            >
              <summary>{{ item.q }}</summary>
              <p>{{ item.a }}</p>
            </details>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.counseling-page {
  overflow-x: clip;
}

.counseling-page *,
.counseling-page *::before,
.counseling-page *::after {
  box-sizing: border-box;
}

.top-nav-row {
  margin-bottom: 24px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background .25s, border-color .25s, transform .25s;
}
.back-btn:hover {
  background: var(--logo-blue);
  border-color: var(--logo-blue);
  color: var(--text-on-dark);
  transform: translateX(-2px);
}

/* Hero */
.counsel-hero {
  padding: clamp(32px, 5vw, 64px) 0 clamp(56px, 7vw, 86px);
  border-bottom: 1px solid var(--line);
}

.counsel-hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, .92fr);
  gap: clamp(34px, 5vw, 68px);
  align-items: center;
}

.hero-kicker {
  margin-bottom: 20px;
}

.counsel-hero h1 {
  font-family: var(--display);
  font-size: clamp(3rem, 5.2vw, 5.1rem);
  font-weight: 500;
  line-height: .94;
  letter-spacing: -.05em;
}

.hero-line {
  display: block;
}

.counsel-hero h1 em {
  position: relative;
  font-style: italic;
  font-weight: 400;
  color: var(--logo-red);
}

.counsel-hero h1 em::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: .04em;
  left: 0;
  height: .05em;
  background: var(--logo-blue);
  z-index: -1;
}

.hero-lede {
  max-width: 54ch;
  margin-top: 24px;
  color: var(--muted);
  font-size: 17.5px;
  line-height: 1.68;
}

.hero-actions {
  margin-top: 28px;
}

.counsel-img-frame {
  overflow: hidden;
  border-radius: 28px;
  aspect-ratio: 4 / 3;
  box-shadow: 0 36px 68px -42px rgba(16, 32, 31, .55);
}

.counsel-img-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Intro / AGG Grounds */
.intro-grid {
  display: grid;
  grid-template-columns: minmax(220px, .38fr) minmax(0, .62fr);
  gap: clamp(28px, 5vw, 68px);
  align-items: start;
}

.intro-note {
  max-width: 24ch;
  margin-top: 16px;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
}

.intro-text {
  display: grid;
  gap: 16px;
  margin-top: 24px;
  color: var(--ink-soft);
  font-size: 17px;
  line-height: 1.72;
}

.grounds-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 30px;
}

.ground-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 18px;
  border: 1px solid var(--line-strong);
  border-radius: 16px;
  background: var(--paper);
  font-size: 15px;
  font-weight: 700;
}

.ground-chip i {
  color: var(--logo-red);
  font-style: normal;
  font-size: 17px;
}

/* Section 02: Counseling Teams */
.section-sub {
  max-width: 38ch;
  color: var(--muted);
  font-size: 15px;
  line-height: 1.6;
}

.counsel-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 26px;
}

.counsel-card {
  display: flex;
  flex-direction: column;
  padding: clamp(28px, 4vw, 44px);
  border: 1px solid var(--line-strong);
  border-radius: 28px;
  background: var(--cream);
}

.counsel-card--dark {
  background: var(--logo-blue);
  color: var(--text-on-dark);
  border-color: transparent;
  box-shadow: 0 32px 64px -38px var(--logo-blue-shadow);
}

.counsel-card h3 {
  margin-top: 14px;
  font-family: var(--display);
  font-size: clamp(1.75rem, 2.6vw, 2.3rem);
  font-weight: 500;
  line-height: 1.1;
}

.counsel-card > p {
  margin-top: 14px;
  font-size: 15.5px;
  line-height: 1.65;
  color: var(--muted);
}

.counsel-card--dark > p {
  color: var(--text-on-dark-soft);
}

.counsel-list {
  list-style: none;
  display: grid;
  gap: 10px;
  margin-top: 22px;
  padding-top: 20px;
  border-top: 1px solid var(--line);
}

.counsel-card--dark .counsel-list {
  border-top-color: var(--line-on-dark);
}

.counsel-list li {
  position: relative;
  padding-left: 22px;
  font-size: 14.5px;
  font-weight: 600;
}

.counsel-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--logo-red);
  font-weight: 900;
}

.counsel-card--dark .counsel-list li::before {
  color: var(--yellow);
}

.counsel-contacts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: auto;
  padding: 22px 0;
}

.counsel-contact-row span {
  display: block;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--muted);
}

.counsel-card--dark .counsel-contact-row span {
  color: var(--text-on-dark-muted);
}

.counsel-contact-row a {
  display: inline-block;
  margin-top: 4px;
  font-family: var(--display);
  font-size: 18px;
  font-weight: 550;
  text-decoration: none;
}

.counsel-card--dark .counsel-contact-row a {
  color: var(--text-on-dark);
}

/* Bold white with underline on hover for links on blue background */
.counsel-card--dark .counsel-contact-row a:hover {
  color: var(--text-on-dark);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* Section 03: Process Steps */
.process-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.process-step {
  padding: 28px 24px;
  border: 1px solid var(--line);
  border-radius: 24px;
  background: var(--paper);
}

.process-step .num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--logo-blue);
  color: var(--text-on-dark);
  font-family: var(--display);
  font-size: 15px;
  font-weight: 600;
}

.process-step h3 {
  margin-top: 18px;
  font-family: var(--display);
  font-size: 21px;
  font-weight: 550;
  line-height: 1.2;
}

.process-step p {
  margin-top: 10px;
  color: var(--muted);
  font-size: 14.5px;
  line-height: 1.6;
}

/* Section 04: Inquiry Form (#anfrage) */
.inquiry-section {
  scroll-margin-top: 86px;
}

.inquiry-head {
  max-width: 780px;
  margin-bottom: 32px;
}

.inquiry-head h2 {
  margin-top: 12px;
}

.inquiry-lede {
  margin-top: 16px;
  color: var(--muted);
  font-size: 17px;
  line-height: 1.65;
}

.switch-to-report-banner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 22px;
  padding: 14px 20px;
  border-radius: 16px;
  background: var(--cream);
  border: 1px solid var(--line-strong);
  font-size: 13.5px;
  font-weight: 600;
}

.switch-link {
  color: var(--logo-red);
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.inquiry-form-card {
  max-width: 920px;
  padding: clamp(24px, 4vw, 44px);
  border: 1px solid var(--line-strong);
  border-radius: 28px;
  background: var(--cream);
  box-shadow: 0 26px 52px -36px rgba(16, 32, 31, .22);
}

.field-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  align-items: start;
  width: 100%;
  min-width: 0;
}

.field-row--top-gap {
  margin-top: 22px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  min-width: 0;
}

.field-row > .field-group > .field-label {
  min-height: 40px;
  display: flex;
  align-items: flex-end;
  line-height: 1.3;
}

.field-label {
  font-size: 13.5px;
  font-weight: 750;
  color: var(--ink);
}

.field-hint {
  margin-top: -2px;
  color: var(--muted);
  font-size: 13.5px;
  line-height: 1.55;
}

.text-input,
.dd-trigger {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  height: 52px;
  padding: 0 16px;
  border: 1.5px solid var(--line-strong);
  border-radius: 14px;
  background: var(--white);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 15px;
  line-height: 1.4;
  overflow: hidden;
  transition: border-color .2s, box-shadow .2s;
}

input.text-input {
  display: block;
}

.text-input:focus,
.custom-dd.is-open .dd-trigger {
  outline: none;
  border-color: var(--logo-blue);
  box-shadow: 0 0 0 3px var(--logo-blue-soft);
}

.text-input.is-invalid {
  border-color: var(--logo-red);
  box-shadow: 0 0 0 3px rgba(219, 42, 38, .12);
}

.textarea-input {
  display: block;
  height: auto;
  padding: 14px 16px;
  resize: vertical;
  min-height: 130px;
  overflow: auto;
}

/* Custom Dropdowns */
.dd-backdrop {
  display: none;
}

.custom-dd {
  position: relative;
  width: 100%;
  min-width: 0;
}

.dd-trigger {
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
  text-align: left;
  font-weight: 650;
}

.dd-trigger-content {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
}

.dd-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--logo-blue);
  flex-shrink: 0;
}

.dd-dot--red {
  background: var(--logo-red);
}

.dd-value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dd-chevron {
  font-size: 14px;
  color: var(--muted);
  transition: transform .22s ease;
}

.custom-dd.is-open .dd-chevron {
  transform: rotate(180deg);
  color: var(--logo-blue);
}

.dd-sheet-header {
  display: none;
}

.dd-menu {
  position: absolute;
  top: calc(100% + 7px);
  left: 0;
  right: 0;
  z-index: 60;
  padding: 8px;
  border: 1.5px solid var(--line-strong);
  border-radius: 18px;
  background: var(--white);
  box-shadow: 0 26px 52px -20px rgba(16, 32, 31, .32);
}

.dd-menu-body {
  display: grid;
  gap: 4px;
}

.dd-option {
  display: flex;
  align-items: center;
  gap: 11px;
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: var(--ink);
  font-family: var(--sans);
  font-size: 13.5px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
}

.dd-option:hover {
  background: var(--cream);
}

.dd-option.is-selected {
  background: rgba(8, 47, 119, .08);
  color: var(--logo-blue);
  font-weight: 750;
}

.dd-option--rich {
  align-items: flex-start;
  padding: 12px;
}

.dd-opt-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dd-opt-copy strong {
  font-size: 14px;
  font-weight: 750;
  color: var(--ink);
}

.dd-opt-copy small {
  font-size: 12px;
  font-weight: 500;
  color: var(--muted);
  line-height: 1.4;
}

.dd-radio {
  width: 18px;
  height: 18px;
  border: 2px solid var(--line-strong);
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
  margin-top: 1px;
}

.dd-option.is-selected .dd-radio {
  border-color: var(--logo-red);
  background: var(--logo-red);
}

.dd-option.is-selected .dd-radio::after {
  content: "";
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  background: var(--white);
}

.checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  width: 100%;
  margin-top: 18px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--ink-soft);
  cursor: pointer;
}

.checkbox-row > span {
  min-width: 0;
  flex: 1;
}

.checkbox-row input[type="checkbox"] {
  width: 20px;
  height: 20px;
  margin-top: 1px;
  accent-color: var(--logo-red);
  flex-shrink: 0;
}

.consent-box {
  margin-top: 20px;
  padding: 16px 18px;
  border: 1.5px solid var(--line);
  border-radius: 16px;
  background: var(--white);
}

.consent-box.is-invalid {
  border-color: var(--logo-red);
  background: rgba(219, 42, 38, .04);
}

.checkbox-row--consent {
  margin-top: 0;
  font-size: 13.5px;
}

.privacy-link {
  margin-left: 6px;
  color: var(--logo-blue);
  font-weight: 700;
  text-decoration: underline;
}

.validation-banner {
  margin-top: 18px;
  padding: 14px 18px;
  border-radius: 14px;
  background: rgba(219, 42, 38, .1);
  border: 1px solid var(--logo-red);
  color: var(--logo-red);
  font-size: 14px;
  font-weight: 700;
}

.submit-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 26px;
  padding-top: 22px;
  border-top: 1px solid var(--line);
}

.submit-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.required-note {
  color: var(--muted);
  font-size: 12.5px;
  font-weight: 600;
}

/* Inquiry Success Card */
.inquiry-success {
  max-width: 820px;
  overflow: hidden;
  border-radius: 26px;
  border: 1px solid var(--line);
  background: var(--cream);
}

.inquiry-success-top {
  padding: 36px;
  background: var(--logo-blue);
  color: var(--text-on-dark);
}

.inquiry-success-top h3 {
  margin-top: 12px;
  font-family: var(--display);
  font-size: 28px;
  color: var(--text-on-dark);
}

.inquiry-success-top p {
  margin-top: 10px;
  color: var(--text-on-dark-soft);
  font-size: 16px;
}

.inquiry-success-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 28px 36px;
}

/* FAQ Accordion */
.faq-list {
  display: grid;
  gap: 12px;
  margin-top: 28px;
}

.faq-item {
  padding: 20px 24px;
  border: 1px solid var(--line-strong);
  border-radius: 18px;
  background: var(--paper);
}

.faq-item summary {
  font-family: var(--display);
  font-size: 19px;
  font-weight: 550;
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item summary::after {
  content: "+";
  color: var(--logo-red);
  font-size: 24px;
  font-weight: 400;
  line-height: 1;
}

.faq-item[open] summary::after {
  content: "−";
}

.faq-item p {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--line);
  color: var(--ink-soft);
  font-size: 15.5px;
  line-height: 1.68;
}

@media (max-width: 980px) {
  .counsel-hero-grid,
  .intro-grid,
  .counsel-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .process-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 860px) {
  .field-row,
  .grounds-grid,
  .process-grid,
  .counsel-contacts {
    grid-template-columns: minmax(0, 1fr);
  }

  .field-row > .field-group > .field-label {
    min-height: 0;
  }

  .text-input,
  .dd-trigger {
    height: 54px;
    font-size: 16px;
  }

  .dd-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 140;
    background: rgba(16, 32, 31, .48);
    backdrop-filter: blur(3px);
  }

  .dd-menu {
    position: fixed;
    top: auto;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 150;
    max-height: 80vh;
    padding: 12px 16px max(18px, env(safe-area-inset-bottom));
    border-radius: 24px 24px 0 0;
    border: none;
    box-shadow: 0 -20px 50px rgba(16, 32, 31, .35);
  }

  .dd-sheet-header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 4px 14px;
    margin-bottom: 6px;
    border-bottom: 1px solid var(--line);
  }

  .dd-sheet-handle {
    position: absolute;
    top: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 4px;
    border-radius: 999px;
    background: var(--line-strong);
  }

  .dd-sheet-close {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    background: var(--cream);
    font-weight: 800;
    cursor: pointer;
  }

  .submit-actions {
    width: 100%;
    flex-direction: column;
  }
  .submit-actions .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
