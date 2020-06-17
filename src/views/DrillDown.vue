<template>
  <v-content>
    <!-- Desktop -->
    <div class="mr-4 ml-4" v-if="$vuetify.breakpoint.mdAndUp">
      <desktop-card title="Win rates over time">
        <template v-slot:left>
          <side-winrate-meta :meta-data="metas" v-if="!sideCode && metaListLoaded"/>
          <div v-if="sideCode && allMetaDataLoaded">
            <faction-winrate :meta-data="metas" :factions="currentFactions" :side-code="sideCode" :error-bar="selectedErrorBar"/>
            <v-row>
              <v-col cols="6">
                <v-select :items="errorBarOptions" label="Error bars" v-model="selectedErrorBar"/>
              </v-col>
            </v-row>
          </div>
        </template>
        <template v-slot:right>
          <h3 class="text-center pb-2">Drilldown</h3>
          <drill-down-options :side-code="sideCode" :current-factions="currentFactions" :meta-list-loaded="metaListLoaded"/>
        </template>
      </desktop-card>
    </div>
  </v-content>
</template>

<script>
import DesktopCard from '@/components/header/DesktopCard.vue'
import SideWinrateMeta from '@/components/chart/SideWinrateMeta.vue'
import FactionWinrate from '@/components/chart/FactionWinrate.vue'
import DrillDownOptions from '@/components/widget/DrillDownOptions.vue'
import { mapState } from 'vuex'

export default {
  name: 'DrillDown',
  components: {
    DesktopCard,
    SideWinrateMeta,
    FactionWinrate,
    DrillDownOptions
  },
  data: function () {
    return {
      sideCode: this.$route.params.sidecode || null,
      selectedErrorBar: false
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
      options.push({ text: 'NONE', value: false })
      options.push({ text: 'ALL', value: true })
      return options
    }
  }
}
</script>
