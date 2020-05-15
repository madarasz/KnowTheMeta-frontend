<script>
import { HorizontalBar } from 'vue-chartjs'
import transform from '@/netrunnerTransformations.js'
export default {
  extends: HorizontalBar,
  name: 'WinRateChart',
  props: {
    metaData: Array
  },
  data: () => ({
    options: {
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
    this.renderChart(this.chartdata, this.options)
  },
  methods: {
  },
  computed: {
    chartdata: function () {
      return {
        labels: this.metaData.map(x => { return transform.shortestIdentity(x.title) }),
        datasets: [{
          data: this.metaData.map(x => { return transform.winrate(x) }),
          backgroundColor: this.metaData.map(x => { return transform.factionCodeToColor(x.faction) })
        }]
      }
    }
  }
}
</script>
