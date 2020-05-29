<template>
  <div>
    <v-row dense>
      <v-col class="text-center pa-1 pb-0">
        <div class="d-inline-flex">
          <v-img :src="card.image_url" width="100px" height="140px"
              :lazy-src="'/img/' + (runner ? 'runner' : 'corp') + '-card-back-small.png'">
          </v-img>
        </div>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col class="card-title pt-0">
        <span>{{ shorten(card.title) }}</span>
      </v-col>
    </v-row>
    <v-row dense class="mb--4">
      <v-col class="text-center caption pa-0">
        <em>popularity: {{ Math.round( card.used / deckCount * 1000) / 10 }}%</em>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col class="text-center caption pa-0">
        <em>winrate: {{ winrate }}%</em>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import transform from '@/netrunnerTransformations.js'

export default {
  name: 'NetrunnerStatCard',
  props: {
    card: Object,
    runner: Boolean,
    deckCount: Number
  },
  methods: {
    shorten: function (title) {
      if (title.indexOf(':') > -1) {
        return transform.shortenIdentity(title)
      }
      return title
    }
  },
  computed: {
    winrate: function () {
      return transform.winrate(this.card)
    }
  }
}
</script>
