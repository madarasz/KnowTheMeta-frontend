<template>
  <div>
    <!-- Small screens -->
    <runner-corp-tabs>
      <!-- Runner -->
      <template v-slot:runner>
        <!-- <mobile-panel title="Popularity" :subtitle="popSubtitle">
          <identity-popularity side="runner" :side-data="metaData.identities.runner"/>
        </mobile-panel>
        <mobile-panel title="Win rates" :subtitle="winSubtitle">
          <identity-winrate side="runner" :side-data="metaData.identities.runner"/>
        </mobile-panel> -->
      </template>
      <!-- Corp -->
      <template v-slot:corp>
        <!-- <mobile-panel title="Popularity" :subtitle="popSubtitle">
          <identity-popularity side="corp" :side-data="metaData.identities.corp"/>
        </mobile-panel>
        <mobile-panel title="Win rates" :subtitle="winSubtitle">
          <identity-winrate side="corporation" :side-data="metaData.identities.corp"/>
        </mobile-panel> -->
      </template>
    </runner-corp-tabs>
    <!-- Desktop screens -->
    <div class="mr-4 ml-4 d-none d-md-block">
      <!-- Popularity card -->
      <desktop-card :title="'Popular from ' + metaData.meta.cardpool" :subtitle="subtitle">
        <template v-slot:left>
        </template>
        <template v-slot:right>
        </template>
      </desktop-card>
      <last-update :meta-info="metaData.meta"/>
    </div>
  </div>
</template>

<script>
import DesktopCard from '@/components/header/DesktopCard.vue'
// import MobilePanel from '@/components/header/MobilePanel.vue'
import RunnerCorpTabs from '@/components/widget/RunnerCorpTabs.vue'
import LastUpdate from '@/components/widget/LastUpdate.vue'
import transform from '@/netrunnerTransformations.js'

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
  components: {
    DesktopCard,
    // MobilePanel,
    RunnerCorpTabs,
    LastUpdate
  },
  computed: {
    runnerSubtitle: function () {
      return this.metaData.meta.runnerDecks + ' decks'
    },
    corpSubtitle: function () {
      return this.metaData.meta.corpDecks + ' decks'
    },
    subtitle: function () {
      return (this.metaData.meta.runnerDecks + this.metaData.meta.corpDecks) + ' decks'
    },
    runnerPopularInPack: function () {
      return this.metaData.cards.runner.filter(x => { return x.tags.includes('popular-in-pack') }).sort(transform.comparePopularity)
    }
  }
}
</script>
