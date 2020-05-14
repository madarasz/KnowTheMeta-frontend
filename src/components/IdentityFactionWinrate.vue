<template>
  <div>
    <v-card>
      <v-card-title class="d-md-none">Win rates</v-card-title>
      <v-card-text class="text-center">
        <v-simple-table class="my-table">
          <tbody>
            <tr v-for="(identity, index) in sortedData" :key="identity.title">
              <td v-if="index < showMax">
                <v-img :src="'https://alwaysberunning.net/img/ids/'+identity.code+'.png'" height="40px" width="40px"/>
              </td>
              <td class="text-left" v-if="index < showMax">
                {{ shortenIdentity(identity.title) }}
              </td>
              <td v-if="index < showMax && maximumValue > 0">
                <single-bar-chart :color="factionCodeToColor(identity.faction)" :title="identity.title" :value="winrate(identity)" :max="maximumValue"
                style="height: 40px; width: 99%"/>
              </td>
              <td class="text-right" v-if="index < showMax" style="max-width: 80px">
                {{ winrate(identity) }}%
              </td>
            </tr>
          </tbody>
        </v-simple-table>
        <v-btn class="mt-4" @click="changeListed(change)" v-if="showMax < sideData.length">More</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
<script>
import SingleBarChart from '@/components/SingleBarChart.vue'
import transform from '@/netrunnerTransformations.js'
export default {
  name: 'IdentityFactionWinRate',
  props: {
    side: String,
    sideData: Array
  },
  components: {
    SingleBarChart
  },
  data: () => ({
    showMax: 6,
    change: 6,
    minimumUsed: 50,
    maximumValue: 0,
    sortedData: []
  }),
  computed: {
    factionSum: function () {
      return this.sideData.reduce((a, b) => { return a + b.used }, 0)
    }
  },
  mounted () {
    this.sortedData = [...this.sideData].filter(x => { return x.used > this.minimumUsed}) // filter out entries below usage
    this.maximumValue = this.sortedData.reduce((a, b) => { return Math.max(a, this.winrate(b))}, 0)
    this.sortedData.sort(transform.compareWinrates)
  },
  methods: {
    shortenIdentity: transform.shortenIdentity,
    winrate: transform.winrate,
    factionCodeToColor: transform.factionCodeToColor,
    changeListed: function (change) {
      console.log(this.$vuetify.breakpoint)
      this.showMax = this.showMax + change
    }
  }
}
</script>
<style scoped>
.my-table tbody tr td {
  padding: 4px;
  border: 0 !important;
}
</style>
