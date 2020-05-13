<script>
import { Pie } from 'vue-chartjs'
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
  computed: {
    chartdata: function () {
      return {
        labels: this.metaData.map(x => { return x.title }),
        datasets: [{
          data: this.metaData.map(x => { return x.used }),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderWidth: 2
        }]
      }
    }
  }
}
</script>
