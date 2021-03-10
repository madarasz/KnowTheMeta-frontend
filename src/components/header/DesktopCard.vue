<template>
  <v-card class="mt-4">
    <v-card-title class="desktop-card" :data-testid="'desktop-card-' + title">
      <!-- Title -->
      {{ title }}
      <!-- Tooltip -->
      <tooltip :text="tooltip" v-if="tooltip"/>
      <v-spacer/>
      <!-- Subtitle -->
      <span class="overline" v-html="subtitle"/>
      <span class="data-label flag-warning title-warning" v-if="dataWarning > 0">
        <v-icon icon dark>{{ mdiAlertOutline }}</v-icon>
        <span v-if="dataWarning == 2">very</span>
        low data
      </span>
    </v-card-title>
    <!-- Pretext -->
    <slot name="pretext"></slot>
    <v-card-text class="pb-0 pt-0">
      <v-row>
        <v-col cols="6" class="divider-on-right">
          <!-- Left -->
          <slot name="left"></slot>
        </v-col>
        <v-col cols="6">
          <!-- Right -->
          <slot name="right"></slot>
        </v-col>
      </v-row>
    </v-card-text>
    <!-- Posttext -->
    <slot name="posttext"></slot>
  </v-card>
</template>

<script>
import Tooltip from '@/components/widget/Tooltip.vue'
import { mdiAlertOutline } from '@mdi/js'

export default {
  name: 'DesktopCard',
  props: {
    title: String,
    subtitle: String,
    tooltip: String,
    dataWarning: {
      type: Number,
      default: 0
    }
  },
  components: {
    Tooltip
  },
  data: () => ({
    mdiAlertOutline: mdiAlertOutline
  })
}
</script>
