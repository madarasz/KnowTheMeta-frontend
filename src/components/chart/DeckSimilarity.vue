<script>
import { Scatter } from 'vue-chartjs'
import clustering from '@/clustering.js'

export default {
  extends: Scatter,
  name: 'DeckSimilarity',
  props: {
    deckData: Array
  },
  data: function () {
    return {
      clusterData: [],
      clusterColors: ['red', 'green', 'blue', 'orange', 'black', 'pink', 'purple'],
      // chart options
      options: {
        maintainAspectRatio: false,
        responsive: true,
        animation: false,
        legend: {
          display: false
        },
        scales: {
        },
        tooltips: {
          enabled: true,
          callbacks: {
            label: function (tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].tooltips[tooltipItem.index]
            }
          }
        }
      }
    }
  },
  mounted () {
    this.processClusters()
    this.renderChart(this.chartdata, this.options)
  },
  methods: {
    processClusters: function () {
      this.clusterData = clustering.processIdentity(this.deckData)
    },
    getClusterIndex: function (deckId) {
      for (let i = 0; i < this.clusterData.length; i++) {
        for (let u = 0; u < this.clusterData[i].elements.length; u++) {
          if (this.clusterData[i].elements[u].id === deckId) return i
        }
      }
      return 5
    }
  },
  watch: {
    deckData: function (newValue, OldValue) {
      this.processClusters()
      this.renderChart(this.chartdata, this.options)
    }
  },
  computed: {
    chartdata: function () {
      return {
        datasets: [{
          label: 'decks',
          data: this.deckData.map(x => { return { x: x.xCoordinate, y: x.yCoordinate } }),
          tooltips: this.deckData.map(x => x.rankSummary),
          backgroundColor: this.deckData.map(x => this.clusterColors[this.getClusterIndex(x.deck.id)]),
          datalabels: {
            display: false
          }
        }]
      }
    }
  }
}
</script>
