<template>
  <v-content>
    <!-- Desktop screens -->
    <div class="mr-4 ml-4" v-if="$vuetify.breakpoint.mdAndUp">
      <desktop-card :title="mwlDataCurrent.name" :subtitle="getSubtitle">
        <!-- Banned -->
        <template v-slot:pretext>
          <desktop-card-subtitle subtitle="Banned"/>
        </template>
        <template v-slot:left>
          <card-lister :card-list="bannedRunner"/>
        </template>
        <template v-slot:right>
          <card-lister :card-list="bannedCorp"/>
        </template>
        <template v-slot:posttext>
          <!-- Restricted -->
          <desktop-card-subtitle subtitle="Restricted"/>
          <cards-in-two-wrapper in-card-text :runner-cards="restrictedRunner" :corp-cards="restrictedCorp"/>
          <!-- Removed from MWL -->
          <desktop-card-subtitle subtitle="Removed from MWL"/>
          <cards-in-two-wrapper in-card-text :runner-cards="removedRunner" :corp-cards="removedCorp"/>
        </template>
      </desktop-card>
    </div>
    <!-- Mobile screens -->
    <div v-if="$vuetify.breakpoint.smAndDown">
      <runner-corp-tabs>
        <template v-slot:between>
          <mobile-panel :title="mwlDataCurrent.name" :subtitle="getSubtitle" hide-actions/>
        </template>
        <template v-slot:runner>
          <mobile-panel title="Banned" color="accent">
            <card-lister :card-list="bannedRunner"/>
          </mobile-panel>
          <mobile-panel title="Restricted" color="accent">
            <card-lister :card-list="restrictedRunner"/>
          </mobile-panel>
          <mobile-panel title="Removed from MWL" color="accent">
            <card-lister :card-list="removedRunner"/>
          </mobile-panel>
        </template>
        <template v-slot:corp>
          <mobile-panel title="Banned" color="accent">
            <card-lister :card-list="bannedCorp"/>
          </mobile-panel>
          <mobile-panel title="Restricted" color="accent">
            <card-lister :card-list="restrictedCorp"/>
          </mobile-panel>
          <mobile-panel title="Removed from MWL" color="accent">
            <card-lister :card-list="removedCorp"/>
          </mobile-panel>
        </template>
      </runner-corp-tabs>
    </div>
  </v-content>
</template>

<script>
import axios from 'axios'
import DesktopCard from '@/components/header/DesktopCard.vue'
import CardLister from '@/components/widget/CardLister.vue'
import CardsInTwoWrapper from '@/components/widget/CardsInTwoWrapper.vue'
import DesktopCardSubtitle from '@/components/header/DesktopCardSubtitle.vue'
import RunnerCorpTabs from '@/components/widget/RunnerCorpTabs.vue'
import MobilePanel from '@/components/header/MobilePanel.vue'

export default {
  components: {
    DesktopCard,
    CardLister,
    CardsInTwoWrapper,
    DesktopCardSubtitle,
    RunnerCorpTabs,
    MobilePanel
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
        this.sortBannedAndRestricted(this.currentBanned, this.currentRestricted)
      }).catch(() => {
        // TODO: error handling
      })
    },
    sortBannedAndRestricted: function (bannedList, restrictedList) {
      for (const prop in this.mwlDataCurrent.cards) {
        if (Object.prototype.hasOwnProperty.call(this.mwlDataCurrent.cards, prop)) {
          const card = this.mwlDataCurrent.cards[prop]
          if (('deck_limit' in card) && card.deck_limit === 0) {
            bannedList.push(this.cardData.filter(x => { return x.code === prop })[0])
          }
          if (('is_restricted' in card) && card.is_restricted === 1) {
            restrictedList.push(this.cardData.filter(x => { return x.code === prop })[0])
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
