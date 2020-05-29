<template>
  <div>
    <!-- Small screens -->
    <runner-corp-tabs>
      <!-- Runner -->
      <template v-slot:runner>
        <mobile-panel :title="popularTitle" :subtitle="runnerSubtitle">
          <card-stat-lister :card-list="runnerPopularInPack" test-id="popular-runner" :deck-count="metaData.meta.runnerDecks" :runner="true" v-if="loaded"/>
        </mobile-panel>
        <mobile-panel title="Breakers / ICE" :subtitle="runnerSubtitle">
          <card-table :card-list="iceBreakers" test-id="table-icebreakers"/>
        </mobile-panel>
        <mobile-panel title="Impressive winrates" :subtitle="runnerSubtitle" tooltip="cards with minimum 5% popularity">
          <card-stat-lister :card-list="runnerWinning" test-id="winning-runner" :deck-count="metaData.meta.runnerDecks" :runner="true" v-if="loaded"/>
        </mobile-panel>
      </template>
      <!-- Corp -->
      <template v-slot:corp>
        <mobile-panel :title="popularTitle" :subtitle="corpSubtitle">
          <card-stat-lister :card-list="corpPopularInPack" test-id="popular-corp" :deck-count="metaData.meta.corpDecks" :runner="false" v-if="loaded"/>
        </mobile-panel>
        <mobile-panel title="Breakers / ICE" :subtitle="corpSubtitle">
          <card-table :card-list="iceBreakers" test-id="table-icebreakers"/>
        </mobile-panel>
        <mobile-panel title="Impressive winrates" :subtitle="corpSubtitle" tooltip="cards with minimum 5% popularity">
          <card-stat-lister :card-list="corpWinning" test-id="winning-corp" :deck-count="metaData.meta.corpDecks" :runner="false" v-if="loaded"/>
        </mobile-panel>
      </template>
    </runner-corp-tabs>
    <!-- Desktop screens -->
    <div class="mr-4 ml-4" v-if="$vuetify.breakpoint.mdAndUp">
      <!-- Popular in pack -->
      <desktop-card :title="popularTitle" :subtitle="subtitle">
        <template v-slot:left>
          <card-stat-lister :card-list="runnerPopularInPack" test-id="popular-runner" :deck-count="metaData.meta.runnerDecks" :runner="true" v-if="loaded"/>
        </template>
        <template v-slot:right>
          <card-stat-lister :card-list="corpPopularInPack" test-id="popular-corp" :deck-count="metaData.meta.corpDecks" :runner="false" v-if="loaded"/>
        </template>
      </desktop-card>
      <!-- Breakers / ICE -->
      <desktop-card title="Breakers / ICE" :subtitle="subtitle">
        <template v-slot:left>
          <card-table :card-list="iceBreakers" test-id="table-icebreakers"/>
        </template>
        <template v-slot:right>
          <card-table :card-list="ice" test-id="table-ice"/>
        </template>
      </desktop-card>
      <!-- Winning -->
      <desktop-card title="Impressive winrates" :subtitle="subtitle" tooltip="cards with minimum 5% popularity">
        <template v-slot:left>
          <card-stat-lister :card-list="runnerWinning" test-id="winning-runner" :deck-count="metaData.meta.runnerDecks" :runner="true" v-if="loaded"/>
        </template>
        <template v-slot:right>
          <card-stat-lister :card-list="corpWinning" test-id="winning-corp" :deck-count="metaData.meta.corpDecks" :runner="false" v-if="loaded"/>
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
import CardStatLister from '@/components/widget/CardStatLister.vue'
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
    maxCardsPerWidget: 12,
    loaded: false
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
        this.loaded = true
      })
    },
    addImageUrl: function (card) {
      card.image_url = this.netrunnerdb.cards[card.title].image_url
      return card
    },
    // sortIntoTypes: function (cardList) {
    //   const result = {}
    //   for (let i = 0; i < cardList.length; i++) {
    //     let tag = cardList[i].tags
    //     if (tag.indexOf(',') > -1) {
    //       tag = tag.split(',').find(x => { return x.indexOf('ice') > -1 })
    //     }
    //     if (tag.indexOf('-') > -1) {
    //       tag = tag.split('-')[1]
    //     }
    //     if (result[tag] === undefined) {
    //       result[tag] = []
    //     }
    //     result[tag].push(cardList[i])
    //   }
    //   return result
    // }
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
          .sort(transform.comparePopularity).map(x => this.addImageUrl(x))
      )
    },
    ice: function () {
      return this.sortIntoTypes(
        this.metaData.cards.corp.filter(x => { return x.tags.includes('ice') })
          .sort(transform.comparePopularity).map(x => this.addImageUrl(x))
      )
    }
  }
}
</script>
