<script>
import { Line } from 'vue-chartjs'
import * as pluginErrorBars from 'chartjs-plugin-error-bars'
import * as pluginDataLabels from 'chartjs-plugin-datalabels'
import transform from '@/netrunnerTransformations.js'
import { mapMutations } from 'vuex'

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
      // chart options
      options: {
        plugins: [pluginErrorBars, pluginDataLabels],
        datalabels: {
          formatter: function (value, context) {
            return ' '
          }
        },
        maintainAspectRatio: false,
        responsive: true,
        animation: false,
        legend: {
          display: true,
          labels: {
            filter: function (legendItem, data) {
              return legendItem.datasetIndex !== 3 // hide legend for last item
            }
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              suggestedMin: 0,
              callback: function (value, index, values) {
                return value + '%'
              }
            }
          }],
          xAxes: [{
            offset: Object.keys(this.metaData).length === 1
          }]
        },
        tooltips: {
          enabled: true,
          callbacks: {
            label: function (tooltipItem, data) {
              const label = data.datasets[tooltipItem.datasetIndex].label + ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + '%'
              if (tooltipItem.datasetIndex === 3) {
                return '' // filler data set, to be hidden
              }
              if (tooltipItem.datasetIndex === 0) {
                // display standard error as well for winrate
                return label + ' (+/-' + data.datasets[0].errorBars[data.labels[tooltipItem.index]].plus.toFixed(1) + '%)'
              }
              return label
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
    ...mapMutations({
      setLowDataWarning: 'cards/setLowDataWarning'
    })
  },
  watch: {
    // redraw chart if label rotation changes. this is to rotate restricted/banned tags as well
    labelRotation: function (val) {
      this.renderChart(this.chartdata, this.options)
    }
  },
  computed: {
    // number of data items. for identities it's number of standings; for non-identity cards it's number of decks
    metaTotalCounts: function () {
      if (this.isIdentity) {
        // for identities, we count standings instead of decks
        return Object.fromEntries(this.metaList.map(x => { return [x.title, x.standings / 2] }))
      }
      const deckProp = this.isRunner ? 'runnerDecks' : 'corpDecks'
      return Object.fromEntries(this.metaList.map(x => { return [x.title, x[deckProp]] }))
    },
    // calculate error bars for win rates
    winrateErrorBars: function () {
      const result = {}
      const metaDataArray = Object.entries(this.metaData)
      for (let i = 0; i < metaDataArray.length; i++) {
        const stdError = transform.winrateError(metaDataArray[i][1])
        const winrate = transform.winrate(metaDataArray[i][1])
        result[metaDataArray[i][0]] = {
          // not going above 100% and below 0%
          plus: winrate < 100 ? stdError : 0,
          minus: winrate > 0 ? -stdError : 0
        }
        if (stdError > 7 || stdError === 0) {
          this.setLowDataWarning(this.cardTitle)
        }
      }
      return result
    },
    // get banned/restricted data
    isBannedRestricted: function () {
      if (!this.mwl) return []
      const result = []
      const metaDataArray = Object.entries(this.metaData)
      for (let i = 0; i < metaDataArray.length; i++) {
        const metaTitle = metaDataArray[i][0]
        const mwlName = this.metaList.find(x => { return x.title === metaTitle }).mwl
        const mwl = this.mwl.find(x => { return x.name === mwlName })
        if (this.cardTitle in mwl.banned) result.push('banned')
        else if (this.cardTitle in mwl.restricted) result.push('restricted')
        else result.push('')
      }
      return result.reverse()
    },
    // get x-axis label rotation of chart
    labelRotation: function () {
      if (this.$data._chart) {
        return this.$data._chart.scales['x-axis-0'].labelRotation
      }
      return 0
    },
    // chart data
    chartdata: function () {
      const side = this.isRunner ? 'runner' : 'corp'
      const sideColor = this.isRunner ? '255,0,0' : '0,0,255'
      const avgProp = this.isIdentity ? 'WinRate' : 'DeckWinRate'
      const cardTitle = this.isIdentity ? transform.shortenIdentity(this.cardTitle) : this.cardTitle
      return {
        labels: Object.entries(this.metaData).map(x => { return x[0] }).reverse().slice(0, Object.keys(this.metaData).length),
        datasets: [
          {
            // win rates
            data: Object.entries(this.metaData).map(x => { return transform.winrate(x[1]) }).reverse(),
            errorBars: this.winrateErrorBars,
            borderColor: 'rgba(186,85,211,1)',
            backgroundColor: 'rgba(186,85,211,1)',
            borderWidth: 2,
            label: cardTitle + ' win rate',
            fill: false,
            datalabels: {
              display: false
            }
          },
          {
            // average side/side-deck winrates
            data: this.metaList.map(x => { return (x[side + avgProp] * 100).toFixed(1) }).reverse().slice(0, Object.keys(this.metaData).length),
            borderColor: `rgba(${sideColor},0.3)`,
            backgroundColor: `rgba(${sideColor},1)`,
            borderWidth: 2,
            borderDash: [6, 4],
            label: 'avg. ' + side + (this.isIdentity ? ' win rate' : ' deck win rate'),
            fill: false,
            datalabels: {
              display: false
            }
          },
          {
            // popularity
            data: Object.entries(this.metaData).map(x => { return (x[1].used / this.metaTotalCounts[x[0]] * 100).toFixed(1) }).reverse(),
            errors: this.metaList.map(x => { return this.winrateErrorBars[x.title] }).slice(0, Object.keys(this.metaData).length).reverse(), // for low data labels
            borderColor: 'rgba(0,128,128,1)',
            backgroundColor: 'rgba(0,128,128,1)',
            label: 'popularity',
            fill: false,
            datalabels: {
              color: '#FFF',
              backgroundColor: function (context) {
                const error = context.dataset.errors[context.dataIndex].plus - context.dataset.errors[context.dataIndex].minus
                if (error > 14 || (error === 0 && context.dataset.data[context.dataIndex] > 0)) return '#B56503'
                return 'rgba(0,0,0,0)'
              },
              align: 'end',
              anchor: 'end',
              offset: 7,
              padding: 5,
              borderRadius: 5,
              font: {
                style: 'italic'
              },
              clamp: true,
              formatter: function (value, context) {
                const error = context.dataset.errors[context.dataIndex].plus - context.dataset.errors[context.dataIndex].minus
                if (error > 28 || error === 0) return 'very low data'
                if (error > 14) return 'low data'
                return ''
              }
            }
          },
          {
            // just a filler for labeling x axes
            data: Array(Object.keys(this.metaData).length).fill(0),
            dataLabels: this.isBannedRestricted,
            borderColor: 'rgba(0,0,0,0)',
            backgroundColor: 'rgba(0,0,0,0)',
            label: 'filler',
            fill: false,
            datalabels: {
              color: '#FFF',
              backgroundColor: function (context) {
                const label = context.dataset.dataLabels[context.dataIndex]
                if (label === 'restricted') return '#fb8c00'
                if (label === 'banned') return '#ff5252'
                return 'rgba(0,0,0,0)'
              },
              align: this.labelRotation !== 0 ? 180 - this.labelRotation : 'left',
              anchor: 'center',
              offset: this.labelRotation !== 0 ? 5 : 5,
              padding: 1,
              rotation: -this.labelRotation,
              borderRadius: 5,
              font: {
                style: 'italic'
              },
              clamp: true,
              formatter: function (value, context) {
                return context.dataset.dataLabels[context.dataIndex]
              }
            }
          }
        ]
      }
    }
  }
}
</script>
