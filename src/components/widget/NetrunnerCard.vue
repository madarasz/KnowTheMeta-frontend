<template>
  <div>
    <v-row dense>
      <v-col class="text-center pa-1 pb-0">
        <div class="d-inline-flex">
          <v-img :src="card.image_url" width="100px" height="140px"/>
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
<style scoped>
.card-title {
  font-size: .75rem;
  line-height: 1rem;
  height: 2rem;
}
</style>
