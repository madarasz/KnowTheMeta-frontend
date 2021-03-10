<template>
  <div>
    <!-- Small screens -->
    <runner-corp-tabs :url="'/meta/' + $route.params.metacode + '/cards'">
      <!-- Runner -->
      <template v-slot:runner>
        <mobile-panel :title="popularTitle" :subtitle="runnerSubtitle" tooltip="cards with minimum 5% popularity" :dataWarning="dataWarning">
          <div class="loader" v-if="!cardsLoaded"><span/><span/><span/></div>
          <card-stat-lister :card-list="runnerPopularInPack" test-id="popular-runner" :deck-count="metaData.meta.runnerDecks" :runner="true" v-if="cardsLoaded"/>
        </mobile-panel>
        <mobile-panel title="Breakers / ICE" :subtitle="runnerSubtitle" tooltip="cards with minimum 5% popularity" :dataWarning="dataWarning">
          <div class="loader" v-if="!cardsLoaded"><span/><span/><span/></div>
          <card-table :card-list="iceBreakers" test-id="table-icebreakers" v-if="cardsLoaded"/>
        </mobile-panel>
        <mobile-panel title="Impressive winrates" :subtitle="runnerSubtitle" tooltip="cards with minimum 5% popularity" :dataWarning="dataWarning">
          <div class="loader" v-if="!cardsLoaded"><span/><span/><span/></div>
          <card-stat-lister :card-list="runnerWinning" test-id="winning-runner" :deck-count="metaData.meta.runnerDecks" :runner="true" v-if="cardsLoaded"/>
        </mobile-panel>
      </template>
      <!-- Corp -->
      <template v-slot:corp>
        <mobile-panel :title="popularTitle" :subtitle="corpSubtitle" tooltip="cards with minimum 5% popularity" :dataWarning="dataWarning">
          <div class="loader" v-if="!cardsLoaded"><span/><span/><span/></div>
          <card-stat-lister :card-list="corpPopularInPack" test-id="popular-corp" :deck-count="metaData.meta.corpDecks" :runner="false" v-if="cardsLoaded"/>
        </mobile-panel>
        <mobile-panel title="Breakers / ICE" :subtitle="corpSubtitle" tooltip="cards with minimum 5% popularity" :dataWarning="dataWarning">
          <div class="loader" v-if="!cardsLoaded"><span/><span/><span/></div>
          <card-table :card-list="ice" test-id="table-icebreakers" v-if="cardsLoaded"/>
        </mobile-panel>
        <mobile-panel title="Impressive winrates" :subtitle="corpSubtitle" tooltip="cards with minimum 5% popularity" :dataWarning="dataWarning">
          <div class="loader" v-if="!cardsLoaded"><span/><span/><span/></div>
          <card-stat-lister :card-list="corpWinning" test-id="winning-corp" :deck-count="metaData.meta.corpDecks" :runner="false" v-if="cardsLoaded"/>
        </mobile-panel>
      </template>
    </runner-corp-tabs>
    <!-- Desktop screens -->
    <div class="mr-4 ml-4" v-if="$vuetify.breakpoint.mdAndUp">
      <!-- Popular in pack -->
      <desktop-card :title="popularTitle" :subtitle="subtitle" tooltip="cards with minimum 5% popularity" :dataWarning="dataWarning">
        <template v-slot:left>
          <div class="loader" v-if="!cardsLoaded"><span/><span/><span/></div>
          <card-stat-lister :card-list="runnerPopularInPack" test-id="popular-runner" :deck-count="metaData.meta.runnerDecks" :runner="true" v-if="cardsLoaded"/>
        </template>
        <template v-slot:right>
          <div class="loader" v-if="!cardsLoaded"><span/><span/><span/></div>
          <card-stat-lister :card-list="corpPopularInPack" test-id="popular-corp" :deck-count="metaData.meta.corpDecks" :runner="false" v-if="cardsLoaded"/>
        </template>
      </desktop-card>
      <!-- Breakers / ICE -->
      <desktop-card title="Breakers / ICE" :subtitle="subtitle" tooltip="cards with minimum 5% popularity" :dataWarning="dataWarning">
        <template v-slot:left>
          <div class="loader" v-if="!cardsLoaded"><span/><span/><span/></div>
          <card-table :card-list="iceBreakers" test-id="table-icebreakers" v-if="cardsLoaded"/>
        </template>
        <template v-slot:right>
          <div class="loader" v-if="!cardsLoaded"><span/><span/><span/></div>
          <card-table :card-list="ice" test-id="table-ice" v-if="cardsLoaded"/>
        </template>
      </desktop-card>
      <!-- Winning -->
      <desktop-card title="Impressive winrates" :subtitle="subtitle" tooltip="cards with minimum 5% popularity" :dataWarning="dataWarning">
        <template v-slot:left>
          <div class="loader" v-if="!cardsLoaded"><span/><span/><span/></div>
          <card-stat-lister :card-list="runnerWinning" test-id="winning-runner" :deck-count="metaData.meta.runnerDecks" :runner="true" v-if="cardsLoaded"/>
        </template>
        <template v-slot:right>
          <div class="loader" v-if="!cardsLoaded"><span/><span/><span/></div>
          <card-stat-lister :card-list="corpWinning" test-id="winning-corp" :deck-count="metaData.meta.corpDecks" :runner="false" v-if="cardsLoaded"/>
        </template>
      </desktop-card>
      <last-update :meta-info="metaData.meta"/>
    </div>
  </div>
