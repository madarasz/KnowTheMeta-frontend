<template>
  <v-tooltip v-model="showTooltip" right>
    <template v-slot:activator="{ on }">
      <v-icon icon v-on="on" class="icon-left">{{ mdiInformation }}</v-icon>
    </template>
    <span class="justify-start">{{ text }}</span>
  </v-tooltip>
</template>

<script>
import { mdiInformation } from '@mdi/js'

export default {
  name: 'Tooltip',
  props: {
    text: String
  },
  data: () => ({
    showTooltip: false,
    mdiInformation
  }),
  watch: {
    showTooltip: function (newValue, oldValue) {
      if (newValue) {
        // fire analytics event
        this.$ga.event({
          eventCategory: 'UI',
          eventAction: 'display-tooltip',
          eventLabel: this.text
        })
      }
    }
  }
}
</script>
