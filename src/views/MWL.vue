<template>
  <v-content>
    <!-- Desktop screens -->
    <div class="mr-4 ml-4" v-if="$vuetify.breakpoint.mdAndUp">
      <desktop-card :title="netrunnerdb.mwl[0].name" :subtitle="getSubtitle" v-if="netrunnerdb.mwl && netrunnerdb.mwl.length">
        <!-- Banned -->
        <template v-slot:pretext>
          <desktop-card-subtitle subtitle="Banned"/>
        </template>
        <template v-slot:left>
          <card-lister :card-list="bannedRunner" test-id="list-runner-banned"/>
        </template>
        <template v-slot:right>
          <card-lister :card-list="bannedCorp" test-id="list-corp-banned"/>
        </template>
        <template v-slot:posttext>
          <!-- Restricted -->
          <desktop-card-subtitle subtitle="Restricted" v-if="isRestrictedUsed"/>
          <cards-in-two-wrapper in-card-text :runner-cards="restrictedRunner" :corp-cards="restrictedCorp"
              runner-test-id="list-runner-restricted" corp-test-id="list-corp-restricted" v-if="isRestrictedUsed"/>
          <!-- Removed from MWL -->
          <desktop-card-subtitle subtitle="Removed from MWL, legal again"/>
          <cards-in-two-wrapper in-card-text :runner-cards="removedRunner" :corp-cards="removedCorp"
              runner-test-id="list-runner-removed" corp-test-id="list-corp-removed"/>
        </template>
      </desktop-card>
    </div>
    <!-- Mobile screens -->
    <div v-if="$vuetify.breakpoint.smAndDown">
      <runner-corp-tabs url="/mwl">
        <template v-slot:between>
          <mobile-panel :title="netrunnerdb.mwl[0].name" :subtitle="getSubtitle" hide-actions v-if="netrunnerdb.mwl && netrunnerdb.mwl.length"/>
        </template>
        <template v-slot:runner>
          <mobile-panel title="Banned" color="accent" thin>
            <card-lister :card-list="bannedRunner" test-id="list-runner-banned"/>
          </mobile-panel>
          <mobile-panel title="Restricted" color="accent" thin v-if="isRestrictedUsed">
            <card-lister :card-list="restrictedRunner" test-id="list-runner-restricted" v-if="isRestrictedUsed"/>
          </mobile-panel>
          <mobile-panel title="Removed from MWL, legal again" color="accent" thin>
            <card-lister :card-list="removedRunner" test-id="list-runner-removed"/>
          </mobile-panel>
        </template>
        <template v-slot:corp>
          <mobile-panel title="Banned" color="accent" thin>
            <card-lister :card-list="bannedCorp" test-id="list-corp-banned"/>
          </mobile-panel>
          <mobile-panel title="Restricted" color="accent" thin v-if="isRestrictedUsed">
            <card-lister :card-list="restrictedCorp" test-id="list-corp-restricted" v-if="isRestrictedUsed"/>
          </mobile-panel>
          <mobile-panel title="Removed from MWL, legal again" color="accent" thin>
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
    }
  },
  computed: {
    ...mapState(['netrunnerdb']),
    getSubtitle: function () {
      if (!this.netrunnerdb.mwl || this.netrunnerdb.mwl.length === 0) return ''
      return '<span class="d-none d-sm-inline">latest mwl, </span>from: <span class="text-no-wrap">' + this.netrunnerdb.mwl[0].date_start + '</span>'
    },
    bannedRunner: function () {
      if (!this.netrunnerdb.mwl || this.netrunnerdb.mwl.length === 0) return []
      return this.cardsetToArray(this.netrunnerdb.mwl[0].banned, true)
    },
    bannedCorp: function () {
      if (!this.netrunnerdb.mwl || this.netrunnerdb.mwl.length === 0) return []
      return this.cardsetToArray(this.netrunnerdb.mwl[0].banned, false)
    },
    restrictedRunner: function () {
      if (!this.netrunnerdb.mwl || this.netrunnerdb.mwl.length === 0) return []
      return this.cardsetToArray(this.netrunnerdb.mwl[0].restricted, true)
    },
    restrictedCorp: function () {
      if (!this.netrunnerdb.mwl || this.netrunnerdb.mwl.length === 0) return []
      return this.cardsetToArray(this.netrunnerdb.mwl[0].restricted, false)
    },
    removedRunner: function () {
      if (!this.netrunnerdb.mwl || this.netrunnerdb.mwl.length === 0) return []
      return this.cardsetToArray(this.netrunnerdb.mwl[0].removed, true)
    },
    removedCorp: function () {
      if (!this.netrunnerdb.mwl || this.netrunnerdb.mwl.length === 0) return []
      return this.cardsetToArray(this.netrunnerdb.mwl[0].removed, false)
    },
    isRestrictedUsed: function () {
      return this.restrictedRunner.length + this.restrictedCorp.length > 0
    }
  }
}
</script>
