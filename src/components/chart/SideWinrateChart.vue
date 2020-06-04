<script>
import { HorizontalBar } from 'vue-chartjs'
import * as annotation from 'chartjs-plugin-annotation'

export default {
  extends: HorizontalBar,
  name: 'SideWinrateChart',
  props: {
    runnerWin: Number,
    corpWin: Number,
    draw: Number
  },
  data: () => ({
    options: {
      maintainAspectRatio: false,
      plugins: [annotation],
      annotation: {
        drawTime: 'afterDatasetsDraw',
        events: [],
        annotations: [{
          drawTime: 'afterDatasetsDraw',
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: '50',
          borderColor: 'grey',
          borderDash: [6, 4],
          borderWidth: 3
        }]
      },
      layout: {
        padding: 0
      },
      legend: {
        display: true,
        onClick: (e) => e.stopPropagation() // turn click function off
      },
      scales: {
        xAxes: [{
          stacked: true,
          ticks: {
            callback: function (value, index, values) {
              return value + '%'
            }
          }
        }],
        yAxes: [{
          display: false,
          stacked: true
        }]
      },
      tooltips: {
        enabled: true,
        callbacks: {
          label: function (tooltipItem, data) {
            return data.datasets[tooltipItem.datasetIndex].label + ': ' + data.datasets[tooltipItem.datasetIndex].data[0] + '%'
          }
        }
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
      const datasets = [
        {
          label: 'runner',
          data: [Math.round(this.runnerWin * 1000) / 10],
          backgroundColor: ['#FF0000'],
          barThickness: 32,
          barPercentage: 1,
          categoryPercentage: 1
        },
        {
          label: 'draw',
          data: [Math.round(this.draw * 1000) / 10],
          backgroundColor: ['#AAAAAA'],
          barThickness: 32,
          barPercentage: 1,
          categoryPercentage: 1
        },
        {
          label: 'corporation',
          data: [Math.round(this.corpWin * 1000) / 10],
          backgroundColor: ['#0000FF'],
          barThickness: 32,
          barPercentage: 1,
          categoryPercentage: 1
        }
      ]
      // remove draw part if draw < 0.005
      if (this.draw < 0.005) {
        datasets.splice(1, 1)
      }
      return {
        labels: ['side winrate'],
        datasets: datasets
      }
    }
  }
}
</script>
