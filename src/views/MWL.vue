<template>
  <v-content>
    <!-- Desktop screens -->
    <div class="mr-4 ml-4 d-none d-md-block">
      <desktop-card :title="mwlDataCurrent.name" :subtitle="getSubtitle">
        <!-- Banned -->
        <template v-slot:pretext>
          <v-card-title class="card-subtitle">
            <div class="overline">Banned</div>
          </v-card-title>
        </template>
        <v-row>
          <v-col cols="6" class="divider-on-right">
            <card-lister :card-list="bannedRunner"/>
          </v-col>
          <v-col>
            <card-lister :card-list="bannedCorp"/>
          </v-col>
        </v-row>
        <template v-slot:posttext>
          <!-- Restricted -->
          <v-card-title class="card-subtitle">
            <div class="overline">Restricted</div>
          </v-card-title>
          <v-card-text class="pb-0">
            <v-row>
              <v-col cols="6" class="divider-on-right">
                <card-lister :card-list="restrictedRunner"/>
              </v-col>
              <v-col>
                <card-lister :card-list="restrictedCorp"/>
              </v-col>
            </v-row>
          </v-card-text>
          <!-- Removed from MWL -->
          <v-card-title class="card-subtitle">
            <div class="overline">Removed from MWL</div>
          </v-card-title>
          <v-card-text class="pb-0">
            <v-row>
              <v-col cols="6" class="divider-on-right">
                <card-lister :card-list="removedRunner"/>
              </v-col>
              <v-col>
                <card-lister :card-list="removedCorp"/>
              </v-col>
            </v-row>
          </v-card-text>
        </template>
      </desktop-card>
    </div>
  </v-content>
</template>

<script>
import axios from 'axios'
import DesktopCard from '@/components/header/DesktopCard.vue'
import CardLister from '@/components/widget/CardLister.vue'

export default {
  components: {
    DesktopCard,
    CardLister
  },
  data: () => ({
    mwlDataCurrent: {},
    previousMWLCards: {},
    cardData: {},
    currentBanned: [],
    currentRestricted: [],
    mwlLifted: [],
    imageUrlTemplate: ''
  }),
  mounted: function () {
    this.getMWLData()
  },
  methods: {
    simplifyCardData: function (card) {
      return {
        code: card.code,
        title: card.title,
        runner: card.side_code === 'runner',
        image_url: 'image_url' in card ? card.image_url : this.imageUrlTemplate.replace('{code}', card.code)
      }
    },
    getMWLData: function () {
      axios.get('https://netrunnerdb.com/api/2.0/public/mwl').then((response) => {
        this.mwlDataCurrent = response.data.data[response.data.data.length - 2]
        this.previousMWLCards = response.data.data[response.data.data.length - 3].cards
        this.getCardData()
      }).catch(() => {
        // TODO: error handling
      })
    },
    getCardData: function () {
      axios.get('https://netrunnerdb.com/api/2.0/public/cards').then((response) => {
        this.imageUrlTemplate = response.data.imageUrlTemplate
        this.cardData = response.data.data.map(x => this.simplifyCardData(x))
        this.mwlLifted = this.getMWLLifted(this.mwlDataCurrent.cards, this.previousMWLCards)
        this.sortBannedAndRestricted()
      }).catch(() => {
        // TODO: error handling
      })
    },
    sortBannedAndRestricted: function () {
      for (const prop in this.mwlDataCurrent.cards) {
        if (Object.prototype.hasOwnProperty.call(this.mwlDataCurrent.cards, prop)) {
          const card = this.mwlDataCurrent.cards[prop]
          if (('deck_limit' in card) && card.deck_limit === 0) {
            this.currentBanned.push(this.cardData.filter(x => { return x.code === prop })[0])
          }
          if (('is_restricted' in card) && card.is_restricted === 1) {
            this.currentRestricted.push(this.cardData.filter(x => { return x.code === prop })[0])
          }
        }
      }
      this.compareWithPreviousMWL(this.currentBanned, 'deck_limit')
      this.compareWithPreviousMWL(this.currentRestricted, 'is_restricted')
    },
    compareWithPreviousMWL: function (cardList, position) {
      for (let i = 0; i < cardList.length; i++) {
        const card = cardList[i]
        if (!(card.code in this.previousMWLCards)) {
          card.badge = 'new'
        } else if (!(position in this.previousMWLCards[card.code])) {
          card.badge = 'was ' + ((position === 'deck_limit') ? 'restricted' : 'banned')
        }
      }
    },
    // calculates which cards got removed from MWL compared to the previous MWL
    getMWLLifted: function (currentCards, previousCards) {
      const lifted = []
      for (const prop in previousCards) {
        if (Object.prototype.hasOwnProperty.call(previousCards, prop)) {
          if (!(prop in currentCards)) {
            const card = this.cardData.filter(x => x.code === prop)[0]
            card.badge = 'was ' + (('deck_limit' in previousCards[prop]) ? 'banned' : 'restricted')
            lifted.push(card)
          }
        }
      }
      return lifted
    }
  },
  computed: {
    getSubtitle: function () {
      return 'latest mwl, from: ' + this.mwlDataCurrent.date_start
    },
    bannedRunner: function () {
      return this.currentBanned.filter(x => { return x.runner })
    },
    bannedCorp: function () {
      return this.currentBanned.filter(x => { return !x.runner })
    },
    restrictedRunner: function () {
      return this.currentRestricted.filter(x => { return x.runner })
    },
    restrictedCorp: function () {
      return this.currentRestricted.filter(x => { return !x.runner })
    },
    removedRunner: function () {
      return this.mwlLifted.filter(x => { return x.runner })
    },
    removedCorp: function () {
      return this.mwlLifted.filter(x => { return !x.runner })
    }
  }
}
</script>
