<template>
  <v-content>
    <v-container>
      <v-row>
        <!-- Alerts -->
        <v-alert type="error" v-if="isMwlLoaded && cardStats.card.title in netrunnerdb.mwl[0].banned"
            data-testid="warning-banned" class="ma-2 pa-2" width="100%">
          Currently banned by <span class="text-no-wrap">'{{ netrunnerdb.mwl[0].name }}'</span>
        </v-alert>
        <v-alert type="warning" v-if="isMwlLoaded && cardStats.card.title in netrunnerdb.mwl[0].restricted"
            data-testid="warning-restricted" class="ma-2 pa-2" width="100%">
          Currently restricted by <span class="text-no-wrap">'{{ netrunnerdb.mwl[0].name }}'</span>
        </v-alert>
        <v-alert color="blue-grey" type="warning" dark v-if="isCardsLoaded && !netrunnerdb.cards[cardStats.card.title].legal"
            data-testid="warning-rotated" class="ma-2 pa-2" width="100%">
          This card has rotated and it is not legal to play.
        </v-alert>
      </v-row>
      <!-- Print carousel -->
      <v-row>
        <v-col class="pb-0 pr-0 col-md-6">
          <print-lister v-if="cardStats" :prints="cardStats.prints" :is-runner="isRunner"/>
        </v-col>
      </v-row>
      <!-- low data warning -->
      <v-row justify="center" v-if="cardStats && cardStats.lowData" data-testid="warning-low-data">
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
            v-if="isMetaLoaded && isMwlLoaded && notNavigatingAway" :is-runner="isRunner" :is-identity="cardStats.card.type_code === 'identity'" chart-id="card-chart" style="height: 300px"
            :style="Object.keys(cardStats.metaData).length === 1 ? 'max-width: 600px; margin: 0 auto' : ''"/>
        </v-col>
      </v-row>
      <!-- explain chart -->
      <explain-card-chart/>
    </v-container>
  </v-content>
</template>

<script>
import PrintLister from '@/components/lister/PrintLister.vue'
import CardChart from '@/components/chart/CardChart.vue'
import ExplainCardChart from '@/components/widget/ExplainCardChart.vue'
import { mapState, mapGetters } from 'vuex'

export default {
  components: {
    CardChart,
    PrintLister,
    ExplainCardChart
  },
  mounted: function () {
    this.getCardStats()
    this.getMwlData()
  },
  watch: {
    'cardStats.card.title': function (newValue, Oldvalue) {
      if (this.cardStats && this.cardStats.card) {
        document.title = this.cardStats.card.title + ' - Know the Meta - Netrunner'
      }
    }
  },
  methods: {
    getCardStats: function () {
      this.$store.dispatch('cards/getCardStat', this.$route.params.cardcode + '-' + this.$route.params.cardtitle).then(() => {
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
      cardStats: 'cards/getCurrentStat',
      isRunner: 'cards/isRunner'
    }),
    isMwlLoaded: function () {
      return this.netrunnerdb.mwl && this.netrunnerdb.mwl.length > 0 && this.cardStats && this.cardStats.card.title
    },
    isCardsLoaded: function () {
      return this.netrunnerdb.cards && Object.keys(this.netrunnerdb.cards).length && this.cardStats && this.cardStats.card
    },
    isMetaLoaded: function () {
      return this.cardStats && this.cardStats.metaData && this.metas.metaList.length
    }
  },
  // bugfix for weird chart onDestroy error. Hiding chart before navigating away
  data: () => ({
    notNavigatingAway: true
  }),
  beforeRouteLeave (to, from, next) {
    this.notNavigatingAway = false
    next()
  }
}
</script>
