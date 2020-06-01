<template>
  <v-row class="text-center justify-center">
    <v-col v-for="print in prints" :key="print.code" class="text-center flex-grow-0">
      <v-row dense>
        <v-col class="text-center">
          <div class="inline-flex">
            <v-img :src="print.image_url" width="300px" height="420px"
                :lazy-src="'/img/' + (isRunner ? 'runner' : 'corp') + '-card-back-small.png'" />
          </div>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <em>{{ print.pack_title }}</em>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'PrintLister',
  props: {
    prints: Array,
    isRunner: Boolean
  }
}
</script>
