<template>
  <v-content>
    <!-- Desktop screens -->
    <div class="mr-4 ml-4" v-if="$vuetify.breakpoint.mdAndUp">
      <desktop-card :title="netrunnerdb.mwl[0].name" :subtitle="getSubtitle" v-if="mwlLoaded">
        <!-- Banned -->
        <template v-slot:pretext>
          <desktop-card-subtitle subtitle="Banned"/>
        </template>
        <template v-slot:left>
          <div class="loader" v-if="!mwlLoaded"><span/><span/><span/></div>
          <card-lister :card-list="bannedRunner" test-id="list-runner-banned"/>
        </template>
        <template v-slot:right>
          <div class="loader" v-if="!mwlLoaded"><span/><span/><span/></div>
          <card-lister :card-list="bannedCorp" test-id="list-corp-banned"/>
        </template>
        <template v-slot:posttext>
          <!-- Restricted -->
          <desktop-card-subtitle subtitle="Restricted" v-if="isRestrictedUsed"/>
          <div class="loader" v-if="!mwlLoaded && isRestrictedUsed"><span/><span/><span/></div>
          <cards-in-two-wrapper in-card-text :runner-cards="restrictedRunner" :corp-cards="restrictedCorp"
              runner-test-id="list-runner-restricted" corp-test-id="list-corp-restricted" v-if="isRestrictedUsed"/>
          <!-- Removed from MWL -->
          <desktop-card-subtitle subtitle="Removed from MWL, legal again"/>
          <div class="loader" v-if="!mwlLoaded"><span/><span/><span/></div>
          <cards-in-two-wrapper in-card-text :runner-cards="removedRunner" :corp-cards="removedCorp"
              runner-test-id="list-runner-removed" corp-test-id="list-corp-removed"/>
        </template>
      </desktop-card>
    </div>
    <!-- Mobile screens -->
    <div v-if="$vuetify.breakpoint.smAndDown">
      <runner-corp-tabs url="/mwl">
        <template v-slot:between>
          <mobile-panel :title="netrunnerdb.mwl[0].name" :subtitle="getSubtitle" hide-actions v-if="mwlLoaded"/>
        </template>
        <template v-slot:runner>
          <mobile-panel title="Banned" color="accent" thin>
            <div class="loader" v-if="!mwlLoaded"><span/><span/><span/></div>
            <card-lister :card-list="bannedRunner" test-id="list-runner-banned"/>
          </mobile-panel>
          <mobile-panel title="Restricted" color="accent" thin v-if="isRestrictedUsed">
            <div class="loader" v-if="!mwlLoaded"><span/><span/><span/></div>
            <card-lister :card-list="restrictedRunner" test-id="list-runner-restricted" v-if="isRestrictedUsed"/>
          </mobile-panel>
          <mobile-panel title="Removed from MWL, legal again" color="accent" thin>
            <div class="loader" v-if="!mwlLoaded"><span/><span/><span/></div>
            <card-lister :card-list="removedRunner" test-id="list-runner-removed"/>
          </mobile-panel>
        </template>
        <template v-slot:corp>
          <mobile-panel title="Banned" color="accent" thin>
            <div class="loader" v-if="!mwlLoaded"><span/><span/><span/></div>
            <card-lister :card-list="bannedCorp" test-id="list-corp-banned"/>
          </mobile-panel>
          <mobile-panel title="Restricted" color="accent" thin v-if="isRestrictedUsed">
            <div class="loader" v-if="!mwlLoaded"><span/><span/><span/></div>
            <card-lister :card-list="restrictedCorp" test-id="list-corp-restricted" v-if="isRestrictedUsed"/>
          </mobile-panel>
          <mobile-panel title="Removed from MWL, legal again" color="accent" thin>
            <div class="loader" v-if="!mwlLoaded"><span/><span/><span/></div>
            <card-lister :card-list="removedCorp" test-id="list-corp-removed"/>
          </mobile-panel>
        </template>
      </runner-corp-tabs>
    </div>
  </v-content>
</template>

<script>
import { mapState } from 'vuex'
import DesktopCard from '@/components/header/DesktopCard.vue'
import CardLister from '@/components/lister/CardLister.vue'
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
  mounted: function () {
    this.getNetunnerDBData()
  },
  methods: {
    getNetunnerDBData: function () {
      this.$store.dispatch('netrunnerdb/getCardData', true).then(() => {
      })
    },
    cardsetToArray: function (cardSet, runner) {
      return Object.keys(cardSet).map(title => {
        const arrayElement = cardSet[title]
        arrayElement.title = title
        return arrayElement
      }).filter(x => { return x.runner === runner && x.legal })
    },
    cardSort: function (a, b) {
      return this.cardSortByBadge(a, b) || this.cardSortIdentity(a, b) || this.cardSortByFaction(a, b)
    },
    cardSortByBadge: function (a, b) {
      if ('badge' in a === 'badge' in b) return 0
      if ('badge' in b) return 1
      return -1
    },
    cardSortIdentity: function (a, b) {
      if (a.identity === b.identity) return 0
      if (b.identity) return 1
      return -1
    },
    cardSortByFaction: function (a, b) {
      if (a.faction.includes('neutral') === b.faction.includes('neutral')) return a.faction.localeCompare(b.faction)
      if (b.faction.includes('neutral')) return -1
      return 1
    }
  },
  computed: {
    ...mapState(['netrunnerdb']),
    getSubtitle: function () {
      if (!this.mwlLoaded) return ''
      return '<span class="d-none d-sm-inline">latest mwl, </span>from: <span class="text-no-wrap">' + this.netrunnerdb.mwl[0].date_start + '</span>'
    },
    bannedRunner: function () {
      if (!this.mwlLoaded) return []
      return this.cardsetToArray(this.netrunnerdb.mwl[0].banned, true).sort(this.cardSort)
    },
    bannedCorp: function () {
      if (!this.mwlLoaded) return []
      return this.cardsetToArray(this.netrunnerdb.mwl[0].banned, false).sort(this.cardSort)
    },
    restrictedRunner: function () {
      if (!this.mwlLoaded) return []
      return this.cardsetToArray(this.netrunnerdb.mwl[0].restricted, true).sort(this.cardSort)
    },
    restrictedCorp: function () {
      if (!this.mwlLoaded) return []
      return this.cardsetToArray(this.netrunnerdb.mwl[0].restricted, false).sort(this.cardSort)
    },
    removedRunner: function () {
      if (!this.mwlLoaded) return []
      return this.cardsetToArray(this.netrunnerdb.mwl[0].removed, true).sort(this.cardSort)
    },
    removedCorp: function () {
      if (!this.mwlLoaded) return []
      return this.cardsetToArray(this.netrunnerdb.mwl[0].removed, false).sort(this.cardSort)
    },
    isRestrictedUsed: function () {
      return this.restrictedRunner.length + this.restrictedCorp.length > 0
    },
    mwlLoaded: function () {
      return this.netrunnerdb.mwl && this.netrunnerdb.mwl.length
    }
  }
}
</script>
