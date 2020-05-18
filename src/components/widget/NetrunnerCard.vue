<template>
  <div>
    <v-row dense>
      <v-col class="text-center pa-1 pb-0">
        <div class="d-inline-flex">
          <v-img :src="card.image_url" width="100px" height="140px">
            <v-badge bordered overlap offset-x="-10" content="new" v-if="card.badge === 'new'" color="green" label="new in MWL"/>
            <v-badge class="badge-border-fix" bordered overlap color="blue" :content="card.badge" :label="card.badge + 'in the previous MWL'"
                v-if="card.badge && card.badge.indexOf('was') > -1" :offset-x="26.25 + card.badge.length * 1.25" offset-y="30"/>
          </v-img>
        </div>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col class="card-title pt-0">
        <span>{{ shorten(card.title) }}</span>
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
  }
}
</script>
