<template>
  <v-card class="mt-4">
    <v-card-title class="desktop-card pa-0" :data-testid="'desktop-card-' + leftTitle">
      <v-row dense class="mr-0">
        <v-col cols="6" class="pl-4 text-center">
          {{ leftTitle }}
        </v-col>
        <v-col cols="6" class="pr-4 text-center" style="background-color: #fcb3b3">
          {{ rightTitle }}
        </v-col>
      </v-row>
    </v-card-title>
    <slot name="pretext"></slot>
    <v-card-text class="pa-0">
      <v-row class="ma-0">
        <v-col cols="6" class="pa-0 divider-on-right">
          <slot name="left"></slot>
        </v-col>
        <v-col cols="6" class="pa-0">
          <slot name="right"></slot>
        </v-col>
      </v-row>
    </v-card-text>
    <slot name="posttext"></slot>
  </v-card>
</template>

<script>
export default {
  name: 'DesktopCardDivided',
  props: {
    leftTitle: String,
    rightTitle: String,
    subtitle: String
  }
}
</script>
