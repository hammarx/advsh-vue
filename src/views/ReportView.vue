<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from '@/router'
import { useSiteStore } from '@/stores/siteStore'
import { SectionLabel } from '@/components/ui'

const router = useRouter()
const store = useSiteStore()
const r = computed(() => store.report)
const contact = computed(() => store.contact)
const lang = computed(() => store.currentLang)

// Localized mobile UX helpers (Quick-Date, Bottom-Sheet Actions, Writing Prompts, Progress)
const mobileUi = computed(() => {
  const map = {
    de: {
      today: 'Heute',
      yesterday: 'Gestern',
      done: 'Auswahl übernehmen',
      clear: 'Alle löschen',
      selectedCount: 'ausgewählt',
      quickCall: 'Lieber direkt sprechen? Jetzt anrufen:',
      stepTitles: ['01 Ort & Zeit', '02 Schilderung', '03 Einordnung', '04 Absenden'],
      promptHint: 'Tipp fürs Smartphone: Tippen Sie auf eine Frage, um sie als Schreibhilfe einzufügen:',
      prompts: [
        { label: '+ Was ist passiert?', text: 'Was ist passiert: ' },
        { label: '+ Was wurde gesagt/getan?', text: 'Was genau gesagt oder getan wurde: ' },
        { label: '+ Wer war beteiligt?', text: 'Beteiligte Personen / Stelle: ' },
      ],
    },
    en: {
      today: 'Today',
      yesterday: 'Yesterday',
      done: 'Apply selection',
      clear: 'Clear all',
      selectedCount: 'selected',
      quickCall: 'Prefer to talk directly? Call us:',
      stepTitles: ['01 Time & Place', '02 Description', '03 Category', '04 Submit'],
      promptHint: 'Mobile tip: Tap a question below to insert it as a writing guide:',
      prompts: [
        { label: '+ What happened?', text: 'What happened: ' },
        { label: '+ What was said/done?', text: 'What was said or done: ' },
        { label: '+ Who was involved?', text: 'People / institution involved: ' },
      ],
    },
    ar: {
      today: 'اليوم',
      yesterday: 'أمس',
      done: 'تأكيد الاختيار',
      clear: 'مسح الكل',
      selectedCount: 'محدد',
      quickCall: 'تفضّل التحدث مباشرة؟ اتصل بنا:',
      stepTitles: ['01 الزمان والمكان', '02 الوصف', '03 التصنيف', '04 الإرسال'],
      promptHint: 'نصيحة للهاتف: اضغط على أحد الأسئلة لإضافته كمساعدة في الكتابة:',
      prompts: [
        { label: '+ ماذا حدث؟', text: 'ماذا حدث: ' },
        { label: '+ ماذا قيل أو فُعل؟', text: 'ما قيل أو فُعل بالضبط: ' },
        { label: '+ من كان طرفًا؟', text: 'الأشخاص أو الجهة المعنية: ' },
      ],
    },
    tr: {
      today: 'Bugün',
      yesterday: 'Dün',
      done: 'Seçimi onayla',
      clear: 'Tümünü temizle',
      selectedCount: 'seçildi',
      quickCall: 'Doğrudan konuşmak ister misiniz? Hemen arayın:',
      stepTitles: ['01 Yer ve Zaman', '02 Anlatım', '03 Sınıflandırma', '04 Gönder'],
      promptHint: 'Telefon ipucu: Yazım yardımcısı olarak eklemek için bir soruya dokunun:',
      prompts: [
        { label: '+ Ne oldu?', text: 'Ne oldu: ' },
        { label: '+ Ne söylendi/yapıldı?', text: 'Tam olarak ne söylendi veya yapıldı: ' },
        { label: '+ Kimler dahildi?', text: 'İlgili kişiler / kurum: ' },
      ],
    },
    ru: {
      today: 'Сегодня',
      yesterday: 'Вчера',
      done: 'Готово',
      clear: 'Сбросить',
      selectedCount: 'выбрано',
      quickCall: 'Предпочитаете поговорить лично? Позвоните нам:',
      stepTitles: ['01 Место и время', '02 Описание', '03 Категории', '04 Отправка'],
      promptHint: 'Подсказка: нажмите на вопрос ниже, чтобы вставить его в поле описания:',
      prompts: [
        { label: '+ Что произошло?', text: 'Что произошло: ' },
        { label: '+ Что было сказано/сделано?', text: 'Что именно было сказано или сделано: ' },
        { label: '+ Кто участвовал?', text: 'Участники / организация: ' },
      ],
    },
    pl: {
      today: 'Dzisiaj',
      yesterday: 'Wczoraj',
      done: 'Zatwierdź wybór',
      clear: 'Wyczyść',
      selectedCount: 'wybrano',
      quickCall: 'Wolisz porozmawiać? Zadzwoń do nas:',
      stepTitles: ['01 Czas i miejsce', '02 Opis', '03 Kategoria', '04 Wyślij'],
      promptHint: 'Wskazówka na telefon: dotknij pytania, aby wstawić je jako podpowiedź:',
      prompts: [
        { label: '+ Co się stało?', text: 'Co się wydarzyło: ' },
        { label: '+ Co powiedziano/zrobiono?', text: 'Co dokładnie powiedziano lub zrobiono: ' },
        { label: '+ Kto brał udział?', text: 'Osoby / instytucja: ' },
      ],
    },
  }
  return map[lang.value] || map.de
})

const form = reactive({
  reporterRole: 'affected',
  date: '',
  time: '',
  ongoing: false,
  district: '',
  locationDetail: '',
  areas: [],
  description: '',
  racismTypes: [],
  incidentTypes: [],
  witnesses: 'unsure',
  impact: '',
  mode: 'counseling',
  name: '',
  email: '',
  phone: '',
  preferredLang: '',
  preferredContact: 'email',
  consent: false,
})

