<template>
  <div>
    <!-- Small screens -->
    <runner-corp-tabs :url="'/meta/' + $route.params.metacode + '/ids'">
      <!-- Runner -->
      <template v-slot:runner>
        <mobile-panel title="Popularity" :subtitle="popSubtitle">
          <identity-popularity side="runner" :side-data="metaData.identities.runner" :standing-count="metaData.meta.standings"/>
        </mobile-panel>
        <mobile-panel title="Win rates" :subtitle="winSubtitle" tooltip="IDs with minimum 50 matches" :dataWarning="dataWarning">
          <side-winrate-chart :runner-win="metaData.meta.runnerWinRate" :corp-win="metaData.meta.corpWinRate"
            :draw="1 - metaData.meta.runnerWinRate - metaData.meta.corpWinRate" style="height: 150px" class="pt-2" chart-id="chart-side-winrate-r"/>
          <identity-winrate side="runner" :side-data="metaData.identities.runner"/>
        </mobile-panel>
      </template>
      <!-- Corp -->
      <template v-slot:corp>
        <mobile-panel title="Popularity" :subtitle="popSubtitle">
          <identity-popularity side="corporation" :side-data="metaData.identities.corp" :standing-count="metaData.meta.standings"/>
        </mobile-panel>
        <mobile-panel title="Win rates" :subtitle="winSubtitle" tooltip="IDs with minimum 50 matches" :dataWarning="dataWarning">
          <side-winrate-chart :runner-win="metaData.meta.runnerWinRate" :corp-win="metaData.meta.corpWinRate"
            :draw="1 - metaData.meta.runnerWinRate - metaData.meta.corpWinRate" style="height: 150px" class="pt-2" chart-id="chart-side-winrate-c"/>
          <identity-winrate side="corporation" :side-data="metaData.identities.corp"/>
        </mobile-panel>
      </template>
    </runner-corp-tabs>
    <!-- Desktop screens -->
    <div class="mr-4 ml-4" v-if="$vuetify.breakpoint.mdAndUp">
      <!-- Popularity card -->
      <desktop-card title="Popularity" :subtitle="popSubtitle">
        <template v-slot:left>
          <identity-popularity side="runner" :side-data="metaData.identities.runner" :standing-count="metaData.meta.standings"/>
        </template>
        <template v-slot:right>
          <identity-popularity side="corporation" :side-data="metaData.identities.corp" :standing-count="metaData.meta.standings"/>
        </template>
      </desktop-card>
      <!-- Win rates -->
      <desktop-card title="Win rates" :subtitle="winSubtitle" tooltip="IDs with minimum 50 matches" :dataWarning="dataWarning">
        <template v-slot:pretext>
          <side-winrate-chart :runner-win="metaData.meta.runnerWinRate" :corp-win="metaData.meta.corpWinRate"
            :draw="1 - metaData.meta.runnerWinRate - metaData.meta.corpWinRate" style="height: 150px" class="pt-2" chart-id="chart-side-winrate"/>
            <hr class="thin-hr"/>
        </template>
        <template v-slot:left>
          <identity-winrate side="runner" :side-data="metaData.identities.runner"/>
        </template>
        <template v-slot:right>
          <identity-winrate side="corporation" :side-data="metaData.identities.corp"/>
        </template>
      </desktop-card>
      <last-update :meta-info="metaData.meta"/>
    </div>
  </div>
</template>

<script>
import IdentityPopularity from '@/components/widget/IdentityPopularity.vue'
import IdentityWinrate from '@/components/widget/IdentityWinrate.vue'
import SideWinrateChart from '@/components/chart/SideWinrateChart.vue'
import DesktopCard from '@/components/header/DesktopCard.vue'
import MobilePanel from '@/components/header/MobilePanel.vue'
import RunnerCorpTabs from '@/components/widget/RunnerCorpTabs.vue'
import LastUpdate from '@/components/widget/LastUpdate.vue'
export default {
  name: 'Identities',
  props: {
    metaData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  components: {
    IdentityPopularity,
    IdentityWinrate,
    DesktopCard,
    MobilePanel,
    RunnerCorpTabs,
    LastUpdate,
    SideWinrateChart
  },
  computed: {
    popSubtitle: function () {
      return this.metaData.meta.standings + ' players'
    },
    winSubtitle: function () {
      return this.metaData.meta.matches + ' matches'
    },
    dataWarning: function () {
      if (this.metaData.meta.matches < 2000) {
        return 2 // very low data
      }
      if (this.metaData.meta.matches < 4000) {
        return 1 // low data
      }
      return 0 // no warning
    }
  }
}
</script>
