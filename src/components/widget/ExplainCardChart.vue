<template>
  <v-dialog v-model="chartExplanation" hide-overlay transition="dialog-bottom-transition" v-if="cardStats" scrollable
      :max-width="$vuetify.breakpoint.mdAndUp ? '500px' : ''" :fullscreen="!$vuetify.breakpoint.mdAndUp">
    <!-- Button -->
    <template v-slot:activator="{ on }">
      <v-row>
        <v-col class="text-right pr-8 caption">
          <a v-on="on" data-testid="explain-chart" @click="explain(true)">
            <em>explain this chart</em>&nbsp;
            <v-icon icon class="icon-left">{{ mdiInformation }}</v-icon>
          </a>
        </v-col>
      </v-row>
    </template>
    <!-- Dialog -->
    <v-card data-testid="card-chart-explanation">
      <!-- mobile toolbar -->
      <v-toolbar dark color="primary" v-if="!$vuetify.breakpoint.mdAndUp" max-height="48px" dense>
        <v-btn icon dark @click="explain(false)" data-testid="close-explanation">
            <v-icon>{{ mdiClose }}</v-icon>
        </v-btn>
        <v-toolbar-title>Chart explanation</v-toolbar-title>
      </v-toolbar>
      <!-- axis -->
      <v-card-text class="pa-4">
        <h4>X-axis: metas</h4>
        When a new card pack or a new MWL comes out, the game changes. It is listed as a new meta.
        <h4 class="pt-3">Y-axis: percentage</h4>
        All the values in this graph are measured in percentages.
        <!-- win rate -->
        <h4 class="pt-3">win rate</h4>
        <span v-if="isIdentity">percentage of games won by this identity</span>
        <span v-if="!isIdentity">percentage of games won by decks playing this card</span>
        <!-- win rate error bars -->
        <h4 class="pt-3">win rate - error bars</h4>
        This shows the certainty of the win rate statistics. If there are more data available, then the bar will be narrower and
        the value will be more reliable.
        <v-row dense>
          <v-col cols="auto">
            <v-icon icon class="icon-left">{{ mdiLightbulbOn }}</v-icon>
          </v-col>
          <v-col>
            <v-card outlined class="pa-2 caption font-italic" color="#eeeeee">
              The error bars represent plus/minus one standard error. This is a 68% confidence interval of the win rate.
              If you would double the length of the error bars, it would be a 95% confidence interval.
            </v-card>
          </v-col>
        </v-row>
        <!-- avg win rate -->
        <div v-if="isIdentity">
          <h4 class="pt-3">avg. {{ sideString }} win rate</h4>
          percentage of games won by all {{ sideString }}s
        </div>
        <div v-if="!isIdentity">
          <h4 class="pt-3">avg. {{ sideString }} deck win rate</h4>
          percentage of games won by {{ sideString }}s <u>providing a decklist</u>
          <v-row dense>
            <v-col cols="auto">
              <v-icon icon class="icon-left">{{ mdiLightbulbOn }}</v-icon>
            </v-col>
            <v-col>
              <v-card outlined class="pa-2 caption font-italic" color="#eeeeee">
                Not all players provide their decklist. It seems successful decks are more likely to be provided. That is why
                <strong>avg. {{ sideString }} <u>deck</u> win rate</strong> tends to be ~7-12% higher than the actual <strong>avg. {{ sideString }} win rate</strong>.
              </v-card>
            </v-col>
          </v-row>
        </div>
        <!-- popularity -->
        <h4 class="pt-3">popularity</h4>
        <span v-if="isIdentity">percentage of players playing this identity</span>
        <span v-if="!isIdentity">percentage of players having this card in their {{ sideString }} deck</span>
        <!-- comparing -->
        <h4 class="pt-3">comparing "{{ isIdentity ? 'identity' : 'card'}} win rate" with "average {{ sideString }} {{ isIdentity ? '' : 'deck'}} win rate"</h4>
        If the "{{ isIdentity ? 'identity' : 'card'}} win rate" is higher than the "average {{ sideString }} {{ isIdentity ? '' : 'deck'}} win rate",
        then the {{ isIdentity ? 'identity' : 'card'}} is probably strong. Look at the difference and the win rate error bars.
        <!-- mwl warning -->
        <div v-if="cardStats.mwlWarning" data-testid="mwlWarning">
          <hr/>
          <v-row>
            <v-col cols="4">
              <span class="flag flag-error">banned</span><br/>
              <span class="flag flag-restricted">restricted</span>
            </v-col>
            <v-col cols="8" class="align-center">
              The card is "banned" or "restricted" in the meta.
            </v-col>
          </v-row>
        </div>
        <!-- low data warning -->
        <div v-if="cardStats.lowData" data-testid="lowDataWarning">
          <hr/>
          <v-row>
            <v-col cols="4">
              <span class="data-label flag-data">low data</span><br/>
              <span class="data-label flag-data">very low data</span>
            </v-col>
            <v-col cols="8" class="align-center">
              The meta has low amount of information on the {{ isIdentity ? 'identity' : 'card'}}, so the win rate statistics is not reliable.
            </v-col>
          </v-row>
        </div>
      </v-card-text>
      <!-- close button for desktop -->
      <v-card-actions v-if="$vuetify.breakpoint.mdAndUp">
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="explain(false)" data-testid="close-explanation">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiInformation, mdiLightbulbOn, mdiClose } from '@mdi/js'
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    mdiInformation,
    mdiLightbulbOn,
    mdiClose,
    chartExplanation: false
  }),
  methods: {
    explain: function (show) {
      this.chartExplanation = show
      // fire analytics event
      this.$ga.event({
        eventCategory: 'UI',
        eventAction: 'explain-chart',
        eventLabel: show ? 'open' : 'close'
      })
    }
  },
  computed: {
    ...mapGetters({
      cardStats: 'cards/getCurrentStat',
      isRunner: 'cards/isRunner',
      isIdentity: 'cards/isIdentity',
      getCardTitle: 'cards/getCardTitle'
    }),
    sideString: function () {
      if (this.isRunner) {
        return 'runner'
      }
      return 'corporation'
    }
  }
}
</script>

<style scoped>
.v-dialog__content {
  justify-content: flex-end;
  font-size: 14px;
}
.flag {
  border-radius: 5px;
  padding: 1px;
  color: white;
}
.data-label {
  border-radius: 5px;
  padding: 1px 5px;
  color: white;
  margin: 1px;
  display: inline-block;
  font-size: 12px;
  font-style: italic;
}
/* TODO: centralize colors */
.flag-error {
  background-color: #ff5252;
}
.flag-restricted{
  background-color: #fb8c00;
}
.flag-data{
  background-color: #B56503;
}
</style>