// Quick Date Helpers for Mobile
function formatIsoDate(dateObj) {
  const y = dateObj.getFullYear()
  const m = String(dateObj.getMonth() + 1).padStart(2, '0')
  const d = String(dateObj.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const todayIso = computed(() => formatIsoDate(new Date()))
const yesterdayIso = computed(() => {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return formatIsoDate(d)
})

function setQuickDate(type) {
  form.ongoing = false
  if (type === 'today') {
    form.date = todayIso.value
  } else if (type === 'yesterday') {
    form.date = yesterdayIso.value
  }
}

// Insert writing prompt into description textarea
const descriptionInputRef = ref(null)
function insertPrompt(promptText) {
  if (!form.description.trim()) {
    form.description = promptText
  } else if (!form.description.includes(promptText)) {
    form.description = `${form.description.trimEnd()}\n\n${promptText}`
  }
  if (descriptionInputRef.value) {
    descriptionInputRef.value.focus()
  }
}

// Section Completion Indicators for Progress Bar
const sectionDone = computed(() => ({
  s1: Boolean(form.district),
  s2: Boolean(form.description.trim()),
  s3: Boolean(form.racismTypes.length || form.incidentTypes.length),
  s4:
    Boolean(form.consent) &&
    (form.mode === 'anonymous' || (Boolean(form.email.trim()) && form.email.includes('@'))),
}))

const completionPercent = computed(() => {
  const vals = Object.values(sectionDone.value)
  const doneCount = vals.filter(Boolean).length
  return Math.round((doneCount / vals.length) * 100)
})

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Custom Dropdown State ('role' | 'district' | 'areas' | 'racism' | 'incident' | 'witnesses' | 'contact' | null)
const openDropdown = ref(null)

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

function handleKeydown(e) {
  if (e.key === 'Escape' && openDropdown.value) {
    openDropdown.value = null
  }
}

// Lock body scroll on mobile when a bottom-sheet dropdown is open
watch(openDropdown, (val) => {
  if (typeof document === 'undefined' || typeof window === 'undefined') return
  if (val && window.innerWidth <= 860) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  if (typeof document !== 'undefined') {
    document.addEventListener('click', handleOutsideClick)
    document.addEventListener('keydown', handleKeydown)
  }
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', handleOutsideClick)
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  }
})

const showValidationError = ref(false)
const isSubmitted = ref(false)
const referenceId = ref('')

function toggleArrayItem(arr, item) {
  const idx = arr.indexOf(item)
  if (idx === -1) {
    arr.push(item)
  } else {
    arr.splice(idx, 1)
  }
}

function clearArray(arr) {
  arr.splice(0, arr.length)
}

function selectSingle(field, value) {
  form[field] = value
  openDropdown.value = null
}

const selectedRoleOption = computed(
  () =>
    r.value.sections.reporterOptions.find((o) => o.id === form.reporterRole) ||
    r.value.sections.reporterOptions[0]
)

const selectedWitnessOption = computed(
  () =>
    r.value.sections.witnessOptions.find((o) => o.id === form.witnesses) ||
    r.value.sections.witnessOptions[2]
)

const selectedContactOption = computed(
  () =>
    r.value.sections.preferredContactOptions.find((o) => o.id === form.preferredContact) ||
    r.value.sections.preferredContactOptions[0]
)

function formatMultiSummary(items, placeholder) {
  if (!items.length) return placeholder
  if (items.length === 1) return items[0]
  return `${items[0]} (+${items.length - 1})`
}

const isDistrictInvalid = computed(() => showValidationError.value && !form.district)
const isDescriptionInvalid = computed(
  () => showValidationError.value && !form.description.trim()
)
const isEmailInvalid = computed(
  () =>
    showValidationError.value &&
    form.mode === 'counseling' &&
    (!form.email.trim() || !form.email.includes('@'))
)
const isConsentInvalid = computed(() => showValidationError.value && !form.consent)

function generateRefId() {
  const year = new Date().getFullYear()
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `ADVSH-${year}-${rand}`
}

function handleSubmit() {
  showValidationError.value = true

  const validDistrict = Boolean(form.district)
  const validDesc = Boolean(form.description.trim())
  const validEmail =
    form.mode === 'anonymous' || (Boolean(form.email.trim()) && form.email.includes('@'))
  const validConsent = Boolean(form.consent)

  if (!validDistrict) {
    scrollToSection('report-sec-1')
    return
  }
  if (!validDesc) {
    scrollToSection('report-sec-2')
    return
  }
  if (!validEmail || !validConsent) {
    scrollToSection('report-sec-4')
    return
  }

  referenceId.value = generateRefId()
  isSubmitted.value = true
  showValidationError.value = false
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function resetForm() {
  form.reporterRole = 'affected'
  form.date = ''
  form.time = ''
  form.ongoing = false
  form.district = ''
  form.locationDetail = ''
  form.areas = []
  form.description = ''
  form.racismTypes = []
  form.incidentTypes = []
  form.witnesses = 'unsure'
  form.impact = ''
  form.mode = 'counseling'
  form.name = ''
  form.email = ''
  form.phone = ''
  form.preferredLang = ''
  form.preferredContact = 'email'
  form.consent = false
  showValidationError.value = false
  isSubmitted.value = false
  openDropdown.value = null
}

function goHome() {
  store.clearActiveHref()
  router.push('/')
}

function buildPlainTextSummary() {
  const lines = [
    `advsh e. V. — Meldeformular (${referenceId.value})`,
    `================================================`,
    `Modus: ${form.mode === 'anonymous' ? 'Anonym' : 'Mit Beratungswunsch'}`,
    `Rolle: ${selectedRoleOption.value?.title || form.reporterRole}`,
    `Datum / Zeit: ${form.date || '-'} ${form.time || ''} ${form.ongoing ? '(Dauert an / Datum unbekannt)' : ''}`,
    `Kreis / Ort: ${form.district} ${form.locationDetail ? `(${form.locationDetail})` : ''}`,
    `Lebensbereiche: ${form.areas.length ? form.areas.join(', ') : '-'}`,
    `Formen von Rassismus / Diskriminierung: ${form.racismTypes.length ? form.racismTypes.join(', ') : '-'}`,
    `Art des Vorfalls: ${form.incidentTypes.length ? form.incidentTypes.join(', ') : '-'}`,
    `Zeug*innen / Beweise: ${selectedWitnessOption.value?.label || form.witnesses}`,
    ``,
    `Schilderung:`,
    form.description,
    ``,
    `Folgen / Weitere Hinweise:`,
    form.impact || '-',
  ]

  if (form.mode === 'counseling') {
    lines.push(
      ``,
      `Kontaktdaten für Beratung (BeAGGtiv / MRgD):`,
      `Name / Pseudonym: ${form.name || '-'}`,
      `E-Mail: ${form.email}`,
      `Telefon: ${form.phone || '-'}`,
      `Sprache: ${form.preferredLang || '-'}`,
      `Bevorzugter Kontaktweg: ${selectedContactOption.value?.label || form.preferredContact}`
    )
  }

  return lines.join('\n')
}

const mailtoHref = computed(() => {
  const subject = encodeURIComponent(`Vorfall melden [${referenceId.value}] – advsh`)
  const body = encodeURIComponent(buildPlainTextSummary())
  return `mailto:${contact.value.beaggtivEmail}?subject=${subject}&body=${body}`
})

function downloadReceipt() {
  const text = buildPlainTextSummary()
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${referenceId.value || 'advsh-meldung'}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
</script>

<template>
  <section class="report-page">
    <!-- Mobile Backdrop when any Bottom-Sheet Dropdown is open -->
    <div
      v-if="openDropdown"
      class="dd-backdrop"
      aria-hidden="true"
      @click="closeDropdown"
    ></div>

    <div class="shell">
      <div class="report-top-nav">
        <button type="button" class="back-btn" @click="goHome">
          <span class="back-arr" aria-hidden="true">←</span>
          <span>{{ r.backHome }}</span>
        </button>

        <!-- Mobile-friendly one-tap direct call pill right at the top -->
        <a class="quick-call-pill" :href="contact.beaggtivPhoneHref">
          <span class="call-dot" aria-hidden="true"></span>
          <span>{{ mobileUi.quickCall }}</span>
          <strong>{{ contact.beaggtivPhone }}</strong>
        </a>
      </div>

      <!-- Page Header -->
      <header class="report-hero">
        <SectionLabel class="report-kicker" :text="r.kicker" />
        <h1>
          <span>{{ r.titleLine1 }}</span>
          <em class="accent-word">{{ r.titleAccent }}</em>
        </h1>
        <p class="report-lede">{{ r.lede }}</p>

        <div class="trust-badges">
          <span v-for="(badge, i) in r.badges" :key="i" class="trust-badge">
            <span class="trust-dot" aria-hidden="true"></span>
            {{ badge }}
          </span>
        </div>
      </header>

      <!-- Confirmation View after Submit -->
      <div v-if="isSubmitted" class="success-card">
        <div class="success-header">
          <SectionLabel :text="r.success.kicker" light />
          <h2>{{ r.success.title }}</h2>
          <p>
            {{
              form.mode === 'anonymous'
                ? r.success.textAnonymous
                : r.success.textCounseling
            }}
          </p>
          <div class="ref-box">
            <span>{{ r.success.refLabel }}</span>
            <strong>{{ referenceId }}</strong>
          </div>
        </div>

        <div class="success-body">
          <h3>{{ r.success.summaryTitle }}</h3>
          <dl class="summary-grid">
            <div>
              <dt>{{ r.sections.districtLabel.replace(' *', '') }}</dt>
              <dd>{{ form.district }} <span v-if="form.locationDetail">· {{ form.locationDetail }}</span></dd>
            </div>
            <div v-if="form.date || form.ongoing">
              <dt>{{ r.sections.dateLabel }}</dt>
              <dd>{{ form.date || '—' }} <span v-if="form.time">({{ form.time }})</span></dd>
            </div>
            <div v-if="form.areas.length">
              <dt>{{ r.sections.s2Label }}</dt>
              <dd>{{ form.areas.join(', ') }}</dd>
            </div>
            <div v-if="form.racismTypes.length">
              <dt>{{ r.sections.s3Label }}</dt>
              <dd>{{ form.racismTypes.join(', ') }}</dd>
            </div>
            <div class="summary-full">
              <dt>{{ r.sections.descriptionLabel.replace(' *', '') }}</dt>
              <dd class="summary-desc">{{ form.description }}</dd>
            </div>
          </dl>

          <div class="success-actions">
            <a class="btn btn--primary" :href="mailtoHref">
              {{ r.success.sendMailBtn }}
              <span class="arr" aria-hidden="true">↗</span>
            </a>
            <button type="button" class="btn btn--outline" @click="downloadReceipt">
              {{ r.success.downloadBtn }}
            </button>
            <button type="button" class="btn btn--outline" @click="resetForm">
              {{ r.success.newReportBtn }}
            </button>
            <button type="button" class="btn-text-link" @click="goHome">
              ← {{ r.success.homeBtn }}
            </button>
          </div>
        </div>
      </div>

      <!-- Main Single-Page Form + Sticky Sidebar -->
      <div v-else class="report-layout">
        <div class="report-main-col">
          <!-- Helpful Sticky Step Jump & Progress Bar -->
          <nav class="step-progress-bar" aria-label="Form progress">
            <div class="step-pills">
              <button
                type="button"
                class="step-jump-pill"
                :class="{ 'is-done': sectionDone.s1 }"
                @click="scrollToSection('report-sec-1')"
              >
                <span class="step-check" aria-hidden="true">{{ sectionDone.s1 ? '✓' : '1' }}</span>
                <span>{{ mobileUi.stepTitles[0] }}</span>
              </button>
              <button
                type="button"
                class="step-jump-pill"
                :class="{ 'is-done': sectionDone.s2 }"
                @click="scrollToSection('report-sec-2')"
              >
                <span class="step-check" aria-hidden="true">{{ sectionDone.s2 ? '✓' : '2' }}</span>
                <span>{{ mobileUi.stepTitles[1] }}</span>
              </button>
              <button
                type="button"
                class="step-jump-pill"
                :class="{ 'is-done': sectionDone.s3 }"
                @click="scrollToSection('report-sec-3')"
              >
                <span class="step-check" aria-hidden="true">{{ sectionDone.s3 ? '✓' : '3' }}</span>
                <span>{{ mobileUi.stepTitles[2] }}</span>
              </button>
              <button
                type="button"
                class="step-jump-pill"
                :class="{ 'is-done': sectionDone.s4 }"
                @click="scrollToSection('report-sec-4')"
              >
                <span class="step-check" aria-hidden="true">{{ sectionDone.s4 ? '✓' : '4' }}</span>
                <span>{{ mobileUi.stepTitles[3] }}</span>
              </button>
            </div>
            <div class="progress-track" aria-hidden="true">
              <div class="progress-fill" :style="{ width: completionPercent + '%' }"></div>
            </div>
          </nav>

          <form class="report-form" novalidate @submit.prevent="handleSubmit">
            <!-- CARD 01: Role, Date & Location -->
            <article id="report-sec-1" class="form-card">
              <header class="form-card-head">
                <SectionLabel :text="r.sections.s1Label" />
                <h2>{{ r.sections.s1Title }}</h2>
              </header>

              <!-- Row 1: Reporter Role Dropdown + District Dropdown (Same Level!) -->
              <div class="field-row">
                <!-- Custom Single-Select Dropdown: Reporter Role -->
                <div class="field-group">
                  <label class="field-label">{{ r.sections.reporterLabel }}</label>
                  <div class="custom-dd" :class="{ 'is-open': openDropdown === 'role' }">
                    <button
                      type="button"
                      class="dd-trigger"
                      :aria-expanded="openDropdown === 'role'"
                      @click="toggleDropdown('role')"
                    >
                      <span class="dd-trigger-content">
                        <span class="dd-dot dd-dot--red" aria-hidden="true"></span>
                        <span class="dd-value">{{ selectedRoleOption.title }}</span>
                      </span>
                      <span class="dd-chevron" aria-hidden="true">▾</span>
                    </button>

                    <div v-if="openDropdown === 'role'" class="dd-menu" role="listbox">
                      <div class="dd-sheet-header">
                        <span class="dd-sheet-handle" aria-hidden="true"></span>
                        <strong>{{ r.sections.reporterLabel.replace(' *', '') }}</strong>
                        <button type="button" class="dd-sheet-close" @click="closeDropdown">✕</button>
                      </div>
                      <div class="dd-menu-body">
                        <button
                          v-for="opt in r.sections.reporterOptions"
                          :key="opt.id"
                          type="button"
                          class="dd-option dd-option--rich"
                          :class="{ 'is-selected': form.reporterRole === opt.id }"
                          @click="selectSingle('reporterRole', opt.id)"
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

                <!-- Custom Single-Select Dropdown: District / City -->
                <div class="field-group">
                  <label class="field-label">{{ r.sections.districtLabel }}</label>
                  <div class="custom-dd" :class="{ 'is-open': openDropdown === 'district' }">
                    <button
                      type="button"
                      class="dd-trigger"
                      :class="{ 'is-invalid': isDistrictInvalid, 'is-placeholder': !form.district }"
                      :aria-expanded="openDropdown === 'district'"
                      @click="toggleDropdown('district')"
                    >
                      <span class="dd-trigger-content">
                        <span class="dd-dot" aria-hidden="true"></span>
                        <span class="dd-value">
                          {{ form.district || r.sections.districtPlaceholder }}
                        </span>
                      </span>
                      <span class="dd-chevron" aria-hidden="true">▾</span>
                    </button>

                    <div v-if="openDropdown === 'district'" class="dd-menu dd-menu--scroll" role="listbox">
                      <div class="dd-sheet-header">
                        <span class="dd-sheet-handle" aria-hidden="true"></span>
                        <strong>{{ r.sections.districtLabel.replace(' *', '') }}</strong>
                        <button type="button" class="dd-sheet-close" @click="closeDropdown">✕</button>
                      </div>
                      <div class="dd-menu-body">
                        <button
                          v-for="dist in r.sections.districts"
                          :key="dist"
                          type="button"
                          class="dd-option"
                          :class="{ 'is-selected': form.district === dist }"
                          @click="selectSingle('district', dist)"
                        >
                          <span class="dd-radio" aria-hidden="true"></span>
                          <span class="dd-opt-label">{{ dist }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Row 2: Date & Time (50% / 50% on the exact same level!) -->
              <div class="field-row field-row--top-gap">
                <div class="field-group">
                  <div class="field-label field-label--with-helpers">
                    <label for="incident-date">{{ r.sections.dateLabel }}</label>
                    <span class="quick-date-pills">
                      <button
                        type="button"
                        class="mini-pill"
                        :class="{ 'is-active': form.date === todayIso && !form.ongoing }"
                        @click="setQuickDate('today')"
                      >
                        {{ mobileUi.today }}
                      </button>
                      <button
                        type="button"
                        class="mini-pill"
                        :class="{ 'is-active': form.date === yesterdayIso && !form.ongoing }"
                        @click="setQuickDate('yesterday')"
                      >
                        {{ mobileUi.yesterday }}
                      </button>
                    </span>
                  </div>
                  <input
                    id="incident-date"
                    v-model="form.date"
                    type="date"
                    class="text-input"
                    :disabled="form.ongoing"
                  />
                </div>

                <div class="field-group">
                  <label class="field-label" for="incident-time">{{ r.sections.timeLabel }}</label>
                  <input
                    id="incident-time"
                    v-model="form.time"
                    type="text"
                    class="text-input"
                    :placeholder="r.sections.timePlaceholder"
                  />
                </div>
              </div>

              <!-- Row 3: Specific Place / Neighbourhood / Institution -->
              <div class="field-group field-row--top-gap">
                <label class="field-label" for="incident-location-detail">
                  {{ r.sections.locationDetailLabel }}
                </label>
                <input
                  id="incident-location-detail"
                  v-model="form.locationDetail"
                  type="text"
                  class="text-input"
                  :placeholder="r.sections.locationDetailPlaceholder"
                />
              </div>

              <label class="checkbox-row">
                <input v-model="form.ongoing" type="checkbox" />
                <span>{{ r.sections.ongoingLabel }}</span>
              </label>
            </article>

            <!-- CARD 02: Area of Life Dropdown & Guided Incident Description -->
            <article id="report-sec-2" class="form-card">
              <header class="form-card-head">
                <SectionLabel :text="r.sections.s2Label" />
                <h2>{{ r.sections.s2Title }}</h2>
              </header>

              <div class="field-group">
                <label class="field-label">{{ r.sections.areaLabel }}</label>
                <div class="custom-dd" :class="{ 'is-open': openDropdown === 'areas' }">
                  <button
                    type="button"
                    class="dd-trigger"
                    :class="{ 'is-placeholder': !form.areas.length }"
                    :aria-expanded="openDropdown === 'areas'"
                    @click="toggleDropdown('areas')"
                  >
                    <span class="dd-trigger-content">
                      <span class="dd-dot" aria-hidden="true"></span>
                      <span class="dd-value">
                        {{ formatMultiSummary(form.areas, r.sections.areas.slice(0, 3).join(', ') + ' …') }}
                      </span>
                    </span>
                    <span class="dd-right">
                      <span v-if="form.areas.length" class="dd-count-badge">{{ form.areas.length }}</span>
                      <span class="dd-chevron" aria-hidden="true">▾</span>
                    </span>
                  </button>

                  <div v-if="openDropdown === 'areas'" class="dd-menu dd-menu--grid" role="group">
                    <div class="dd-sheet-header">
                      <span class="dd-sheet-handle" aria-hidden="true"></span>
                      <strong>{{ r.sections.s2Label }}</strong>
                      <button type="button" class="dd-sheet-close" @click="closeDropdown">✕</button>
                    </div>
                    <div class="dd-menu-body dd-menu-body--grid">
                      <button
                        v-for="area in r.sections.areas"
                        :key="area"
                        type="button"
                        class="dd-option"
                        :class="{ 'is-selected': form.areas.includes(area) }"
                        @click="toggleArrayItem(form.areas, area)"
                      >
                        <span class="dd-check" aria-hidden="true">✓</span>
                        <span class="dd-opt-label">{{ area }}</span>
                      </button>
                    </div>
                    <div class="dd-menu-footer">
                      <button
                        v-if="form.areas.length"
                        type="button"
                        class="dd-clear-btn"
                        @click="clearArray(form.areas)"
                      >
                        {{ mobileUi.clear }}
                      </button>
                      <button type="button" class="dd-done-btn" @click="closeDropdown">
                        {{ mobileUi.done }} ({{ form.areas.length }})
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Selected tags preview -->
                <div v-if="form.areas.length" class="selected-tags">
                  <span v-for="area in form.areas" :key="area" class="selected-tag">
                    {{ area }}
                    <button type="button" aria-label="Remove" @click="toggleArrayItem(form.areas, area)">×</button>
                  </span>
                </div>
              </div>

              <div class="field-group field-row--top-gap">
                <label class="field-label" for="incident-description">
                  {{ r.sections.descriptionLabel }}
                </label>
                <p class="field-hint">{{ r.sections.descriptionHint }}</p>

                <textarea
                  id="incident-description"
                  ref="descriptionInputRef"
                  v-model="form.description"
                  rows="6"
                  class="text-input textarea-input"
                  :class="{ 'is-invalid': isDescriptionInvalid }"
                  :placeholder="r.sections.descriptionPlaceholder"
                  required
                ></textarea>
              </div>
            </article>

            <!-- CARD 03: Classification & Background (Multi-Select Dropdowns on Same Level!) -->
            <article id="report-sec-3" class="form-card">
              <header class="form-card-head">
                <SectionLabel :text="r.sections.s3Label" />
                <h2>{{ r.sections.s3Title }}</h2>
              </header>

              <!-- Row 1: Forms of Racism Dropdown + Type of Incident Dropdown (Same Level!) -->
              <div class="field-row">
                <!-- Multi-Select Dropdown: Forms of Racism / Discrimination -->
                <div class="field-group">
                  <label class="field-label">{{ r.sections.racismTypesLabel }}</label>
                  <div class="custom-dd" :class="{ 'is-open': openDropdown === 'racism' }">
                    <button
                      type="button"
                      class="dd-trigger"
                      :class="{ 'is-placeholder': !form.racismTypes.length }"
                      :aria-expanded="openDropdown === 'racism'"
                      @click="toggleDropdown('racism')"
                    >
                      <span class="dd-trigger-content">
                        <span class="dd-dot" aria-hidden="true"></span>
                        <span class="dd-value">
                          {{ formatMultiSummary(form.racismTypes, r.sections.racismTypes[0] + ' …') }}
                        </span>
                      </span>
                      <span class="dd-right">
                        <span v-if="form.racismTypes.length" class="dd-count-badge">
                          {{ form.racismTypes.length }}
                        </span>
                        <span class="dd-chevron" aria-hidden="true">▾</span>
                      </span>
                    </button>

                    <div v-if="openDropdown === 'racism'" class="dd-menu dd-menu--scroll" role="group">
                      <div class="dd-sheet-header">
                        <span class="dd-sheet-handle" aria-hidden="true"></span>
                        <strong>{{ r.sections.racismTypesLabel }}</strong>
                        <button type="button" class="dd-sheet-close" @click="closeDropdown">✕</button>
                      </div>
                      <div class="dd-menu-body">
                        <button
                          v-for="rtype in r.sections.racismTypes"
                          :key="rtype"
                          type="button"
                          class="dd-option"
                          :class="{ 'is-selected': form.racismTypes.includes(rtype) }"
                          @click="toggleArrayItem(form.racismTypes, rtype)"
                        >
                          <span class="dd-check" aria-hidden="true">✓</span>
                          <span class="dd-opt-label">{{ rtype }}</span>
                        </button>
                      </div>
                      <div class="dd-menu-footer">
                        <button
                          v-if="form.racismTypes.length"
                          type="button"
                          class="dd-clear-btn"
                          @click="clearArray(form.racismTypes)"
                        >
                          {{ mobileUi.clear }}
                        </button>
                        <button type="button" class="dd-done-btn" @click="closeDropdown">
                          {{ mobileUi.done }} ({{ form.racismTypes.length }})
                        </button>
                      </div>
                    </div>
                  </div>

                  <div v-if="form.racismTypes.length" class="selected-tags">
                    <span v-for="rt in form.racismTypes" :key="rt" class="selected-tag">
                      {{ rt }}
                      <button type="button" aria-label="Remove" @click="toggleArrayItem(form.racismTypes, rt)">×</button>
                    </span>
                  </div>
                </div>

                <!-- Multi-Select Dropdown: Type of Incident -->
                <div class="field-group">
                  <label class="field-label">{{ r.sections.incidentTypesLabel }}</label>
                  <div class="custom-dd" :class="{ 'is-open': openDropdown === 'incident' }">
                    <button
                      type="button"
                      class="dd-trigger"
                      :class="{ 'is-placeholder': !form.incidentTypes.length }"
                      :aria-expanded="openDropdown === 'incident'"
                      @click="toggleDropdown('incident')"
                    >
                      <span class="dd-trigger-content">
                        <span class="dd-dot dd-dot--red" aria-hidden="true"></span>
                        <span class="dd-value">
                          {{ formatMultiSummary(form.incidentTypes, r.sections.incidentTypes[0] + ' …') }}
                        </span>
                      </span>
                      <span class="dd-right">
                        <span v-if="form.incidentTypes.length" class="dd-count-badge dd-count-badge--red">
                          {{ form.incidentTypes.length }}
                        </span>
                        <span class="dd-chevron" aria-hidden="true">▾</span>
                      </span>
                    </button>

                    <div v-if="openDropdown === 'incident'" class="dd-menu dd-menu--scroll" role="group">
                      <div class="dd-sheet-header">
                        <span class="dd-sheet-handle" aria-hidden="true"></span>
                        <strong>{{ r.sections.incidentTypesLabel }}</strong>
                        <button type="button" class="dd-sheet-close" @click="closeDropdown">✕</button>
                      </div>
                      <div class="dd-menu-body">
                        <button
                          v-for="itype in r.sections.incidentTypes"
                          :key="itype"
                          type="button"
                          class="dd-option dd-option--red"
                          :class="{ 'is-selected': form.incidentTypes.includes(itype) }"
                          @click="toggleArrayItem(form.incidentTypes, itype)"
                        >
                          <span class="dd-check" aria-hidden="true">✓</span>
                          <span class="dd-opt-label">{{ itype }}</span>
                        </button>
                      </div>
                      <div class="dd-menu-footer">
                        <button
                          v-if="form.incidentTypes.length"
                          type="button"
                          class="dd-clear-btn"
                          @click="clearArray(form.incidentTypes)"
                        >
                          {{ mobileUi.clear }}
                        </button>
                        <button type="button" class="dd-done-btn" @click="closeDropdown">
                          {{ mobileUi.done }} ({{ form.incidentTypes.length }})
                        </button>
                      </div>
                    </div>
                  </div>

                  <div v-if="form.incidentTypes.length" class="selected-tags">
                    <span
                      v-for="it in form.incidentTypes"
                      :key="it"
                      class="selected-tag selected-tag--red"
                    >
                      {{ it }}
                      <button type="button" aria-label="Remove" @click="toggleArrayItem(form.incidentTypes, it)">×</button>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Row 2: Witnesses Dropdown + Impact Input (Same Level!) -->
              <div class="field-row field-row--top-gap">
                <div class="field-group">
                  <label class="field-label">{{ r.sections.witnessesLabel }}</label>
                  <div class="custom-dd" :class="{ 'is-open': openDropdown === 'witnesses' }">
                    <button
                      type="button"
                      class="dd-trigger"
                      :aria-expanded="openDropdown === 'witnesses'"
                      @click="toggleDropdown('witnesses')"
                    >
                      <span class="dd-trigger-content">
                        <span class="dd-dot" aria-hidden="true"></span>
                        <span class="dd-value">{{ selectedWitnessOption.label }}</span>
                      </span>
                      <span class="dd-chevron" aria-hidden="true">▾</span>
                    </button>

                    <div v-if="openDropdown === 'witnesses'" class="dd-menu" role="listbox">
                      <div class="dd-sheet-header">
                        <span class="dd-sheet-handle" aria-hidden="true"></span>
                        <strong>{{ r.sections.witnessesLabel }}</strong>
                        <button type="button" class="dd-sheet-close" @click="closeDropdown">✕</button>
                      </div>
                      <div class="dd-menu-body">
                        <button
                          v-for="wOpt in r.sections.witnessOptions"
                          :key="wOpt.id"
                          type="button"
                          class="dd-option"
                          :class="{ 'is-selected': form.witnesses === wOpt.id }"
                          @click="selectSingle('witnesses', wOpt.id)"
                        >
                          <span class="dd-radio" aria-hidden="true"></span>
                          <span class="dd-opt-label">{{ wOpt.label }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="field-group">
                  <label class="field-label" for="incident-impact">
                    {{ r.sections.impactLabel }}
                  </label>
                  <input
                    id="incident-impact"
                    v-model="form.impact"
                    type="text"
                    class="text-input"
                    :placeholder="r.sections.impactPlaceholder"
                  />
                </div>
              </div>
            </article>

            <!-- CARD 04: Anonymity vs. Counseling & Submit -->
            <article id="report-sec-4" class="form-card form-card--highlight">
              <header class="form-card-head">
                <SectionLabel :text="r.sections.s4Label" />
                <h2>{{ r.sections.s4Title }}</h2>
              </header>

              <div class="mode-grid">
                <label
                  v-for="mOpt in r.sections.modeOptions"
                  :key="mOpt.id"
                  class="mode-card"
                  :class="{ 'is-active': form.mode === mOpt.id }"
                >
                  <input
                    v-model="form.mode"
                    type="radio"
                    name="reportMode"
                    :value="mOpt.id"
                    class="sr-only"
                  />
                  <div class="mode-top">
                    <span class="mode-badge">{{ mOpt.badge }}</span>
                    <span class="role-check" aria-hidden="true"></span>
                  </div>
                  <strong>{{ mOpt.title }}</strong>
                  <p>{{ mOpt.desc }}</p>
                </label>
              </div>

              <!-- Conditional Contact Fields when Counseling is chosen -->
              <div v-if="form.mode === 'counseling'" class="contact-fields-box">
                <div class="field-row">
                  <div class="field-group">
                    <label class="field-label" for="reporter-name">{{ r.sections.nameLabel }}</label>
                    <input
                      id="reporter-name"
                      v-model="form.name"
                      type="text"
                      autocomplete="name"
                      class="text-input"
                      :placeholder="r.sections.namePlaceholder"
                    />
                  </div>
                  <div class="field-group">
                    <label class="field-label" for="reporter-email">{{ r.sections.emailLabel }}</label>
                    <input
                      id="reporter-email"
                      v-model="form.email"
                      type="email"
                      inputmode="email"
                      autocomplete="email"
                      class="text-input"
                      :class="{ 'is-invalid': isEmailInvalid }"
                      :placeholder="r.sections.emailPlaceholder"
                      required
                    />
                  </div>
                </div>

                <div class="field-row field-row--top-gap">
                  <div class="field-group">
                    <label class="field-label" for="reporter-phone">{{ r.sections.phoneLabel }}</label>
                    <input
                      id="reporter-phone"
                      v-model="form.phone"
                      type="tel"
                      inputmode="tel"
                      autocomplete="tel"
                      class="text-input"
                      :placeholder="r.sections.phonePlaceholder"
                    />
                  </div>
                  <div class="field-group">
                    <label class="field-label" for="reporter-lang">
                      {{ r.sections.preferredLangLabel }}
                    </label>
                    <input
                      id="reporter-lang"
                      v-model="form.preferredLang"
                      type="text"
                      class="text-input"
                      :placeholder="r.sections.preferredLangPlaceholder"
                    />
                  </div>
                </div>

                <div class="field-group field-row--top-gap">
                  <label class="field-label">{{ r.sections.preferredContactLabel }}</label>
                  <div class="custom-dd" :class="{ 'is-open': openDropdown === 'contact' }">
                    <button
                      type="button"
                      class="dd-trigger"
                      :aria-expanded="openDropdown === 'contact'"
                      @click="toggleDropdown('contact')"
                    >
                      <span class="dd-trigger-content">
                        <span class="dd-dot" aria-hidden="true"></span>
                        <span class="dd-value">{{ selectedContactOption.label }}</span>
                      </span>
                      <span class="dd-chevron" aria-hidden="true">▾</span>
                    </button>

                    <div v-if="openDropdown === 'contact'" class="dd-menu" role="listbox">
                      <div class="dd-sheet-header">
                        <span class="dd-sheet-handle" aria-hidden="true"></span>
                        <strong>{{ r.sections.preferredContactLabel }}</strong>
                        <button type="button" class="dd-sheet-close" @click="closeDropdown">✕</button>
                      </div>
                      <div class="dd-menu-body">
                        <button
                          v-for="cOpt in r.sections.preferredContactOptions"
                          :key="cOpt.id"
                          type="button"
                          class="dd-option"
                          :class="{ 'is-selected': form.preferredContact === cOpt.id }"
                          @click="selectSingle('preferredContact', cOpt.id)"
                        >
                          <span class="dd-radio" aria-hidden="true"></span>
                          <span class="dd-opt-label">{{ cOpt.label }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Privacy Consent -->
              <div class="consent-box" :class="{ 'is-invalid': isConsentInvalid }">
                <label class="checkbox-row checkbox-row--consent">
                  <input v-model="form.consent" type="checkbox" required />
                  <span>
                    {{ r.sections.consentLabel }}
                    <a
                      href="https://advsh.de/datenschutzerklaerung/"
                      target="_blank"
                      rel="noopener"
                      class="privacy-link"
                    >
                      {{ r.sections.privacyLinkText }} ↗
                    </a>
                  </span>
                </label>
              </div>

              <p
                v-if="showValidationError && (isDistrictInvalid || isDescriptionInvalid || isEmailInvalid || isConsentInvalid)"
                class="validation-banner"
                role="alert"
              >
                {{ r.sections.validationError }}
              </p>

              <div class="submit-bar">
                <div class="submit-actions">
                  <button type="submit" class="btn btn--submit">
                    {{ r.sections.submitBtn }}
                    <span class="arr" aria-hidden="true">↗</span>
                  </button>
                  <button type="button" class="btn btn--outline" @click="resetForm">
                    {{ r.sections.resetBtn }}
                  </button>
                </div>
                <small class="required-note">{{ r.sections.requiredNote }}</small>
              </div>
            </article>
          </form>
        </div>

        <!-- RIGHT SIDEBAR -->
        <aside class="report-sidebar">
          <div class="sidebar-card sidebar-card--blue">
            <SectionLabel :text="r.sidebar.directLabel" light />
            <h3>{{ r.sidebar.directTitle }}</h3>
            <p>{{ r.sidebar.directText }}</p>

            <div class="sidebar-contacts">
              <div class="sidebar-contact-item">
                <span>{{ r.sidebar.phoneLabel }}</span>
                <a :href="contact.beaggtivPhoneHref">{{ contact.beaggtivPhone }}</a>
              </div>
              <div class="sidebar-contact-item">
                <span>{{ r.sidebar.emailLabel }}</span>
                <a :href="contact.beaggtivEmailHref">{{ contact.beaggtivEmail }}</a>
              </div>
            </div>

            <small class="sidebar-hours">{{ r.sidebar.hours }}</small>
          </div>

          <div class="sidebar-card sidebar-card--paper">
            <h3>{{ r.sidebar.processTitle }}</h3>
            <ol class="process-list">
              <li v-for="step in r.sidebar.processSteps" :key="step.num">
                <span class="process-num">{{ step.num }}</span>
                <div>
                  <strong>{{ step.title }}</strong>
                  <p>{{ step.text }}</p>
                </div>
              </li>
            </ol>
          </div>

          <div class="sidebar-card sidebar-card--yellow">
            <div class="emergency-head">
              <span class="emergency-icon" aria-hidden="true">✳</span>
              <h3>{{ r.sidebar.emergencyTitle }}</h3>
            </div>
            <p>{{ r.sidebar.emergencyText }}</p>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.report-page {
  position: relative;
  overflow-x: clip;
  padding: clamp(24px, 4.5vw, 56px) 0 clamp(76px, 9vw, 118px);
}

.report-page *,
.report-page *::before,
.report-page *::after {
  box-sizing: border-box;
}

.report-page::before {
  content: "";
  position: absolute;
  top: -140px;
  right: -120px;
  width: 480px;
  height: 480px;
  border: 1px solid var(--line);
  border-radius: 50%;
  pointer-events: none;
}

.report-top-nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
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
[dir="rtl"] .back-btn:hover {
  transform: translateX(2px);
}

.quick-call-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  border-radius: 999px;
  background: var(--logo-blue);
  color: var(--text-on-dark);
  font-size: 12.5px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 12px 24px -14px var(--logo-blue-shadow);
}
.quick-call-pill strong {
  font-weight: 800;
  text-decoration: underline;
  text-underline-offset: 3px;
}
.quick-call-pill:hover strong {
  color: var(--text-on-dark);
}
.call-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--yellow);
  flex-shrink: 0;
}

.report-hero {
  max-width: 820px;
  margin-bottom: clamp(28px, 4.5vw, 46px);
}

.report-kicker {
  margin-bottom: 16px;
}

.report-hero h1 {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: .24em;
  font-family: var(--display);
  font-size: clamp(2.6rem, 5vw, 4.75rem);
  font-weight: 500;
  line-height: .95;
  letter-spacing: -.045em;
}

.report-hero h1 em.accent-word {
  position: relative;
  font-style: italic;
  font-weight: 400;
  color: var(--logo-red);
}

.report-hero h1 em.accent-word::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: .04em;
  left: 0;
  height: .05em;
  background: var(--logo-blue);
  z-index: -1;
}

.report-lede {
  max-width: 64ch;
  margin-top: 20px;
  color: var(--muted);
  font-size: 17px;
  line-height: 1.65;
}

.trust-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}

.trust-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: var(--paper);
  font-size: 12.5px;
  font-weight: 700;
  color: var(--ink);
}