</template>

<script>
import DesktopCard from '@/components/header/DesktopCard.vue'
import MobilePanel from '@/components/header/MobilePanel.vue'
import RunnerCorpTabs from '@/components/widget/RunnerCorpTabs.vue'
import LastUpdate from '@/components/widget/LastUpdate.vue'
import CardStatLister from '@/components/lister/CardStatLister.vue'
import CardTable from '@/components/table/CardTable.vue'
import transform from '@/netrunnerTransformations.js'
import { mapState } from 'vuex'

export default {
  name: 'Cards',
  props: {
    metaData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data: () => ({
    maxCardsPerWidget: 14
  }),
  components: {
    DesktopCard,
    MobilePanel,
    RunnerCorpTabs,
    LastUpdate,
    CardStatLister,
    CardTable
  },
  mounted: function () {
    this.getNetunnerDBData()
  },
  methods: {
    getNetunnerDBData: function () {
      this.$store.dispatch('netrunnerdb/getCardData', false).then(() => {
      })
    },
    addImageUrl: function (card) {
      card.image_url = this.netrunnerdb.cards[card.title].image_url
      return card
    },
    sortIntoTypes: function (cardList) {
      for (let i = 0; i < cardList.length; i++) {
        let tag = cardList[i].tags
        if (tag.indexOf(',') > -1) {
          tag = tag.split(',').find(x => { return x.indexOf('ice') > -1 })
        }
        if (tag.indexOf('-') > -1) {
          tag = tag.split('-')[1]
        }
        cardList[i].type = tag
        cardList[i].popularity = (Math.round(cardList[i].used / this.metaData.meta.runnerDecks * 1000) / 10).toFixed(1) + '%'
        cardList[i].winrate = transform.winrate(cardList[i]).toFixed(1) + '%'
        cardList[i].avg = cardList[i].avgPerDeck.toFixed(2)
      }
      return cardList
    }
  },
  computed: {
    ...mapState(['netrunnerdb']),
    runnerSubtitle: function () {
      return this.metaData.meta.runnerDecks + ' decks'
    },
    corpSubtitle: function () {
      return this.metaData.meta.corpDecks + ' decks'
    },
    subtitle: function () {
      return (this.metaData.meta.runnerDecks + this.metaData.meta.corpDecks) + ' decks'
    },
    popularTitle: function () {
      return 'Popular from ' + this.metaData.meta.cardpool
    },
    runnerPopularInPack: function () {
      return this.metaData.cards.runner.filter(x => { return x.tags.includes('popular-in-pack') })
        .sort(transform.comparePopularity).slice(0, this.maxCardsPerWidget).map(x => this.addImageUrl(x))
    },
    corpPopularInPack: function () {
      return this.metaData.cards.corp.filter(x => { return x.tags.includes('popular-in-pack') })
        .sort(transform.comparePopularity).slice(0, this.maxCardsPerWidget).map(x => this.addImageUrl(x))
    },
    runnerWinning: function () {
      return this.metaData.cards.runner.filter(x => { return x.tags.includes('winning') })
        .sort(transform.compareWinrates).slice(0, this.maxCardsPerWidget).map(x => this.addImageUrl(x))
    },
    corpWinning: function () {
      return this.metaData.cards.corp.filter(x => { return x.tags.includes('winning') })
        .sort(transform.compareWinrates).slice(0, this.maxCardsPerWidget).map(x => this.addImageUrl(x))
    },
    iceBreakers: function () {
      return this.sortIntoTypes(
        this.metaData.cards.runner.filter(x => { return x.tags.includes('icebreaker') })
          .sort(transform.comparePopularity)
      )
    },
    ice: function () {
      return this.sortIntoTypes(
        this.metaData.cards.corp.filter(x => { return x.tags.includes('ice') })
          .sort(transform.comparePopularity)
      )
    },
    cardsLoaded: function () {
      return Object.keys(this.netrunnerdb.cards).length > 0
    },
    dataWarning: function () {
      if (this.metaData.meta.runnerDecks < 50) {
        return 2 // very low data
      }
      if (this.metaData.meta.runnerDecks < 200) {
        return 1 // low data
      }
      return 0 // no warning
    }
  }
}
</script>
