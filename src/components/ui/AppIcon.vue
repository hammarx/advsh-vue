<script setup>
defineProps({
  name: {
    type: String,
    required: true,
    // 'chat' | 'users' | 'org' | 'globe' | 'phone' | 'mail' | 'pin'
  },
})
</script>

<template>
  <!-- Chat / Counseling -->
  <svg
    v-if="name === 'chat'"
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

  <!-- Users / Workshops -->
  <svg
    v-else-if="name === 'users'"
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

  <!-- Org / Organisational development -->
  <svg
    v-else-if="name === 'org'"
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

  <!-- Phone -->
  <svg
    v-else-if="name === 'phone'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path
      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"
    />
  </svg>

  <!-- Mail -->
  <svg
    v-else-if="name === 'mail'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>

  <!-- Map Pin -->
  <svg
    v-else-if="name === 'pin'"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>

  <!-- Globe / Networking & policy (default) -->
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
</template>