.trust-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--logo-red);
  box-shadow: 0 0 0 3px var(--logo-red-glow);
}

/* Sticky Step Jump & Progress Bar */
.step-progress-bar {
  position: sticky;
  top: 86px;
  z-index: 35;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  margin-bottom: 22px;
  padding: 12px 16px 10px;
  border: 1px solid var(--line-strong);
  border-radius: 18px;
  background: var(--paper-glass);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 14px 28px -20px rgba(16, 32, 31, .2);
}

.step-pills {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.step-jump-pill {
  display: flex;
  align-items: center;
  gap: 7px;
  width: 100%;
  min-width: 0;
  padding: 7px 10px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: var(--white);
  color: var(--muted);
  font-family: var(--sans);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: border-color .2s, background .2s, color .2s;
}

.step-jump-pill > span:last-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.step-jump-pill:hover {
  border-color: var(--logo-blue);
  color: var(--ink);
}

.step-jump-pill.is-done {
  border-color: var(--logo-blue);
  background: rgba(8, 47, 119, .06);
  color: var(--logo-blue);
}

.step-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--cream);
  color: var(--ink);
  font-size: 11px;
  font-weight: 800;
  flex-shrink: 0;
}

.step-jump-pill.is-done .step-check {
  background: var(--logo-blue);
  color: var(--white);
}

