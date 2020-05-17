<script>
import { Pie } from 'vue-chartjs'
import transform from '@/netrunnerTransformations.js'
export default {
  extends: Pie,
  name: 'PopularityChart',
  props: {
    metaData: Array,
    maxEntries: { // show first n values, group everything else into "other" entry
      type: Number,
      default: 1000
    }
  },
  data: function () {
    return {
      options: {
        animation: false,
        legend: {
          display: false
        }
      },
      maxEntriesInternal: this.maxEntries
    }
  },
  mounted () {
    this.renderChart(this.chartdata, this.options)
  },
  methods: {
  },
  watch: { // hack, prop change does not trigger computed to change
    maxEntries: function () {
      this.maxEntriesInternal = this.maxEntries
      this.renderChart(this.chartdata, this.options)
    }
  },
  computed: {
    groupedData: function () {
      const values = []
      let otherValue = 0
      for (let i = 0; i < this.metaData.length; i++) {
        if (i < this.maxEntriesInternal) {
          values.push({
            title: transform.shortestIdentity(this.metaData[i].title),
            used: this.metaData[i].used,
            color: transform.factionCodeToColor(this.metaData[i].faction)
          })
        } else {
          otherValue += this.metaData[i].used
        }
      }
      if (otherValue > 0) {
        values.push({ title: 'other', used: otherValue, color: '#aaa' })
      }
      return values
    },
    chartdata: function () {
      return {
        labels: this.groupedData.map(x => { return x.title }),
        datasets: [{
          data: this.groupedData.map(x => { return x.used }),
          backgroundColor: this.groupedData.map(x => { return x.color }),
          borderWidth: 2
        }]
      }
    }
  }
}
</script>
