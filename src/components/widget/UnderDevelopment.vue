<template>
  <div class="red--text">
    <v-icon icon color="red">{{ mdiAccountHardHat }}</v-icon>
    <strong><em>Under development</em></strong>
    <v-icon icon color="red">{{ mdiAccountHardHat }}</v-icon>
  </div>
</template>

<script>
import { mdiAccountHardHat } from '@mdi/js'

export default {
  name: 'UnderDevelopment',
  data: () => ({
    mdiAccountHardHat
  })
}
</script>