.progress-track {
  height: 4px;
  margin-top: 10px;
  border-radius: 999px;
  background: var(--line);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--logo-blue), var(--logo-red));
  transition: width .35s ease;
}

/* Layout Grid */
.report-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(300px, .85fr);
  gap: clamp(28px, 4vw, 48px);
  align-items: start;
  width: 100%;
  max-width: 100%;
}

.report-main-col {
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.report-form {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 26px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.form-card {
  scroll-margin-top: 165px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  padding: clamp(22px, 3.8vw, 40px);
  border: 1px solid var(--line);
  border-radius: 26px;
  background: var(--paper);
  box-shadow: 0 22px 44px -34px rgba(16, 32, 31, .18);
}

.form-card--highlight {
  border-color: var(--line-strong);
  background: linear-gradient(180deg, var(--paper) 0%, #f7f2e6 100%);
}

.form-card-head {
  padding-bottom: 20px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--line);
}

.form-card-head h2 {
  margin-top: 10px;
  font-family: var(--display);
  font-size: clamp(1.45rem, 2.4vw, 2.05rem);
  font-weight: 500;
  line-height: 1.12;
  letter-spacing: -.03em;
}

/* Field Rows & Strict Same-Level Alignment */
.field-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  align-items: start;
  width: 100%;
  max-width: 100%;
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
  max-width: 100%;
  min-width: 0;
}

/* Lock label height in side-by-side rows so inputs/dropdowns always sit on the exact same horizontal level */
.field-row > .field-group > .field-label {
  min-height: 44px;
  display: flex;
  align-items: flex-end;
  line-height: 1.3;
}

.field-label {
  font-size: 13.5px;
  font-weight: 750;
  color: var(--ink);
}

.field-label--with-helpers {
  justify-content: space-between;
  align-items: flex-end;
  gap: 8px;
  flex-wrap: nowrap;
}

.quick-date-pills {
  display: inline-flex;
  gap: 5px;
}

.mini-pill {
  padding: 3px 9px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: var(--cream);
  color: var(--ink);
  font-family: var(--sans);
  font-size: 11px;
  font-weight: 750;
  cursor: pointer;
  transition: background .15s, color .15s, border-color .15s;
}
.mini-pill:hover,
.mini-pill.is-active {
  background: var(--logo-blue);
  border-color: var(--logo-blue);
  color: var(--text-on-dark);
}

.field-hint {
  margin-top: -2px;
  color: var(--muted);
  font-size: 13.5px;
  line-height: 1.55;
}

/* Prompt Helper Box for Mobile Description Writing */
.prompt-helper-box {
  padding: 12px 14px;
  border: 1px dashed var(--line-strong);
  border-radius: 14px;
  background: rgba(244, 239, 228, .65);
}

.prompt-helper-label {
  display: block;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--muted);
}

