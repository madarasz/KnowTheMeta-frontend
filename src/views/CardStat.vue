<template>
  <v-content>
    <!-- Desktop screens -->
    <div class="mr-4 ml-4" v-if="$vuetify.breakpoint.mdAndUp">
      <v-row>
        <v-col>
          <card-chart :meta-data="cardStats.metaData" :meta-list="metas.metaList" v-if="cardStats.metaData && metas.metaList.length"
            :is-runner="cardStats.card.side_code === 'runner'" chart-id="card-chart" style="height: 300px"/>
        </v-col>
      </v-row>
    </div>
    <!-- Mobile screens -->
    <div v-if="$vuetify.breakpoint.smAndDown">
    </div>
  </v-content>
</template>

<script>
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
    CardChart
  },
  mounted: function () {
    this.getCardStats()
    this.getMetaData()
  },
  methods: {
    getCardStats: function () {
      axios.get(`https://alwaysberunning.net/ktm/cards/${this.$route.params.cardcode}.json`).then((response) => {
        this.cardStats = response.data
      })
    },
    getMetaData: function (metacode) {
      this.$store.dispatch('metas/getMetaData', metacode).then((response) => {
      })
    }
  },
  computed: {
    ...mapState(['metas'])
  }
}
</script>
