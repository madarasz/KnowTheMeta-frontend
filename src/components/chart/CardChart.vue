<script>
import { Line } from 'vue-chartjs'
import * as annotation from 'chartjs-plugin-annotation'
import transform from '@/netrunnerTransformations.js'
export default {
  extends: Line,
  name: 'CardChart',
  props: {
    metaData: Object,
    metaList: Array,
    mwl: Array,
    isRunner: Boolean,
    isIdentity: Boolean,
    cardTitle: String
  },
  data: function () {
    return {
      options: {
        plugins: [annotation],
        annotation: {
          drawTime: 'afterDatasetsDraw',
          events: [],
          annotations: this.getAnnotations()
        },
        maintainAspectRatio: false,
        responsive: true,
        animation: false,
        legend: {
          display: true
        },
        scales: {
          yAxes: [{
            ticks: {
              suggestedMin: 0
            }
          }]
        },
        tooltips: {
          enabled: true,
          callbacks: {
            label: function (tooltipItem, data) {
              console.log(tooltipItem, data)
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
  methods: {
    getAnnotations: function () {
      const annotations = []
      const deckProp = this.isRunner ? 'runnerDecks' : 'corpDecks'
      const lowDataThreshold = 0.05 // popularity below this will be flagged as "low data"
      for (let i = 0; i < this.metaList.length; i++) {
        const mwlName = this.metaList[i].mwl
        const mwl = this.mwl.find(x => { return x.name === mwlName })
        const metaTitle = this.metaList[i].title
        const used = this.metaData[metaTitle].used
        // low data
        if ((used / this.metaList[i][deckProp]) < lowDataThreshold && used > 0) {
          annotations.push({
            drawTime: 'beforeDatasetsDraw',
            type: 'line',
            mode: 'vertical',
            scaleID: 'x-axis-0',
            value: this.metaList[i].title,
            borderWidth: 0,
            borderColor: 'rgba(0,0,0,0)', // hide completely
            label: {
              backgroundColor: 'orange',
              content: 'low data',
              enabled: true,
              fontStyle: 'italic',
              yAdjust: 70,
              xAdjust: i === 0 ? -35 : (i === this.metaList.length - 1 ? 35 : 0) // move label if it's the last or first meta
            }
          })
        }
        // banned
        if (this.cardTitle in mwl.banned) {
          annotations.push({
            drawTime: 'beforeDatasetsDraw',
            type: 'line',
            mode: 'vertical',
            scaleID: 'x-axis-0',
            value: this.metaList[i].title,
            borderWidth: 0,
            borderColor: 'rgba(0,0,0,0)', // hide completely
            label: {
              backgroundColor: '#ff5252',
              content: 'Banned',
              enabled: true,
              xAdjust: i === 0 ? -30 : (i === this.metaList.length - 1 ? 30 : 0) // move label if it's the last or first meta
            }
          })
        }
        // restricted
        if (this.cardTitle in mwl.restricted) {
          annotations.push({
            drawTime: 'beforeDatasetsDraw',
            type: 'line',
            mode: 'vertical',
            scaleID: 'x-axis-0',
            value: this.metaList[i].title,
            borderWidth: 0,
            borderColor: 'rgba(0,0,0,0)', // hide completely
            label: {
              backgroundColor: '#fb8c00',
              content: 'Restricted',
              enabled: true,
              xAdjust: i === 0 ? -40 : (i === this.metaList.length - 1 ? 40 : 0) // move label if it's the last or first meta
            }
          })
        }
      }
      return annotations
    }
  },
  computed: {
    metaTotalCounts: function () {
      if (this.isIdentity) {
        // for identities, we count standings instead of decks
        return Object.fromEntries(this.metaList.map(x => { return [x.title, x.standings / 2] }))
      }
      const deckProp = this.isRunner ? 'runnerDecks' : 'corpDecks'
      return Object.fromEntries(this.metaList.map(x => { return [x.title, x[deckProp]] }))
    },
    chartdata: function () {
      const side = this.isRunner ? 'runner' : 'corp'
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
            data: this.metaList.map(x => { return (x[side + 'WinRate'] * 100).toFixed(1) }).reverse(),
            borderColor: 'rgba(186,85,211,0.5)',
            backgroundColor: 'rgba(186,85,211,1)',
            borderWidth: 2,
            borderDash: [6, 4],
            label: 'avg. ' + side + ' winrate',
            fill: false
          },
          {
            data: Object.entries(this.metaData).map(x => { return (x[1].used / this.metaTotalCounts[x[0]] * 100).toFixed(1) }).reverse(),
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
