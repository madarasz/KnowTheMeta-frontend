<template>
  <div>
    <v-row dense>
      <v-col class="text-center pa-1 pb-0">
        <div class="d-inline-flex">
          <router-link :to="cardUrl" :aria-label="card.title"
              @click.native="$ga.event({ eventCategory: 'Navigation', eventAction: 'card-image', eventLabel: card.title })">
            <v-img :src="'/img/cards/' + card.code + '.png'" width="100px" height="140px"
                :lazy-src="'/img/' + (card.runner ? 'runner' : 'corp') + '-card-back-small.png'">
              <v-badge v-if="card.badge" class="badge-border-fix" bordered overlap
                  :content="card.badge" :label="card.badge"
                  :color="card.badge === 'new' ? 'green': 'blue'"
                  :offset-x="card.badge === 'new' ? -10 : 26.25 + card.badge.length * 1.25"
                  :offset-y="card.badge === 'new' ? 0 : 30"/>
            </v-img>
          </router-link>
        </div>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col class="card-title pt-0">
        <router-link :to="cardUrl" :badge="card.badge" :aria-label="card.title"
            @click.native="$ga.event({ eventCategory: 'Navigation', eventAction: 'card-title', eventLabel: card.title })">
          {{ shorten(card.title) }}
        </router-link>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import transform from '@/netrunnerTransformations.js'
export default {
  name: 'NetrunnerCard',
  props: {
    card: Object
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
    cardUrl: function () {
      return transform.cardUrl(this.card)
    }
  }
}
</script>
