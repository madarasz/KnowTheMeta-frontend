<template>
  <div>
    <v-content>
      <v-card>
        <v-tabs height="40px" v-model="tab" :fixed-tabs="$vuetify.breakpoint.xs">
          <v-tab href="#ids">
            Identities
          </v-tab>
          <v-tab href="#decks">
            Decks
          </v-tab>
          <v-tab href="#cards">
            Cards
          </v-tab>
        </v-tabs>
      </v-card>
      <v-container fluid class="pa-0">
        <v-tabs-items v-model="tab">
          <v-tab-item :key="1" value="ids" :transition="false" :reverse-transition="false">
            <identities :meta-data="metaData" v-if="metaData != null"/>
          </v-tab-item>
          <v-tab-item :key="2" value="decks" :transition="false" :reverse-transition="false">
            <h1>Decks</h1>
          </v-tab-item>
          <v-tab-item :key="3" value="cards" :transition="false" :reverse-transition="false">
            <h1>Cards</h1>
          </v-tab-item>
        </v-tabs-items>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import Identities from '@/components/subview/Identities.vue'
import axios from 'axios'

export default {
  components: {
    Identities
  },
  data: () => ({
    metaData: null,
    tab: 'ids' // default tab
  }),
  mounted: function () {
    this.getMetaData(this.$route.params.metaname)
  },
  watch: {
    '$route.params.metaname' (newMetaname) {
      this.getMetaData(newMetaname)
    }
  },
  methods: {
    getMetaData: function (metaname) {
      axios.get('https://alwaysberunning.net/ktm/' + metaname.toLowerCase() + '.json').then((response) => {
        this.metaData = response.data
      }).catch(() => {
        // TODO: error handling
      })
    }
  }
}
</script>
