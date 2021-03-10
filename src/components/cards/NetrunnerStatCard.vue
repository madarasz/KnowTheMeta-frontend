<template>
  <div>
    <v-row dense>
      <v-col class="text-center pa-1 pb-0">
        <div class="d-inline-flex">
          <router-link :to="cardUrl" :aria-label="card.title"
              @click.native="$ga.event({ eventCategory: 'Navigation', eventAction: 'card-image', eventLabel: card.title })">
            <v-img :src="'/img/cards/' + card.code + '.png'" width="100px" height="140px"
                :lazy-src="'/img/' + (runner ? 'runner' : 'corp') + '-card-back-small.png'">
            </v-img>
          </router-link>
        </div>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col class="card-title pt-0">
        <router-link :to="cardUrl"  :aria-label="card.title"
            @click.native="$ga.event({ eventCategory: 'Navigation', eventAction: 'card-title', eventLabel: card.title })">
          {{ shorten(card.title) }}
        </router-link>
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
    },
    cardUrl: function () {
      return transform.cardUrl(this.card)
    }
  }
}
</script>
