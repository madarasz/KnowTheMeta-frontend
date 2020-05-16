<template>
  <v-card class="mt-4">
    <v-card-title class="desktop-card">
      {{ title }}
      <v-spacer/>
      <span class="overline">
        {{ subtitle }}
      </span>
    </v-card-title>
    <v-card-text class="pb-0">
      <slot></slot>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'DesktopCard',
  props: {
    title: String,
    subtitle: String
  }
}
</script>

<style scoped>
.desktop-card {
  background-color: rgba(53, 149, 185, 0.5);
  padding: 4px 16px;
}
</style>
