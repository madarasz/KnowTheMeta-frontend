<template>
  <div>
    <v-content>
      <v-card>
        <v-tabs height="40px" v-model="tab" :fixed-tabs="$vuetify.breakpoint.xs">
          <v-tab href="#ids" @click="$router.push({ path: '/meta/' + $route.params.metacode + '/ids' })">
            Identities
          </v-tab>
          <v-tab href="#decks" @click="$router.push({ path: '/meta/' + $route.params.metacode + '/decks' })">
            Decks
          </v-tab>
          <v-tab href="#cards" @click="$router.push({ path: '/meta/' + $route.params.metacode + '/cards' })">
            Cards
          </v-tab>
        </v-tabs>
      </v-card>
      <v-container fluid class="pa-0">
        <v-tabs-items v-model="tab">
          <v-tab-item :key="1" value="ids" :transition="false" :reverse-transition="false">
            <identities :meta-data="getCurrentMeta" v-if="loaded && getCurrentMeta"/>
          </v-tab-item>
          <v-tab-item :key="2" value="decks" :transition="false" :reverse-transition="false">
            <h3 class="pa-4">
              <v-icon icon class="icon-left">{{ mdiAccountHardHat }}</v-icon>
              Section under construction
            </h3>
          </v-tab-item>
          <v-tab-item :key="3" value="cards" :transition="false" :reverse-transition="false">
            <cards :meta-data="getCurrentMeta" v-if="loaded && getCurrentMeta"/>
          </v-tab-item>
        </v-tabs-items>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import Identities from '@/components/subview/Identities.vue'
import Cards from '@/components/subview/Cards.vue'
import { mapGetters, mapMutations } from 'vuex'
import { mdiAccountHardHat } from '@mdi/js'

export default {
  components: {
    Identities,
    Cards
  },
  data: function () {
    return {
      mdiAccountHardHat,
      loaded: false,
      tab: this.$route.params.subview // default tab
    }
  },
  mounted: function () {
    this.getMetaData(this.$route.params.metacode)
  },
  watch: {
    '$route.params.metacode' (newMetacode) {
      this.getMetaData(newMetacode)
    }
  },
  methods: {
    getMetaData: function (metacode) {
      this.loaded = false
      this.setCurrentMetaCode(metacode)
      this.$store.dispatch('metas/getMetaData', metacode).then((response) => {
        this.loaded = true
      }).catch(() => {
        // TODO: error handling
      })
    },
    ...mapMutations({
      setCurrentMetaCode: 'metas/setCurrentMetaCode'
    })
  },
  computed: {
    ...mapGetters({
      getCurrentMeta: 'metas/getCurrentMeta'
    })
  }
}
</script>
