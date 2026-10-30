<script setup>
import SectionLabel from './SectionLabel.vue'

defineProps({
  label: {
    type: String,
    default: '',
  },
  labelVariant: {
    type: String,
    default: 'default',
  },
  headingLine1: {
    type: String,
    default: '',
  },
  headingAccent: {
    type: String,
    default: '',
  },
  inlineAccent: {
    type: Boolean,
    default: false,
  },
  moreLink: {
    type: Object,
    default: null, // { label, href, arrow, external }
  },
})
</script>

<template>
  <div class="section-head">
    <div>
      <SectionLabel v-if="label" :text="label" :variant="labelVariant" />
      <h2>
        <slot name="heading">
          {{ headingLine1 }}<br v-if="!inlineAccent && headingLine1 && headingAccent" />
          <template v-if="inlineAccent && headingLine1 && headingAccent">&nbsp;</template>
          <em v-if="headingAccent" class="accent-teal">{{ headingAccent }}</em>
        </slot>
      </h2>
    </div>

    <slot name="action">
      <a
        v-if="moreLink"
        class="link-more"
        :href="moreLink.href"
        :target="moreLink.external ? '_blank' : undefined"
        :rel="moreLink.external ? 'noopener' : undefined"
      >
        {{ moreLink.label }}
        <span class="arr">{{ moreLink.arrow || '↗' }}</span>
      </a>
    </slot>
  </div>
</template>
