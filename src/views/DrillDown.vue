<template>
  <v-content>
    <!-- Desktop -->
    <v-container class="pa-4" fluid v-show="$vuetify.breakpoint.mdAndUp">
      <v-row dense>
        <!-- Drilldown options -->
        <v-col class="col-md-6 col-lg-4 pa-0 pr-2">
          <desktop-card-single title="Drilldown">
            <template v-slot:content>
              <drill-down-options :side-code="sideCode" :current-factions="currentFactions" :meta-list-loaded="metaListLoaded"/>
            </template>
          </desktop-card-single>
        </v-col>
        <!-- Charts -->
        <v-col class="col-md-6 col-lg-8 pa-0 pl-2">
          <!-- side win rates -->
          <desktop-card-single title="Side win rates" v-if="!sideCode && metaListLoaded">
            <template v-slot:content>
              <side-winrate-meta :meta-data="metas" v-if="!sideCode && metaListLoaded"/>
            </template>
          </desktop-card-single>
          <div v-if="sideCode && allMetaDataLoaded">
            <v-row no-gutters class="pb-4">
              <v-col>
                <desktop-card-single title="Faction popularity">
                  <template v-slot:content>
                    <faction-popularity :meta-data="metas" :factions="currentFactions" :side-code="sideCode" :stacked="popularityStacked"/>
                    <v-switch v-model="popularityStacked" label="stacked"/>
                  </template>
                </desktop-card-single>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <desktop-card-single title="Faction winrate">
                  <template v-slot:content>
                    <faction-winrate :meta-data="metas" :factions="currentFactions" :side-code="sideCode" :error-bar="selectedErrorBar"/>
                    <v-select :items="errorBarOptions" label="Error bars" v-model="selectedErrorBar"/>
                  </template>
                </desktop-card-single>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import DesktopCardSingle from '@/components/header/DesktopCardSingle.vue'
import SideWinrateMeta from '@/components/chart/SideWinrateMeta.vue'
import FactionWinrate from '@/components/chart/FactionWinrate.vue'
import FactionPopularity from '@/components/chart/FactionPopularity.vue'
import DrillDownOptions from '@/components/widget/DrillDownOptions.vue'
import { mapState } from 'vuex'

export default {
  name: 'DrillDown',
  components: {
    DesktopCardSingle,
    SideWinrateMeta,
    FactionWinrate,
    FactionPopularity,
    DrillDownOptions
  },
  data: function () {
    return {
      sideCode: this.$route.params.sidecode || null,
      selectedErrorBar: false,
      popularityStacked: false
    }
  },
  mounted () {
    if (this.sideCode && !this.allMetaDataLoaded) this.getAllMetaData()
  },
  methods: {
    getAllMetaData: function (metac) {
      this.metas.metaList.forEach(meta => {
        this.$store.dispatch('metas/getMetaData', meta.code).then((response) => {
        })
      })
    },
    getFactions: function (sidecode) {
      const factions = {}
      for (const [metacode, meta] of Object.entries(this.metas.metaData)) { // eslint-disable-line no-unused-vars
        meta.factions[sidecode].forEach(faction => {
          if (!(faction.code in factions)) {
            factions[faction.code] = faction.faction
          }
        })
      }
      return factions
    }
  },
  watch: {
    '$route.params.sidecode': function (newValue, oldValue) {
      this.sideCode = newValue
      if (newValue && !this.allMetaDataLoaded) this.getAllMetaData() // if side is chosen and all meta data is not loaded, load it
    }
  },
  computed: {
    ...mapState(['metas']),
    metaListLoaded: function () {
      return this.metas && this.metas.metaList && this.metas.metaList.length > 0
    },
    allMetaDataLoaded: function () {
      return this.metaListLoaded && this.metas.metaData && Object.keys(this.metas.metaData).length === this.metas.metaList.length
    },
    runnerFactions: function () {
      return this.getFactions('runner')
    },
    corpFactions: function () {
      return this.getFactions('corp')
    },
    currentFactions: function () {
      if (this.sideCode === null) return {}
      if (this.sideCode === 'runner') return this.runnerFactions
      return this.corpFactions
    },
    errorBarOptions: function () {
      const options = Object.entries(this.currentFactions).map(x => { return { text: x[1], value: x[0] } })
      options.unshift({ text: 'NONE', value: false })
      options.push({ text: 'ALL', value: true })
      return options
    }
  }
}
</script>
