<template>
  <div>
    <v-card>
      <v-card-title class="d-md-none">Popularity</v-card-title>
      <v-card-text class="text-center">
        <v-row>
          <v-col col="6">
            <div ref="chart"/>
          </v-col>
          <v-col col="6">
            <v-simple-table v-if="sideData" style="max-width: 350px; margin: 0 auto" class="pt-2">
              <tbody>
                <tr v-for="(identity, index) in sideData" :key="identity.title">
                  <td v-if="index < showMax">
                    <v-img :src="'https://alwaysberunning.net/img/ids/'+identity.code+'.png'" height="40px" width="40px"/>
                  </td>
                  <td class="text-left" v-if="index < showMax">
                    {{ shortenIdentity(identity.title) }}
                  </td>
                  <td class="text-right" v-if="index < showMax">{{ Math.round((identity.used / factionSum)*1000)/10 }}%</td>
                </tr>
              </tbody>
            </v-simple-table>
            <v-btn class="mt-4" @click="showMax = showMax + change" v-if="showMax < sideData.length">More</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
<script>
export default {
  name: 'IdentityFactionPopularity',
  props: {
    side: String,
    sideData: Array
  },
  data: () => ({
    showMax: 6,
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
    shortenIdentity: function (title) {
      if (title.indexOf('Haas-Bioroid') > -1 || title.indexOf('Jinteki') > -1 || title.indexOf('NBN') > -1 || title.indexOf('Weyland Consortium') > -1) {
        return title.substring(title.indexOf(':') + 1)
      }
      return title.substring(0, title.indexOf(':'))
    },
    drawChart: function () {
    }
  }
}
</script>