.prompt-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.prompt-pill {
  padding: 7px 12px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: var(--white);
  color: var(--logo-blue);
  font-family: var(--sans);
  font-size: 12.5px;
  font-weight: 750;
  cursor: pointer;
  transition: background .15s, color .15s, border-color .15s, transform .15s;
}

.prompt-pill:hover {
  background: var(--logo-blue);
  border-color: var(--logo-blue);
  color: var(--text-on-dark);
}

.prompt-pill:active {
  transform: scale(.97);
}

/* Uniform 52px height & 16px font on mobile to prevent iOS Safari zoom */
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
  transition: border-color .2s, box-shadow .2s, background .2s;
}

input.text-input {
  display: block;
}

input[type="date"].text-input {
  -webkit-appearance: none;
  appearance: none;
  min-width: 0;
  max-width: 100%;
}

.text-input:focus,
.custom-dd.is-open .dd-trigger,
.dd-trigger:focus-visible {
  outline: none;
  border-color: var(--logo-blue);
  box-shadow: 0 0 0 3px var(--logo-blue-soft);
}

.text-input:disabled {
  opacity: .55;
  cursor: not-allowed;
  background: var(--cream);
}

.text-input.is-invalid,
.dd-trigger.is-invalid {
  border-color: var(--logo-red);
  box-shadow: 0 0 0 3px rgba(219, 42, 38, .12);
}

