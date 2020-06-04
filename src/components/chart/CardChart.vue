<script>
import { Line } from 'vue-chartjs'
import * as annotation from 'chartjs-plugin-annotation'
import * as pluginErrorBars from 'chartjs-plugin-error-bars'
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
        plugins: [annotation, pluginErrorBars],
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
              suggestedMin: 0,
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
              const label = data.datasets[tooltipItem.datasetIndex].label + ': ' + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + '%'
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
    // generates a single chart annotation
    generateAnnotation ({ value, backgroundColor, label, fontStyle, yAdjust, isDataOnBorder }) {
      const annotation = {
        drawTime: 'beforeDatasetsDraw',
        type: 'line',
        mode: 'vertical',
        scaleID: 'x-axis-0',
        value: value,
        borderWidth: 0,
        borderColor: 'rgba(0,0,0,0)', // hide completely
        label: {
          backgroundColor: backgroundColor,
          content: label,
          enabled: true,
          xAdjust: isDataOnBorder * (15 + 2.5 * label.length) // move label if it's the last or first meta
        }
      }
      if (fontStyle) annotation.label.fontStyle = fontStyle
      if (yAdjust) annotation.label.yAdjust = yAdjust
      return annotation
    },
    // calculates all the annotations
    getAnnotations: function () {
      const annotations = []
      const lowDataErrorThreshold = 7 // popularity below this will be flagged as "low data"
      const metaDataArray = Object.entries(this.metaData)

      // iterate on metas
      for (let i = 0; i < this.metaList.length; i++) {
        const mwlName = this.metaList[i].mwl
        const mwl = this.mwl.find(x => { return x.name === mwlName })
        const metaTitle = this.metaList[i].title

        // metaData might be not available if a card was recently created
        if (this.metaData[metaTitle]) {
          const used = this.metaData[metaTitle].used
          const isDataOnBorder = i === 0 ? -1 : (i === this.metaList.length - 1 ? 1 : 0)
          const winrateError = transform.winrateError(metaDataArray[i][1])
          const winrate = transform.winrate(metaDataArray[i][1])

          // low data
          if ((winrateError > lowDataErrorThreshold * 1.5 ||
              winrate > 99 || winrate < 1) && // when all the decks are winning or losing
              used > 0) {
            this.setLowDataWarning(this.cardTitle)
            annotations.push(this.generateAnnotation({
              value: this.metaList[i].title,
              backgroundColor: '#B56503',
              label: 'very low data',
              fontStyle: 'italic',
              yAdjust: 70,
              isDataOnBorder
            }))
          } else if (winrateError > lowDataErrorThreshold && used > 0) {
            this.setLowDataWarning(this.cardTitle)
            annotations.push(this.generateAnnotation({
              value: this.metaList[i].title,
              backgroundColor: '#B56503',
              label: 'low data',
              fontStyle: 'italic',
              yAdjust: 70,
              isDataOnBorder
            }))
          }
          // banned
          if (this.cardTitle in mwl.banned) {
            this.metaData[this.metaList[i].title].used = NaN // remove entry from popularity
            annotations.push(this.generateAnnotation({
              value: this.metaList[i].title,
              backgroundColor: '#ff5252',
              label: 'Banned',
              isDataOnBorder
            }))
          }
          // restricted
          if (this.cardTitle in mwl.restricted) {
            annotations.push(this.generateAnnotation({
              value: this.metaList[i].title,
              backgroundColor: '#fb8c00',
              label: 'Restricted',
              isDataOnBorder
            }))
          }
        }
      }
      return annotations
    },
    ...mapMutations({
      setLowDataWarning: 'cards/setLowDataWarning'
    })
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
      }
      return result
    },
    // chart data
    chartdata: function () {
      const side = this.isRunner ? 'runner' : 'corp'
      const avgProp = this.isIdentity ? 'WinRate' : 'DeckWinRate'
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
            label: transform.shortenIdentity(this.cardTitle) + ' win rate',
            fill: false
          },
          {
            // average side/side-deck winrates
            data: this.metaList.map(x => { return (x[side + avgProp] * 100).toFixed(1) }).reverse().slice(0, Object.keys(this.metaData).length),
            borderColor: 'rgba(170,113,34,0.5)',
            backgroundColor: 'rgba(170,113,34,1)',
            borderWidth: 2,
            borderDash: [6, 4],
            label: 'avg. ' + side + (this.isIdentity ? ' win rate' : ' deck win rate'),
            fill: false
          },
          {
            // popularity
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
