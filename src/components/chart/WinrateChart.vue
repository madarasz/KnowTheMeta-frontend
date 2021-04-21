<script>
import { HorizontalBar } from 'vue-chartjs'
import * as pluginErrorBars from 'chartjs-plugin-error-bars'
import * as pluginDataLabels from 'chartjs-plugin-datalabels'
import transform from '@/netrunnerTransformations.js'
export default {
  extends: HorizontalBar,
  name: 'WinRateChart',
  props: {
    metaData: Array
  },
  data: () => ({
    options: {
      animation: false,
      responsive: true,
      maintainAspectRatio: false,
      plugins: [pluginErrorBars, pluginDataLabels],
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          ticks: {
            beginAtZero: true,
            callback: function (value, index, values) {
              return value + '%'
            }
          }
        }]
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            return data.datasets[0].tooltips[tooltipItem.index]
          }
        }
      }
    }
  }),
  mounted () {
    this.renderData()
  },
  methods: {
    renderData: function () {
      this.options.scales.xAxes[0].ticks.suggestedMax = this.errordata.maxValue
      this.renderChart(this.chartdata, this.options)
    }
  },
  watch: {
    metaData: function () {
      this.renderData()
    }
  },
  computed: {
    errordata: function () {
      const result = {}
      let maxValue = 0 // maximum of values+error to set chart max
      for (let i = 0; i < this.metaData.length; i++) {
        const stdError = transform.winrateError(this.metaData[i])
        const valuePlusError = transform.winrate(this.metaData[i]) + stdError
        result[transform.shortestIdentity(this.metaData[i].title)] = { plus: stdError, minus: -stdError }
        if (valuePlusError > maxValue) maxValue = valuePlusError
      }
      return { errors: result, maxValue: maxValue }
    },
    chartdata: function () {
      return {
        labels: this.metaData.map(x => { return transform.shortestIdentity(x.title) }),
        datasets: [{
          data: this.metaData.map(x => { return transform.winrate(x) }),
          tooltips: this.metaData.map(x => { return transform.winrate(x) + '% (' + x.wins + '/' + transform.matchCount(x) + ')' }), // store values here, read with tooltip callback later
          backgroundColor: this.metaData.map(x => { return transform.factionCodeToColor(x.faction) }),
          errorBars: this.errordata.errors,
          datalabels: {
            color: '#FFF',
            formatter: function (value, context) {
              return value + '%'
            }
          },
          borderColor: 'rgba(50, 50, 50, 0.6)' // error bar color
        }]
      }
    }
  }
}
</script>