.textarea-input {
  display: block;
  height: auto;
  padding: 14px 16px;
  resize: vertical;
  min-height: 140px;
  overflow: auto;
}

/* Awesome Custom Dropdown Component (Popover on Desktop, Bottom Sheet on Mobile) */
.dd-backdrop {
  display: none;
}

.custom-dd {
  position: relative;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.dd-trigger {
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
  text-align: left;
  font-weight: 650;
}

[dir="rtl"] .dd-trigger {
  text-align: right;
}

.dd-trigger:hover {
  border-color: var(--logo-blue);
}

.dd-trigger.is-placeholder .dd-value {
  color: var(--muted);
  font-weight: 500;
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

.dd-right {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.dd-count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  border-radius: 999px;
  background: var(--logo-blue);
  color: var(--text-on-dark);
  font-size: 11.5px;
  font-weight: 800;
}

.dd-count-badge--red {
  background: var(--logo-red);
}

.dd-chevron {
  font-size: 14px;
  color: var(--muted);
  transition: transform .22s ease, color .22s ease;
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
  display: flex;
  flex-direction: column;
  padding: 8px;
  border: 1.5px solid var(--line-strong);
  border-radius: 18px;
  background: var(--white);
  box-shadow: 0 26px 52px -20px rgba(16, 32, 31, .32);
  animation: ddFadeIn .16s cubic-bezier(.22, 1, .36, 1);
}

.dd-menu-body {
  display: grid;
  gap: 4px;
}

.dd-menu--scroll .dd-menu-body {
  max-height: 270px;
  overflow-y: auto;
}

.dd-menu-body--grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.dd-menu-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--line);
}

