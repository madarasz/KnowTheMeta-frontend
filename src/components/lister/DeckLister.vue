<template>
  <div>
    <v-simple-table :data-testid="testId">
      <tbody>
        <tr v-for="(deck, index) in deckList" :key="deck.id" :data-testid="`${testId}-row-${index}`">
          <td v-if="index < showMax">
            <v-img height="40px" width="40px" :src="'https://alwaysberunning.net/img/ids/' + deck.identityCode + '.png'"
              :lazy-src="'/img/' + side + '-color.png'"/>
          </td>
          <td v-if="index < showMax">
            <v-row dense>
              <v-col class="pa-0">
                <a :href="`https://netrunnerdb.com/en/decklist/${deck.id}`">{{ deck.title }}</a>
                by
                <strong><em>{{ deck.player }}</em></strong>
              </v-col>
            </v-row>
            <!-- <v-row dense>
              <v-col class="pa-0" v-html="deck.rankSummary" style="font-size: 80%"/>
            </v-row> -->
            <v-row dense>
              <v-col class="pa-0 pb-1" style="line-height: 1.2em">
                <small><em>{{ deck.deckSummary }}</em></small>
              </v-col>
            </v-row>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
    <div class="text-center">
      <v-btn class="mt-4" @click="changeListed(change)" v-if="showMax < deckList.length" :data-testid="'button-pop-more-'+side">More</v-btn>
      <v-btn class="mt-4 ml-2" @click="changeListed(-change)" v-if="showMax > 10" :data-testid="'button-pop-less-'+side">Less</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeckLister',
  props: {
    deckList: Array,
    testId: String,
    side: String,
    meta: String
  },
  data: () => ({
    showMax: 10,
    change: 6
  }),
  mounted: function () {
    this.showMax = localStorage[`showdecks-${this.meta}-${this.side}`] || 10
    this.showMax = parseInt(this.showMax)
  },
  methods: {
    changeListed: function (change) {
      this.showMax = this.showMax + change
      localStorage[`showdecks-${this.meta}-${this.side}`] = this.showMax
      // fire analytics event
      this.$ga.event({
        eventCategory: 'UI',
        eventAction: change > 0 ? 'more-decks' : 'less-decks',
        eventLabel: this.side
      })
    }
  }
}
</script>
