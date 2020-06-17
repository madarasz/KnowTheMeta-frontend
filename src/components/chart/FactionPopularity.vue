<script>
import { Line } from 'vue-chartjs'
import transform from '@/netrunnerTransformations.js'

export default {
  extends: Line,
  name: 'FactionPopularity',
  props: {
    metaData: Object,
    factions: Object,
    sideCode: String,
    stacked: Boolean
  },
  data: function () {
    return {
      hiddenStates: Object.keys(this.factions).reduce((attrs, key) => ({ ...attrs, [key]: false }), {}), // which dataset is hidden
      // chart options
      options: {
        maintainAspectRatio: false,
        responsive: true,
        animation: false,
        legend: {
          display: true,
          onClick: this.updateVisibility
        },
        scales: {
          yAxes: [{
            stacked: this.stacked,
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
      const factioncode = Object.keys(this.factions)[legendItem.datasetIndex]
      this.$set(this.hiddenStates, factioncode, !this.hiddenStates[factioncode]) // change visibility with Vue reactivity
      this.renderChart(this.chartdata, this.options)
    },
    getFactionPopularity: function (factioncode) {
      console.log(this.factionMetaDataOrdered.map(meta => meta.reduce((sum, current) => sum + current.used, 0)))
      return this.factionMetaDataOrdered.map(meta => ((meta.find(faction => faction.code === factioncode).used / meta.reduce((sum, current) => sum + current.used, 0)) * 100).toFixed(1))
    }
  },
  watch: {
    stacked: function (newValue, OldValue) {
      this.options.scales.yAxes[0].stacked = newValue
      this.options.scales.yAxes[0].ticks.max = newValue ? 100 : undefined
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
      for (const [factioncode, faction] of Object.entries(this.factions)) {
        results.datasets.push({
          data: this.getFactionPopularity(factioncode),
          label: faction + ' popularity',
          backgroundColor: transform.factionCodeToColor(factioncode),
          borderWidth: 2,
          fill: this.stacked,
          hidden: this.hiddenStates[factioncode],
          borderColor: transform.factionCodeToColor(factioncode),
          pointBackgroundColor: transform.factionCodeToColor(factioncode),
          pointRadius: 2,
          datalabels: {
            display: false
          }
        })
      }
      return results
    }
  }
}
</script>
