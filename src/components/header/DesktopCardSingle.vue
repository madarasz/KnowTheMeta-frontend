<template>
  <v-card>
    <v-card-title class="desktop-card pa-2" :data-testid="'desktop-card-title-' + title">
      <!-- Title -->
      {{ title }}
      <!-- Tooltip -->
      <tooltip :text="tooltip" v-if="tooltip"/>
      <v-spacer/>
      <!-- Subtitle -->
      <span class="overline" v-html="subtitle"/>
      <slot name="title-action"></slot>
    </v-card-title>
    <!-- Content -->
    <v-card-text :data-testid="'desktop-card-content-' + title">
      <slot name="content"></slot>
    </v-card-text>
  </v-card>
</template>

<script>
import Tooltip from '@/components/widget/Tooltip.vue'

export default {
  name: 'DesktopCardSingle',
  props: {
    title: String,
    subtitle: String,
    tooltip: String
  },
  components: {
    Tooltip
  }
}
</script>
