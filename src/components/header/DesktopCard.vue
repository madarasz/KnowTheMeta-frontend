<template>
  <v-card class="mt-4">
    <v-card-title class="desktop-card" :data-testid="'desktop-card-' + title">
      <!-- Title -->
      {{ title }}
      <!-- Tooltip -->
      <tooltip :text="tooltip" v-if="tooltip"/>
      <v-spacer/>
      <!-- Subtitle -->
      <span class="overline">
        {{ subtitle }}
      </span>
    </v-card-title>
    <!-- Pretext -->
    <slot name="pretext"></slot>
    <v-card-text class="pb-0">
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

export default {
  name: 'DesktopCard',
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
