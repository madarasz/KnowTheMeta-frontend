<template>
  <v-card-title class="card-subtitle">
    <div class="overline">
      {{ subtitle }}
      <slot name="label"></slot>
    </div>
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
