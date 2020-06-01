<template>
  <div>
    <v-row dense>
      <v-col class="text-center pa-1 pb-0">
        <div class="d-inline-flex">
          <a :href="cardUrl">
            <v-img :src="card.image_url" width="100px" height="140px"
                :lazy-src="'/img/' + (card.runner ? 'runner' : 'corp') + '-card-back-small.png'">
              <v-badge v-if="card.badge" class="badge-border-fix" bordered overlap
                  :content="card.badge" :label="card.badge"
                  :color="card.badge === 'new' ? 'green': 'blue'"
                  :offset-x="card.badge === 'new' ? -10 : 26.25 + card.badge.length * 1.25"
                  :offset-y="card.badge === 'new' ? 0 : 30"/>
            </v-img>
          </a>
        </div>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col class="card-title pt-0">
        <a :href="cardUrl" :badge="card.badge">{{ shorten(card.title) }}</a>
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
