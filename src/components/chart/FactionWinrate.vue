<script>
import { Line } from 'vue-chartjs'
import transform from '@/netrunnerTransformations.js'
import * as pluginErrorBars from 'chartjs-plugin-error-bars'

export default {
  extends: Line,
  name: 'FactionWinrate',
  props: {
    metaData: Object,
    factions: Object,
    sideCode: String,
    errorBar: [Boolean, String]
  },
  data: function () {
    return {
      hiddenStates: new Array(Object.keys(this.factions).length).fill(false), // which dataset is hidden
      // chart options
      options: {
        plugins: [pluginErrorBars],
        maintainAspectRatio: false,
        responsive: true,
        animation: false,
        legend: {
          display: true,
          onClick: this.updateVisibility
        },
        scales: {
          yAxes: [{
            ticks: {
              callback: function (value, index, values) {
                return value + '%'
              }
            }
          }]
        },
        tooltips: {
          enabled: true,
          callbacks: {
            label: function (tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex].label + ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + '%'
            }
          }
        }
      }
    }
  },
  mounted () {
    this.renderChart(this.chartdata, this.options)
  },
  methods: {
    updateVisibility: function (e, legendItem) {
      this.$set(this.hiddenStates, legendItem.datasetIndex, !this.hiddenStates[legendItem.datasetIndex]) // change visibility with Vue reactivity
      this.renderChart(this.chartdata, this.options)
    },
    getFactionData: function (factioncode) {
      return this.factionMetaDataOrdered.map(meta => meta.find(faction => faction.code === factioncode))
    },
    getErrorBars: function (factioncode) {
      const result = {}
      if (this.errorBar === false) return result
      let i = 0
      for (const meta of Object.values(this.metaData.metaData)) {
        const error = transform.winrateError(meta.factions[this.sideCode].find(x => x.code === factioncode))
        if ((this.errorBar === true || this.errorBar === factioncode) && !this.hiddenStates[i]) {
          result[meta.meta.title] = {
            plus: error,
            minus: -error
          }
        }
        i++
      }
      return result
    }
  },
  watch: {
    errorBar: function (newValue, OldValue) {
      this.renderChart(this.chartdata, this.options)
    }
  },
  computed: {
    factionMetaDataOrdered: function () {
      return this.metaData.metaList.map(x => this.metaData.metaData[x.code].factions[this.sideCode]).reverse()
    },
    chartdata: function () {
      const results = {
        labels: this.metaData.metaList.map(x => x.title).reverse(),
        datasets: []
      }
      let i = 0
      for (const [factioncode, faction] of Object.entries(this.factions)) {
        results.datasets.push({
          data: this.getFactionData(factioncode).map(x => transform.winrate(x)),
          errorBars: this.getErrorBars(factioncode),
          label: faction + ' win rate',
          backgroundColor: 'rgba(0,0,0,0)',
          borderWidth: 2,
          hidden: this.hiddenStates[i],
          borderColor: transform.factionCodeToColor(factioncode),
          pointBackgroundColor: transform.factionCodeToColor(factioncode),
          pointRadius: 2,
          datalabels: {
            display: false
          }
        })
        i++
      }
      return results
    }
  }
}
</script>
