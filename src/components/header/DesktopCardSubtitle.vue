<template>
  <v-card-title class="card-subtitle">
    <div class="overline">{{ subtitle }}</div>
  </v-card-title>
</template>

<script>
export default {
  name: 'DesktopCardSubtitle',
  props: {
    subtitle: String
  }
}
</script>
