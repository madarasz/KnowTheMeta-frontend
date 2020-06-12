<template>
  <v-carousel v-if="prints" :show-arrows="prints.length > 1" hide-delimiters style="margin-bottom: -32px" :continuous="false" @change="slide">
    <v-carousel-item v-for="print in prints" :key="print.code" class="text-center">
      <v-row dense>
        <v-col class="text-center pb-0">
          <v-responsive aspect-ratio="5/7" class="text-center d-inline-flex">
            <v-img :src="print.image_url" max-width="300px" max-height="420px" contain
                  :lazy-src="'/img/' + (isRunner ? 'runner' : 'corp') + '-card-back-small.png'" />
          </v-responsive>
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
  },
  data: () => ({
    initialized: false // workaround
  }),
  methods: {
    slide: function () {
      if (this.initialized) {
        // fire analytics event, not firing for the first time, workaround
        this.$ga.event({
          eventCategory: 'UI',
          eventAction: 'slide-print-carousel'
        })
      }
      this.initialized = true
    }
  }
}
</script>
