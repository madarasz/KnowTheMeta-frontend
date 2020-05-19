<template>
  <v-card class="mt-4">
    <v-card-title class="desktop-card">
      {{ title }}
      <v-spacer/>
      <span class="overline">
        {{ subtitle }}
      </span>
    </v-card-title>
    <slot name="pretext"></slot>
    <v-card-text class="pb-0">
      <v-row>
        <v-col cols="6" class="divider-on-right">
          <slot name="left"></slot>
        </v-col>
        <v-col cols="6">
          <slot name="right"></slot>
        </v-col>
      </v-row>
    </v-card-text>
    <slot name="posttext"></slot>
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