.dd-clear-btn {
  margin-right: auto;
  padding: 8px 12px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--muted);
  font-family: var(--sans);
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
}
.dd-clear-btn:hover {
  color: var(--logo-red);
  background: rgba(219, 42, 38, .06);
}

.dd-done-btn {
  padding: 9px 18px;
  border: none;
  border-radius: 999px;
  background: var(--logo-blue);
  color: var(--text-on-dark);
  font-family: var(--sans);
  font-size: 13px;
  font-weight: 750;
  cursor: pointer;
}

@keyframes ddFadeIn {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  transition: background .15s, color .15s;
}

[dir="rtl"] .dd-option {
  text-align: right;
}

.dd-option:hover {
  background: var(--cream);
}

.dd-option.is-selected {
  background: rgba(8, 47, 119, .08);
  color: var(--logo-blue);
  font-weight: 750;
}

.dd-option--red.is-selected {
  background: rgba(219, 42, 38, .08);
  color: var(--logo-red);
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

.dd-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 1.5px solid var(--line-strong);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 900;
  color: transparent;
  flex-shrink: 0;
  transition: background .15s, border-color .15s, color .15s;
}

.dd-option.is-selected .dd-check {
  background: var(--logo-blue);
  border-color: var(--logo-blue);
  color: var(--white);
}

.dd-option--red.is-selected .dd-check {
  background: var(--logo-red);
  border-color: var(--logo-red);
  color: var(--white);
}

/* Selected Removable Tags below Multi-Select Dropdown */
.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 4px;
}

.selected-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(8, 47, 119, .09);
  color: var(--logo-blue);
  font-size: 12.5px;
  font-weight: 700;
}

.selected-tag--red {
  background: rgba(219, 42, 38, .1);
  color: var(--logo-red);
}

.selected-tag button {
  border: none;
  background: none;
  color: inherit;
  font-size: 15px;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;
  padding: 0 2px;
  opacity: .75;
}

.selected-tag button:hover {
  opacity: 1;
}

/* Checkboxes */
.checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  margin-top: 16px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--ink-soft);
  cursor: pointer;
}

.checkbox-row > span {
  min-width: 0;
  flex: 1;
  overflow-wrap: break-word;
}

.checkbox-row input[type="checkbox"] {
  width: 20px;
  height: 20px;
  margin-top: 1px;
  accent-color: var(--logo-red);
  flex-shrink: 0;
  cursor: pointer;
}

/* Mode Cards (Step 04) */
.mode-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

.mode-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  padding: 20px;
  border: 1.5px solid var(--line-strong);
  border-radius: 18px;
  background: var(--white);
  cursor: pointer;
  transition: border-color .2s, background .2s, box-shadow .2s;
}

.mode-card.is-active {
  border-color: var(--logo-blue);
  background: rgba(8, 47, 119, .05);
  box-shadow: 0 16px 32px -22px var(--logo-blue-shadow);
}

.mode-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.mode-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--cream);
  color: var(--logo-blue);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.role-check {
  width: 18px;
  height: 18px;
  border: 2px solid var(--line-strong);
  border-radius: 50%;
  position: relative;
  transition: border-color .2s, background .2s;
}

.mode-card.is-active .role-check {
  border-color: var(--logo-red);
  background: var(--logo-red);
}

.mode-card.is-active .role-check::after {
  content: "";
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  background: var(--white);
}

.mode-card strong {
  font-family: var(--display);
  font-size: 19px;
  font-weight: 550;
  line-height: 1.2;
}

.mode-card p {
  color: var(--muted);
  font-size: 13.5px;
  line-height: 1.55;
}

.contact-fields-box {
  margin-top: 22px;
  padding: 22px;
  border: 1px solid var(--line-strong);
  border-radius: 18px;
  background: var(--white);
}

