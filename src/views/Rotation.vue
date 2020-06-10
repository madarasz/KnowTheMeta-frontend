<template>
  <v-content v-if="netrunnerdb.cycles.length > 0">
    <!-- Desktop screens -->
    <div class="mr-4 ml-4" v-if="$vuetify.breakpoint.mdAndUp">
      <!-- Legal -->
      <desktop-card-divided left-title="Legal" right-title="Rotated">
        <template v-slot:left>
          <cycle-lister :cycle-list="legalCycles" test-id="rotation-legal"/>
        </template>
        <template v-slot:right>
          <cycle-lister :cycle-list="rotatedCycles" legal-reprints test-id="rotation-rotated"/>
        </template>
      </desktop-card-divided>
    </div>
    <!-- Mobile screens -->
    <div v-if="$vuetify.breakpoint.smAndDown">
      <!-- Tabs -->
      <v-card>
        <v-tabs height="36px" v-model="tab" :fixed-tabs="$vuetify.breakpoint.xs" @change="changeTab(tab)">
          <v-tab href="#legal">
            Legal
          </v-tab>
          <v-tab href="#rotated">
            Rotated
          </v-tab>
        </v-tabs>
      </v-card>
      <!-- Content -->
      <v-container fluid class="pa-0">
        <v-tabs-items v-model="tab">
          <v-tab-item :key="1" value="legal" :transition="false" :reverse-transition="false">
            <cycle-lister :cycle-list="legalCycles" test-id="rotation-legal"/>
          </v-tab-item>
          <v-tab-item :key="2" value="rotated" :transition="false" :reverse-transition="false">
            <cycle-lister :cycle-list="rotatedCycles" legal-reprints test-id="rotation-rotated"/>
          </v-tab-item>
        </v-tabs-items>
      </v-container>
    </div>
  </v-content>
</template>

<script>
import { mapState } from 'vuex'
import DesktopCardDivided from '@/components/header/DesktopCardDivided.vue'
import CycleLister from '@/components/lister/CycleLister.vue'
import transform from '@/store/nrdbTransformations'

export default {
  components: {
    DesktopCardDivided,
    CycleLister
  },
  data: () => ({
    tab: 'legal' // default tab
  }),
  mounted: function () {
    this.getNetunnerDBData()
  },
  methods: {
    getNetunnerDBData: function () {
      this.$store.dispatch('netrunnerdb/getCardData', false).then(() => {
      })
    },
    changeTab: function (tabName) {
      // fire analytics event
      this.$ga.event({
        eventCategory: 'UI',
        eventAction: 'change-rotation-tab',
        eventLabel: tabName
      })
    }
  },
  computed: {
    ...mapState(['netrunnerdb']),
    legalCycles: function () {
      return transform.filterCycles(this.netrunnerdb.cycles.filter(x => { return !x.rotated }).reverse())
    },
    rotatedCycles: function () {
      return transform.filterCycles(this.netrunnerdb.cycles.filter(x => { return x.rotated }).reverse())
    }
  }
}
</script>
