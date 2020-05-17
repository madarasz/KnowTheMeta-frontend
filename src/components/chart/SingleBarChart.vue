<script>
import { HorizontalBar } from 'vue-chartjs'
export default {
  extends: HorizontalBar,
  name: 'SingleBarChart',
  props: {
    color: String,
    title: String,
    value: Number,
    max: Number
  },
  data: () => ({
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: 0
      },
      legend: {
        display: false
      },
      scales: {
        yAxes: [{
          display: false
        }],
        xAxes: [{
          display: false,
          ticks: {
            beginAtZero: true,
            suggestedMax: 100,
            stepSize: 1
          }
          // offset: false
        }]
      },
      tooltips: {
        enabled: false // TODO: enable
      }
    }
  }),
  mounted () {
    this.options.scales.xAxes[0].ticks.suggestedMax = this.max
    this.renderChart(this.chartdata, this.options)
  },
  methods: {
  },
  computed: {
    chartdata: function () {
      return {
        labels: [this.title],
        datasets: [{
          data: [this.value],
          backgroundColor: [this.color],
          barThickness: 32,
          barPercentage: 1,
          categoryPercentage: 1
        }]
      }
    }
  }
}
</script>
