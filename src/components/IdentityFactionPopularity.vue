<template>
  <div>
    <v-card>
      <v-card-title class="d-md-none">Popularity</v-card-title>
      <v-card-text class="text-center">
        <v-row>
          <!-- Chart -->
          <v-col cols="6" class="col-lg-4 offset-3 offset-sm-0 offset-md-3 offset-lg-1">
            <popularity-chart :meta-data="sideData"/>
          </v-col>
          <!-- Table -->
          <v-col cols="12" class="col-sm-6 col-md-12 col-lg-6">
            <v-simple-table v-if="sideData" style="max-width: 350px; margin: 0 auto" class="pt-2 pop-table">
              <tbody>
                <tr v-for="(identity, index) in sideData" :key="identity.title">
                  <td v-if="index < showMax">
                    <v-img :src="'https://alwaysberunning.net/img/ids/'+identity.code+'.png'" height="30px" width="30px"/>
                  </td>
                  <td class="text-left" v-if="index < showMax">
                    {{ shortenIdentity(identity.title) }}
                  </td>
                  <td class="text-right" v-if="index < showMax">{{ Math.round((identity.used / factionSum)*1000)/10 }}%</td>
                </tr>
              </tbody>
            </v-simple-table>
            <v-btn class="mt-4" @click="changeListed(change)" v-if="showMax < sideData.length">More</v-btn>
            <v-btn class="mt-4 ml-2" @click="changeListed(-change)" v-if="showMax > 10">Less</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
<script>
import PopularityChart from '@/components/PopularityChart.vue'
import transform from '@/netrunnerTransformations.js'
export default {
  name: 'IdentityFactionPopularity',
  props: {
    side: String,
    sideData: Array
  },
  components: {
    PopularityChart
  },
  data: () => ({
    showMax: 10,
    change: 6
  }),
  computed: {
    factionSum: function () {
      return this.sideData.reduce((a, b) => { return a + b.used }, 0)
    }
  },
  mounted () {
  },
  methods: {
    shortenIdentity: transform.shortenIdentity,
    changeListed: function (change) {
      console.log(this.$vuetify.breakpoint)
      this.showMax = this.showMax + change
    }
  }
}
</script>

<style scoped>
.pop-table tbody tr td {
  padding: 2px;
  border-bottom: 0 !important;
  height: 36px;
}
</style>
