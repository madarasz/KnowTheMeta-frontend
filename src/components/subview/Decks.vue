<template>
  <div>
    <!-- Desktop screens -->
    <div class="mr-4 ml-4" v-if="$vuetify.breakpoint.mdAndUp">
      <!-- Deck Highlights -->
      <desktop-card title="Deck highlights" tooltip="successful decks from various archetypes" :subtitle="subtitle">
        <template v-slot:left>
          <deck-lister :deck-list="runnerDeckHighlights" v-if="loaded" side="runner" :meta="metacode"/>
          <div class="loader" v-if="!loaded"><span/><span/><span/></div>
        </template>
        <template v-slot:right>
          <deck-lister :deck-list="corpDeckHighlights" v-if="loaded" side="corporation" :meta="metacode"/>
          <div class="loader" v-if="!loaded"><span/><span/><span/></div>
        </template>
      </desktop-card>
    </div>
    <!-- Small screens -->
    <runner-corp-tabs :url="'/meta/' + $route.params.metacode + '/decks'">
      <!-- Runner -->
      <template v-slot:runner>
        <mobile-panel title="Deck highlights" tooltip="successful decks from various archetypes" :subtitle="subtitleRunner">
          <deck-lister :deck-list="runnerDeckHighlights" v-if="loaded" side="runner" :meta="metacode"/>
          <div class="loader" v-if="!loaded"><span/><span/><span/></div>
        </mobile-panel>
      </template>
      <template v-slot:corp>
        <mobile-panel title="Deck highlights" tooltip="successful decks from various archetypes" :subtitle="subtitleCorp">
          <deck-lister :deck-list="corpDeckHighlights" v-if="loaded" side="corp" :meta="metacode"/>
          <div class="loader" v-if="!loaded"><span/><span/><span/></div>
        </mobile-panel>
      </template>
    </runner-corp-tabs>
    <!-- <v-select :items="identities" v-if="loaded" v-model="selectedId"/>
    <deck-similarity :deck-data="selectedData" v-if="loaded"/> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import DeckSimilarity from '@/components/chart/DeckSimilarity.vue'
import DesktopCard from '@/components/header/DesktopCard.vue'
import RunnerCorpTabs from '@/components/widget/RunnerCorpTabs.vue'
import MobilePanel from '@/components/header/MobilePanel.vue'
import DeckLister from '@/components/lister/DeckLister.vue'
import clustering from '@/clustering.js'

export default {
  name: 'Decks',
  props: {
    metaData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    minSuccessScore: {
      type: Number,
      default: 1.5
    }
  },
  data: () => ({
    metacode: '',
    loaded: false,
    runnerDeckHighlights: [],
    corpDeckHighlights: [],
    selectedId: ''
  }),
  components: {
    // DeckSimilarity,
    DeckLister,
    DesktopCard,
    RunnerCorpTabs,
    MobilePanel
  },
  mounted: function () {
    this.metacode = this.$route.params.metacode
    this.getMetaDeckData(this.$route.params.metacode)
  },
  methods: {
    getMetaDeckData: function (metacode) {
      this.loaded = false
      this.$store.dispatch('metas/getMetaDeckData', metacode).then((response) => {
        this.runnerDeckHighlights = clustering.processMeta(this.metaDecks.runner).filter(x => x.successScore > this.minSuccessScore)
        this.corpDeckHighlights = clustering.processMeta(this.metaDecks.corp).filter(x => x.successScore > this.minSuccessScore)
        this.loaded = true
      })
    }
  },
  computed: {
    ...mapGetters({
      metaDecks: 'metas/getCurrentMetaDecks'
    }),
    identities: function () {
      if (!this.loaded) return []
      // TODO: this is runner only
      return this.metaDecks.runner.map(x => { return { text: x.identity.title + '(' + x.deckCount + ')', value: x.identity.title } })
    },
    selectedData: function () {
      if (!this.loaded || this.selectedId === '') return []
      return this.metaDecks.runner.find(x => x.identity.title === this.selectedId).decks
    },
    subtitle: function () {
      return (this.metaData.meta.runnerDecks + this.metaData.meta.corpDecks) + ' decks'
    },
    subtitleRunner: function () {
      return this.metaData.meta.runnerDecks + ' decks'
    },
    subtitleCorp: function () {
      return this.metaData.meta.corpDecks + ' decks'
    }
  }
}
</script>
