<script>
import { HorizontalBar } from 'vue-chartjs'
import * as pluginErrorBars from 'chartjs-plugin-error-bars'
import transform from '@/netrunnerTransformations.js'
export default {
  extends: HorizontalBar,
  name: 'WinRateChart',
  props: {
    metaData: Array
  },
  data: () => ({
    options: {
      plugins: [pluginErrorBars],
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: '%'
          },
          ticks: {
            beginAtZero: true
          },
          pointlabels: {
            callback: function (value) {
              return (value / 100).toLocaleString('de-DE', { style: 'percent' })
            }
          }
        }]
      }
    }
  }),
  mounted () {
    this.options.scales.xAxes[0].ticks.suggestedMax = this.errordata.maxValue
    this.renderChart(this.chartdata, this.options)
  },
  methods: {
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
          backgroundColor: this.metaData.map(x => { return transform.factionCodeToColor(x.faction) }),
          errorBars: this.errordata.errors,
          borderColor: 'rgba(0, 0, 0, 0.3)' // error bar color
        }]
      }
    }
  }
}
</script>
