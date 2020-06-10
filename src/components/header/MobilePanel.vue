<template>
  <v-expansion-panels v-model="openedIndex" class="square-border">
  <v-expansion-panel class="square-border" @change="expand">
    <v-expansion-panel-header class="mobile-panel" :color="color" :hide-actions="hideActions" :class="{ 'thin-panel': thin }">
      <!-- Title -->
      {{ title }}
      <!-- Tooltip -->
      <tooltip :text="tooltip" v-if="tooltip"/>
      <v-spacer/>
      <!-- Subtitle -->
      <span class="overline text-right">
        {{ subtitle }}
      </span>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <slot></slot>
    </v-expansion-panel-content>
  </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import Tooltip from '@/components/widget/Tooltip.vue'

export default {
  name: 'MobilePanel',
  props: {
    title: String,
    subtitle: String,
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
    openedIndex: 0
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
  }
}
</script>
