<template>
  <v-content>
    <!-- Alerts -->
    <v-alert type="error" v-if="netrunnerdb.mwl && cardStats && cardStats.card.title in netrunnerdb.mwl[0].banned" data-testid="warning-banned" class="ma-2 pa-2">
      Currently banned by <span class="text-no-wrap">'{{ netrunnerdb.mwl[0].name }}'</span>
    </v-alert>
    <v-alert type="warning" v-if="netrunnerdb.mwl && cardStats && cardStats.card.title in netrunnerdb.mwl[0].restricted" data-testid="warning-restricted" class="ma-2 pa-2">
      Currently restricted by <span class="text-no-wrap">'{{ netrunnerdb.mwl[0].name }}'</span>
    </v-alert>
    <!-- Print carousel -->
    <v-row>
      <v-col class="pb-0 col-md-6">
        <print-lister v-if="cardStats" :prints="cardStats.prints" :is-runner="isRunner"/>
      </v-col>
    </v-row>
    <!-- low data warning -->
    <v-row justify="center" v-if="cardStats && cardStats.lowData">
      <v-col cols="auto pb-0">
        <v-alert border="left" colored-border color="#B56503" elevation="1"
            class="ml-2 mr-2 mb-0 pa-2 pl-4 pr-4 caption text-center" dismissible>
          This chart has metas with low amounts of win rate data. These statistics could be misleading.
        </v-alert>
      </v-col>
    </v-row>
    <!-- Card Chart -->
    <v-row class="mb--4">
      <v-col class="pt-0">
        <card-chart :meta-data="cardStats.metaData" :meta-list="metas.metaList" :mwl="netrunnerdb.mwl" :card-title="cardStats.card.title"
          v-if="cardStats && cardStats.metaData && metas.metaList.length && netrunnerdb.mwl.length"
          :is-runner="isRunner" :is-identity="cardStats.card.type_code === 'identity'" chart-id="card-chart" style="height: 300px"/>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
import PrintLister from '@/components/lister/PrintLister.vue'
import CardChart from '@/components/chart/CardChart.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    CardChart,
    PrintLister
  },
  mounted: function () {
    this.getCardStats()
    this.getMwlData()
  },
  methods: {
    getCardStats: function () {
      this.$store.dispatch('cards/getCardStat', this.$route.params.cardcode).then(() => {
      })
    },
    getMwlData: function () {
      this.$store.dispatch('netrunnerdb/getCardData', true).then(() => {
      })
    }
  },
  computed: {
    ...mapState(['metas', 'netrunnerdb', 'cards']),
    ...mapGetters({
      cardStats: 'cards/getCurrentStat'
    }),
    isRunner: function () {
      if (!this.cardStats.card) {
        return undefined
      }
      return this.cardStats.card.side_code === 'runner'
    }
  }
}
</script>
