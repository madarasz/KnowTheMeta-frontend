<template>
  <v-content>
    <!-- Alerts -->
    <v-alert type="error" v-if="netrunnerdb.mwl && cardStats.card && cardStats.card.title in netrunnerdb.mwl[0].banned" data-testid="warning-banned" class="ma-2 pa-2">
      Currently banned by '{{ netrunnerdb.mwl[0].name }}'
    </v-alert>
    <v-alert type="warning" v-if="netrunnerdb.mwl && cardStats.card && cardStats.card.title in netrunnerdb.mwl[0].restricted" data-testid="warning-restricted" class="ma-2 pa-2">
      Currently restricted by '{{ netrunnerdb.mwl[0].name }}'
    </v-alert>
    <!-- Desktop screens -->
    <div class="mr-4 ml-4" v-if="$vuetify.breakpoint.mdAndUp">
      <v-row>
        <v-col cols="6">
          <print-lister :prints="cardStats.prints" :is-runner="isRunner" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <card-chart :meta-data="cardStats.metaData" :meta-list="metas.metaList" :mwl="netrunnerdb.mwl" :card-title="cardStats.card.title"
            v-if="cardStats.metaData && metas.metaList.length && netrunnerdb.mwl.length"
            :is-runner="isRunner" :is-identity="cardStats.card.type_code === 'identity'" chart-id="card-chart" style="height: 300px"/>
        </v-col>
      </v-row>
    </div>
    <!-- Mobile screens -->
    <div v-if="$vuetify.breakpoint.smAndDown">
    </div>
  </v-content>
</template>

<script>
import PrintLister from '@/components/lister/PrintLister.vue'
import CardChart from '@/components/chart/CardChart.vue'
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  data: function () {
    return {
      cardStats: {}
    }
  },
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
      axios.get(`https://alwaysberunning.net/ktm/cards/${this.$route.params.cardcode}.json`).then((response) => {
        this.cardStats = response.data
      })
    },
    getMwlData: function () {
      this.$store.dispatch('netrunnerdb/getCardData', true).then(() => {
      })
    }
  },
  computed: {
    ...mapState(['metas', 'netrunnerdb']),
    isRunner: function () {
      if (!this.cardStats.card) {
        return undefined
      }
      return this.cardStats.card.side_code === 'runner'
    }
  }
}
</script>
