<template>
  <v-expansion-panels v-model="openedIndex" class="square-border">
  <v-expansion-panel class="square-border">
    <v-expansion-panel-header class="mobile-panel" :color="color" :hide-actions="hideActions">
      {{ title }}
      <v-spacer/>
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
export default {
  name: 'MobilePanel',
  props: {
    title: String,
    subtitle: String,
    color: {
      type: String,
      default: 'secondary'
    },
    hideActions: Boolean
  },
  data: () => ({
    openedIndex: 0
  })
}
</script>
