<script>
import { Line } from 'vue-chartjs'
import transform from '@/netrunnerTransformations.js'
export default {
  extends: Line,
  name: 'CardChart',
  props: {
    metaData: Object,
    metaList: Array,
    isRunner: Boolean
  },
  data: function () {
    return {
      options: {
        maintainAspectRatio: false,
        responsive: true,
        animation: false,
        legend: {
          display: true
        },
        scales: {
          yAxes: [{
            ticks: {
              // suggestedMax: 100,
              suggestedMin: 0
            }
          }]
        }
      }
    }
  },
  mounted () {
    this.renderChart(this.chartdata, this.options)
  },
  methods: {
  },
  computed: {
    metaDeckCounts: function () {
      const deckProp = this.isRunner ? 'runnerDecks' : 'corpDecks'
      return Object.fromEntries(this.metaList.map(x => { return [x.title, x[deckProp]] }))
    },
    chartdata: function () {
      return {
        labels: Object.entries(this.metaData).map(x => { return x[0] }).reverse(),
        datasets: [
          {
            data: Object.entries(this.metaData).map(x => { return transform.winrate(x[1]) }).reverse(),
            borderColor: 'rgba(186,85,211,1)',
            backgroundColor: 'rgba(186,85,211,1)',
            borderWidth: 2,
            label: 'winrate',
            fill: false
          },
          {
            data: Object.entries(this.metaData).map(x => { return (x[1].used / this.metaDeckCounts[x[0]] * 100).toFixed(1) }).reverse(),
            borderColor: 'rgba(0,128,128,1)',
            backgroundColor: 'rgba(0,128,128,1)',
            label: 'popularity',
            fill: false
          }
        ]
      }
    }
  }
}
</script>
