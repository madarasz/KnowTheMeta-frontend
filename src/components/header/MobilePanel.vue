<template>
  <v-expansion-panels v-model="openedIndex" class="square-border">
  <v-expansion-panel class="square-border">
    <v-expansion-panel-header class="mobile-panel">
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
    subtitle: String
  },
  data: () => ({
    openedIndex: 0
  })
}
</script>

<style scoped>
.mobile-panel {
  background-color: rgba(53, 149, 185, 0.5);
  padding: 4px 16px;
  min-height: 40px;
}
.square-border {
  border-radius: 0;
}
</style>
