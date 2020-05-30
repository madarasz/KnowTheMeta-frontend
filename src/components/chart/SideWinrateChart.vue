<script>
import { HorizontalBar } from 'vue-chartjs'
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
      layout: {
        padding: 0
      },
      legend: {
        display: true
      },
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          display: false,
          stacked: true
        }]
      },
      tooltips: {
        enabled: true // TODO: enable
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
        labels: ['side winrate'],
        datasets: [
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
      }
    }
  }
}
</script>
