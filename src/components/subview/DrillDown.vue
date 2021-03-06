<template>
  <div>
    <!-- Desktop -->
    <v-container class="pa-4" fluid v-if="$vuetify.breakpoint.mdAndUp">
      <v-row dense>
        <!-- Drilldown options -->
        <v-col class="col-md-6 col-lg-4 pa-0 pr-4 pl-4">
          <v-container class="pa-0" fluid>
            <v-row>
              <v-col class="col-12 pa-0">
                <desktop-card-single title="Drilldown" class="pa-0">
                  <template v-slot:content>
                    <drill-down-options :side-code="sideCode" :faction-code="factionCode" :current-factions="currentFactions" :meta-list-loaded="metaListLoaded"
                      style="margin-left: -16px; margin-right: -16px; margin-bottom: -16px"/>
                  </template>
                </desktop-card-single>
              </v-col>
            </v-row>
            <v-row class="pt-4">
              <v-col class="col-12 pa-0">
                <desktop-card-single title="Go to meta">
                  <template v-slot:content>
                    <meta-options :meta-list-loaded="metaListLoaded"/>
                  </template>
                </desktop-card-single>
              </v-col>
            </v-row>
          </v-container>
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
            <!-- faction popularity -->
            <v-row no-gutters class="pb-4">
              <v-col>
                <desktop-card-single title="Faction popularity">
                  <template v-slot:content>
                    <faction-popularity :meta-data="metas" :factions="currentFactions" :side-code="sideCode" :stacked="popularityStacked"/>
                  </template>
                  <template v-slot:title-action>
                    <v-switch v-model="popularityStacked" label="stacked" class="ma-0 pa-0 title-input"/>
                  </template>
                </desktop-card-single>
              </v-col>
            </v-row>
            <!-- faction win rate -->
            <v-row no-gutters>
              <v-col>
                <desktop-card-single title="Faction winrate">
                  <template v-slot:content>
                    <faction-winrate :meta-data="metas" :factions="currentFactions" :side-code="sideCode" :error-bar="selectedErrorBar"/>
                  </template>
                  <template v-slot:title-action>
                    <v-select :items="errorBarOptions" label="Error bars" v-model="selectedErrorBar" class="mt-0 title-input" style="max-width: 300px"/>
                  </template>
                </desktop-card-single>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <!-- Mobile -->
    <div v-if="!$vuetify.breakpoint.mdAndUp">
      <mobile-panel title="Drilldown">
        <drill-down-options :side-code="sideCode" :faction-code="factionCode" :current-factions="currentFactions" :meta-list-loaded="metaListLoaded"
            style="margin-left: -24px; margin-right: -24px; margin-bottom: -12px"/>
      </mobile-panel>
      <!-- Side win rates -->
      <mobile-panel title="Side win rates" v-if="!sideCode && metaListLoaded">
        <side-winrate-meta :meta-data="metas" v-if="!sideCode && metaListLoaded"/>
      </mobile-panel>
      <!-- Faction data -->
      <mobile-panel title="Faction popularity" v-if="sideCode && allMetaDataLoaded">
        <template v-slot:title-action>
          <v-switch v-model="popularityStacked" label="stacked" class="ma-0 pa-0 title-input" @click.stop="popularityStacked = !popularityStacked"/>
        </template>
        <faction-popularity :meta-data="metas" :factions="currentFactions" :side-code="sideCode" :stacked="popularityStacked"/>
      </mobile-panel>
      <mobile-panel title="Faction win rate" v-if="sideCode && allMetaDataLoaded">
        <template v-slot:title-action>
          <v-select :items="errorBarOptions" label="Error bars" v-model="selectedErrorBar" class="mt-0 title-input" style="max-width: 130px" @click.native.stop=""/>
        </template>
        <faction-winrate :meta-data="metas" :factions="currentFactions" :side-code="sideCode" :error-bar="selectedErrorBar"/>
      </mobile-panel>
      <!-- Go to meta -->
      <mobile-panel title="Go to meta">
        <meta-options :meta-list-loaded="metaListLoaded"/>
      </mobile-panel>
    </div>
  </div>
</template>

<script>
import DesktopCardSingle from '@/components/header/DesktopCardSingle.vue'
import SideWinrateMeta from '@/components/chart/SideWinrateMeta.vue'
import FactionWinrate from '@/components/chart/FactionWinrate.vue'
import FactionPopularity from '@/components/chart/FactionPopularity.vue'
import DrillDownOptions from '@/components/widget/DrillDownOptions.vue'
import MetaOptions from '@/components/widget/MetaOptions.vue'
import MobilePanel from '@/components/header/MobilePanel.vue'
import { mapState } from 'vuex'

export default {
  name: 'DrillDown',
  components: {
    DesktopCardSingle,
    SideWinrateMeta,
    FactionWinrate,
    FactionPopularity,
    DrillDownOptions,
    MetaOptions,
    MobilePanel
  },
  data: function () {
    return {
      sideCode: this.$route.params.sidecode || null,
      factionCode: this.$route.params.factioncode || null,
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
    },
    '$route.params.factioncode': function (newValue, oldValue) {
      this.factionCode = newValue
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
