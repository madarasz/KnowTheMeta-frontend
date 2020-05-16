<script>
import { Pie } from 'vue-chartjs'
import transform from '@/netrunnerTransformations.js'
export default {
  extends: Pie,
  name: 'PopularityChart',
  props: {
    metaData: Array
  },
  data: () => ({
    options: {
      legend: {
        display: false
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
          data: this.metaData.map(x => { return x.used }),
          backgroundColor: this.metaData.map(x => { return transform.factionCodeToColor(x.faction) }),
          borderWidth: 2
        }]
      }
    }
  }
}
</script>
