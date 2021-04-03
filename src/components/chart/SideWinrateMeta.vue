<script>
import { Line } from 'vue-chartjs'
import * as datalabels from 'chartjs-plugin-datalabels' // eslint-disable-line no-unused-vars

export default {
  extends: Line,
  name: 'SideWinrateMeta',
  props: {
    metaData: Object
  },
  data: function () {
    return {
      // chart options
      options: {
        plugins: {
          datalabels: {
            color: 'white',
            // adjust labels alignment for first and last item
            align: function (context) {
              if (context.dataIndex === 0) {
                if (context.datasetIndex === 1) return 240
                return 260
              }
              if (context.dataIndex === context.dataset.data.length - 1) return 290
              return 270
            },
            offset: -100,
            anchor: 'center',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: 'white',
            formatter: function (value, context) {
              return value + '%'
            }
          }
        },
        maintainAspectRatio: false,
        responsive: true,
        animation: false,
        legend: {
          display: true
        },
        scales: {
          yAxes: [{
            stacked: true,
            ticks: {
              suggestedMin: 0,
              suggestedMax: 100,
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
  computed: {
    chartdata: function () {
      return {
        labels: this.metaData.metaList.map(x => x.title).reverse(),
        datasets: [
          {
            data: this.metaData.metaList.map(x => (x.runnerWinRate * 100).toFixed(1)).reverse(),
            borderColor: 'rgba(255,0,0,1)',
            backgroundColor: 'rgba(255,0,0,0.3)',
            borderWidth: 0,
            label: 'runner win rate',
            datalabels: {
              backgroundColor: 'rgba(255,0,0,0.9)'
            }
          },
          {
            data: this.metaData.metaList.map(x => ((1 - x.runnerWinRate - x.corpWinRate) * 100).toFixed(1)).reverse(),
            borderColor: 'rgba(100,100,100,1)',
            backgroundColor: 'rgba(100,100,100,0.5)',
            borderWidth: 0,
            label: 'draw',
            datalabels: {
              display: function (context) {
                return false
                // if (!context || !context.dataset) return false
                // return context.dataset.data[context.dataIndex] > 0.05
              },
              offset: -40,
              backgroundColor: 'rgba(100,100,100,0.9)'
            }
          },
          {
            data: this.metaData.metaList.map(x => (x.corpWinRate * 100).toFixed(1)).reverse(),
            borderColor: 'rgba(0,0,255,1)',
            backgroundColor: 'rgba(0,0,255,0.3)',
            borderWidth: 0,
            label: 'corporation win rate',
            datalabels: {
              backgroundColor: 'rgba(0,0,255,0.9)'
            }
          }
        ]
      }
    }
  }
}
</script>
