<template>
  <v-expansion-panels v-model="openedIndex" class="square-border">
  <v-expansion-panel class="square-border" @change="expand">
    <v-expansion-panel-header class="mobile-panel" :color="color" :hide-actions="hideActions" :class="{ 'thin-panel': thin }">
      <!-- Title -->
      {{ title }}
      <!-- Tooltip -->
      <tooltip :text="tooltip" v-if="tooltip"/>
      <v-spacer/>
      <slot name="title-action"></slot>
      <!-- Subtitle -->
      <span class="overline text-right" v-html="subtitle"/>
      <span class="data-label flag-warning title-warning" v-if="dataWarning > 0">
        <v-icon icon dark>{{ mdiAlertOutline }}</v-icon>
        <span v-if="dataWarning == 2">very</span>
        low data
      </span>
    </v-expansion-panel-header>
    <v-expansion-panel-content :key="contentKey">
      <slot></slot>
    </v-expansion-panel-content>
  </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import Tooltip from '@/components/widget/Tooltip.vue'
import { mdiAlertOutline } from '@mdi/js'

export default {
  name: 'MobilePanel',
  props: {
    title: String,
    subtitle: String,
    dataWarning: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: 'secondary'
    },
    hideActions: Boolean,
    thin: Boolean,
    tooltip: String
  },
  components: {
    Tooltip
  },
  data: () => ({
    mdiAlertOutline: mdiAlertOutline,
    openedIndex: 0,
    contentKey: 0
  }),
  methods: {
    expand: function () {
      // fire analytics event
      this.$ga.event({
        eventCategory: 'UI',
        eventAction: 'mobilepanel-expand/contract',
        eventLabel: this.title,
        eventValue: this.openedIndex === 0 ? 0 : 1 // send 0 on contract, 1 on expand
      })
    }
  },
  // This fixes charts disappearing after reopening expansion panel
  watch: {
    openedIndex: function (newValue, oldValue) {
      if (newValue === 0) this.contentKey++ // Force rerender of content if expansion panel is reopened.
    }
  }
}
</script>
