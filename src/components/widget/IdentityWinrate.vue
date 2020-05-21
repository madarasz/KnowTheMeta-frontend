<template>
  <winrate-chart :meta-data="sortedData" v-if="sortedData.length > 0" :id="'chart-winrate-' + side"/>
</template>

<script>
import WinrateChart from '@/components/chart/WinrateChart.vue'
import transform from '@/netrunnerTransformations.js'
export default {
  name: 'IdentityFactionWinRate',
  props: {
    side: String,
    sideData: Array
  },
  components: {
    WinrateChart
  },
  data: () => ({
    minimumMatches: 50, // identities below this used count will not be shown
    sortedData: []
  }),
  mounted () {
    this.prepareData()
  },
  watch: {
    sideData: function () {
      this.prepareData()
    }
  },
  methods: {
    prepareData: function () {
      // filter out entries below match count
      this.sortedData = [...this.sideData].filter(x => { return transform.matchCount(x) > this.minimumMatches })
      // sort by winrate
      this.sortedData.sort(transform.compareWinrates)
    }
  }
}
</script>
