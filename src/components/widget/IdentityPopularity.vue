<template>
  <v-row>
    <!-- Chart -->
    <v-col cols="6" class="col-lg-4 offset-3 offset-sm-0 offset-md-3 offset-lg-1">
      <popularity-chart :meta-data="sideData" :max-entries="showMax" :chart-id="'chart-popularity-' + side"/>
    </v-col>
    <!-- Table -->
    <v-col cols="12" class="col-sm-6 col-md-12 col-lg-6 text-center">
      <v-simple-table v-if="sideData" style="max-width: 350px; margin: 0 auto" class="pt-2 pop-table" :data-testid="'table-popularity-' + side">
        <tbody>
          <tr v-for="(identity, index) in sideData" :key="identity.title">
            <td v-if="index < showMax">
              <v-img :src="'https://alwaysberunning.net/img/ids/'+identity.code+'.png'" height="30px" width="30px"
                :lazy-src="'/img/' + side + '-color.png'"/>
            </td>
            <td class="text-left" v-if="index < showMax">
              <router-link :to="cardUrl(identity)">{{ shortenIdentity(identity.title) }}</router-link>
            </td>
            <td class="text-right" v-if="index < showMax">{{ (identity.used / standingCount * 200).toFixed(1) }}%</td>
          </tr>
        </tbody>
      </v-simple-table>
      <v-btn class="mt-4" @click="changeListed(change)" v-if="showMax < sideData.length" :data-testid="'button-pop-more-'+side">More</v-btn>
      <v-btn class="mt-4 ml-2" @click="changeListed(-change)" v-if="showMax > 10" :data-testid="'button-pop-less-'+side">Less</v-btn>
    </v-col>
  </v-row>
</template>

<script>
import PopularityChart from '@/components/chart/PopularityChart.vue'
import transform from '@/netrunnerTransformations.js'

export default {
  name: 'IdentityFactionPopularity',
  props: {
    side: String,
    sideData: Array,
    standingCount: Number
  },
  components: {
    PopularityChart
  },
  data: () => ({
    showMax: 10,
    change: 6
  }),
  mounted () {
  },
  methods: {
    shortenIdentity: transform.shortenIdentity,
    changeListed: function (change) {
      this.showMax = this.showMax + change
      // fire analytics event
      this.$ga.event({
        eventCategory: 'UI',
        eventAction: change > 0 ? 'more-identities' : 'less-identities',
        eventLabel: this.side
      })
    },
    cardUrl: function (card) {
      return transform.cardUrl(card)
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
