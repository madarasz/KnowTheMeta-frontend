<template>
  <v-carousel v-if="prints" :show-arrows="prints.length > 1" hide-delimiters style="margin-bottom: -32px" :continuous="false">
    <v-carousel-item v-for="print in prints" :key="print.code" class="text-center">
      <v-row dense>
        <v-col class="text-center pb-0">
          <div class="d-inline-flex">
          <v-img :src="print.image_url" width="300px" height="420px"
                :lazy-src="'/img/' + (isRunner ? 'runner' : 'corp') + '-card-back-small.png'" />
          </div>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col class="pt-0">
          <em data-testid="pack-name">{{ print.pack_title }}</em>
        </v-col>
      </v-row>
    </v-carousel-item>
  </v-carousel>
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
