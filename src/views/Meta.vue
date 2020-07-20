<template>
  <div>
    <v-content>
      <v-card>
        <v-tabs height="40px" v-model="tab" :fixed-tabs="$vuetify.breakpoint.xs">
          <v-tab href="#ids" @click="$router.push({ path: '/meta/' + $route.params.metacode + '/ids/' + ($route.params.side || '') })">
            Identities
          </v-tab>
          <v-tab href="#decks" @click="$router.push({ path: '/meta/' + $route.params.metacode + '/decks/' + ($route.params.side || '') })">
            Decks
          </v-tab>
          <v-tab href="#cards" @click="$router.push({ path: '/meta/' + $route.params.metacode + '/cards/' + ($route.params.side || '') })">
            Cards
          </v-tab>
        </v-tabs>
      </v-card>
      <v-container fluid class="pa-0">
        <v-tabs-items v-model="tab">
          <v-tab-item :key="1" value="ids" :transition="false" :reverse-transition="false">
            <identities :meta-data="getCurrentMeta" v-if="loaded && getCurrentMeta && getCurrentMeta.identities"/>
          </v-tab-item>
          <v-tab-item :key="2" value="decks" :transition="false" :reverse-transition="false">
            <decks :meta-data="getCurrentMeta" v-if="loaded && getCurrentMeta"/>
          </v-tab-item>
          <v-tab-item :key="3" value="cards" :transition="false" :reverse-transition="false">
            <cards :meta-data="getCurrentMeta" v-if="loaded && getCurrentMeta && getCurrentMeta.cards"/>
          </v-tab-item>
        </v-tabs-items>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import Identities from '@/components/subview/Identities.vue'
import Cards from '@/components/subview/Cards.vue'
import Decks from '@/components/subview/Decks.vue'
import { mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    Identities,
    Cards,
    Decks
  },
  data: function () {
    return {
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
      this.setPageTitle()
    },
    '$route.params.subview' (newSubview) {
      this.setPageTitle()
    }
  },
  methods: {
    getMetaData: function (metacode) {
      this.loaded = false
      this.$store.dispatch('metas/getMetaData', metacode).then((response) => {
        this.loaded = true
        this.setPageTitle()
      }).catch(() => {
        // TODO: error handling
      })
    },
    setPageTitle: function () {
      let title = ''
      const subview = this.$route.params.subview
      if (subview || subview.length > 0) {
        if (subview === 'ids') {
          title += 'Identities - '
        } else {
          title += subview[0].toUpperCase() + subview.slice(1) + ' - '
        }
      }
      if (this.getCurrentMeta && this.getCurrentMeta.meta && this.getCurrentMeta.meta.title) {
        title += this.getCurrentMeta.meta.title + ' - '
      }
      document.title = title + 'Know the Meta - Netrunner'
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