.consent-box {
  margin-top: 22px;
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

.btn--submit {
  min-height: 54px;
  padding: 15px 28px;
  background: var(--logo-red);
  color: var(--text-on-dark);
  border: none;
  cursor: pointer;
  font-family: var(--sans);
  font-size: 15px;
}
.btn--submit:hover {
  background: var(--logo-red-hover);
  transform: translateY(-2px);
  box-shadow: 0 18px 34px -18px var(--logo-red-shadow);
}

.required-note {
  color: var(--muted);
  font-size: 12.5px;
  font-weight: 600;
}

/* Sticky Sidebar */
.report-sidebar {
  position: sticky;
  top: 108px;
  display: grid;
  gap: 20px;
}

.sidebar-card {
  padding: 28px;
  border-radius: 24px;
  border: 1px solid var(--line);
}

.sidebar-card--blue {
  background: var(--logo-blue);
  color: var(--text-on-dark);
  border-color: transparent;
  box-shadow: 0 28px 54px -34px var(--logo-blue-shadow);
}

.sidebar-card--blue h3 {
  margin-top: 12px;
  font-family: var(--display);
  font-size: 24px;
  font-weight: 500;
  line-height: 1.15;
  color: var(--text-on-dark);
}

.sidebar-card--blue p {
  margin-top: 10px;
  color: var(--text-on-dark-soft);
  font-size: 14.5px;
  line-height: 1.6;
}

.sidebar-contacts {
  display: grid;
  gap: 14px;
  margin-top: 20px;
  padding: 16px 0;
  border-top: 1px solid var(--line-on-dark);
  border-bottom: 1px solid var(--line-on-dark);
}

.sidebar-contact-item span {
  display: block;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--text-on-dark-muted);
}

.sidebar-contact-item a {
  display: inline-block;
  margin-top: 3px;
  font-family: var(--display);
  font-size: 19px;
  font-weight: 500;
  color: var(--text-on-dark);
  text-decoration: none;
}

.sidebar-contact-item a:hover {
  color: var(--text-on-dark);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.sidebar-hours {
  display: block;
  margin-top: 14px;
  color: var(--text-on-dark-muted);
  font-size: 12.5px;
}

.sidebar-card--paper {
  background: var(--paper);
}

.sidebar-card--paper h3 {
  font-family: var(--display);
  font-size: 21px;
  font-weight: 550;
  line-height: 1.2;
}

.process-list {
  list-style: none;
  display: grid;
  gap: 16px;
  margin-top: 18px;
}

.process-list li {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
}

.process-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--cream);
  color: var(--logo-red);
  font-family: var(--display);
  font-size: 13px;
  font-weight: 700;
}

.process-list strong {
  display: block;
  font-size: 14.5px;
  font-weight: 750;
}

.process-list p {
  margin-top: 3px;
  color: var(--muted);
  font-size: 13.5px;
  line-height: 1.5;
}

.sidebar-card--yellow {
  background: var(--yellow);
  color: var(--ink);
  border-color: transparent;
}

.emergency-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.emergency-icon {
  color: var(--logo-red);
  font-size: 20px;
  line-height: 1;
}

.sidebar-card--yellow h3 {
  font-family: var(--display);
  font-size: 20px;
  font-weight: 600;
}

.sidebar-card--yellow p {
  margin-top: 8px;
  font-size: 13.5px;
  line-height: 1.55;
  color: rgba(16, 32, 31, .86);
}

/* Confirmation / Success Card */
.success-card {
  overflow: hidden;
  border-radius: 28px;
  border: 1px solid var(--line);
  background: var(--paper);
  box-shadow: 0 32px 64px -38px rgba(16, 32, 31, .28);
}

.success-header {
  padding: clamp(32px, 5vw, 52px);
  background: var(--logo-blue);
  color: var(--text-on-dark);
}

.success-header h2 {
  margin-top: 12px;
  font-family: var(--display);
  font-size: clamp(2rem, 3.6vw, 3rem);
  font-weight: 500;
  color: var(--text-on-dark);
}

.success-header p {
  max-width: 60ch;
  margin-top: 12px;
  color: var(--text-on-dark-soft);
  font-size: 16.5px;
  line-height: 1.65;
}

.ref-box {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 24px;
  padding: 14px 22px;
  border-radius: 16px;
  background: rgba(255, 255, 255, .1);
  border: 1px solid var(--line-on-dark);
}

.ref-box span {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--text-on-dark-muted);
}

.ref-box strong {
  font-family: var(--display);
  font-size: 24px;
  letter-spacing: .04em;
  color: var(--yellow);
}

.success-body {
  padding: clamp(28px, 4.5vw, 48px);
}

.success-body h3 {
  font-family: var(--display);
  font-size: 22px;
  margin-bottom: 18px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  padding: 22px;
  border-radius: 18px;
  background: var(--cream);
  border: 1px solid var(--line);
}

.summary-full {
  grid-column: 1 / -1;
}

.summary-grid dt {
  font-size: 11.5px;
  font-weight: 800;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--muted);
}

.summary-grid dd {
  margin-top: 4px;
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
}

.summary-desc {
  white-space: pre-wrap;
  font-weight: 450 !important;
  line-height: 1.6;
}

.success-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 28px;
}

.btn-text-link {
  background: none;
  border: none;
  padding: 10px 14px;
  color: var(--logo-blue);
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 750;
  cursor: pointer;
}
.btn-text-link:hover {
  text-decoration: underline;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 1040px) {
  .report-layout {
    grid-template-columns: minmax(0, 1fr);
  }
  .report-sidebar {
    position: static;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .sidebar-card--yellow {
    grid-column: 1 / -1;
  }
}

/* Mobile-First Smartphone Optimizations (<= 860px) */
@media (max-width: 860px) {
  .report-page > .shell {
    width: 100%;
    max-width: 100%;
    padding-inline: 14px;
  }

  .step-progress-bar {
    top: 70px;
    padding: 10px 12px 8px;
    margin-bottom: 16px;
    border-radius: 16px;
  }

  .step-pills {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
  }

  .step-jump-pill {
    padding: 7px 10px;
    font-size: 11.5px;
  }

  .quick-call-pill {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    text-align: center;
    padding: 11px 14px;
    font-size: 12.5px;
    border-radius: 16px;
  }

  .form-card {
    padding: 20px 16px;
    border-radius: 20px;
  }

  .form-card-head {
    padding-bottom: 16px;
    margin-bottom: 18px;
  }

  .mode-grid,
  .field-row,
  .field-row-nested,
  .dd-menu-body--grid,
  .report-sidebar,
  .summary-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }

  .field-row > .field-group > .field-label,
  .field-row-nested > .field-group > .field-label {
    min-height: 0;
  }

  /* Prevent iOS Safari zoom on input focus by using 16px font size on mobile */
  .text-input,
  .dd-trigger {
    height: 54px;
    font-size: 16px;
  }

  /* Transform Dropdowns into Native-Like Mobile Bottom Sheets! */
  .dd-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 140;
    background: rgba(16, 32, 31, .48);
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
  }

  .dd-menu {
    position: fixed;
    top: auto;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 150;
    max-height: 82vh;
    padding: 12px 16px max(18px, env(safe-area-inset-bottom));
    border-radius: 24px 24px 0 0;
    border: none;
    box-shadow: 0 -20px 50px rgba(16, 32, 31, .35);
    animation: sheetSlideUp .24s cubic-bezier(.22, 1, .36, 1);
  }

  @keyframes sheetSlideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
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

  .dd-sheet-header strong {
    font-family: var(--display);
    font-size: 17px;
    font-weight: 600;
    color: var(--ink);
    padding-right: 12px;
  }

  .dd-sheet-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 50%;
    background: var(--cream);
    color: var(--ink);
    font-size: 14px;
    font-weight: 800;
    cursor: pointer;
    flex-shrink: 0;
  }

  .dd-menu-body,
  .dd-menu--scroll .dd-menu-body {
    max-height: 56vh;
    overflow-y: auto;
    padding: 4px 0;
  }

  .dd-option {
    min-height: 50px;
    padding: 12px 14px;
    font-size: 15px;
  }

  .dd-done-btn {
    flex: 1;
    min-height: 48px;
    font-size: 15px;
  }

  .contact-fields-box {
    padding: 16px;
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
