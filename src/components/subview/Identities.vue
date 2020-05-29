<template>
  <div>
    <!-- Small screens -->
    <runner-corp-tabs>
      <!-- Runner -->
      <template v-slot:runner>
        <mobile-panel title="Popularity" :subtitle="popSubtitle">
          <identity-popularity side="runner" :side-data="metaData.identities.runner"/>
        </mobile-panel>
        <mobile-panel title="Win rates" :subtitle="winSubtitle">
          <identity-winrate side="runner" :side-data="metaData.identities.runner"/>
        </mobile-panel>
      </template>
      <!-- Corp -->
      <template v-slot:corp>
        <mobile-panel title="Popularity" :subtitle="popSubtitle">
          <identity-popularity side="corp" :side-data="metaData.identities.corp"/>
        </mobile-panel>
        <mobile-panel title="Win rates" :subtitle="winSubtitle">
          <identity-winrate side="corporation" :side-data="metaData.identities.corp"/>
        </mobile-panel>
      </template>
    </runner-corp-tabs>
    <!-- Desktop screens -->
    <div class="mr-4 ml-4 d-none d-md-block">
      <!-- Popularity card -->
      <desktop-card title="Popularity" :subtitle="popSubtitle">
        <template v-slot:left>
          <identity-popularity side="runner" :side-data="metaData.identities.runner"/>
        </template>
        <template v-slot:right>
          <identity-popularity side="corporation" :side-data="metaData.identities.corp"/>
        </template>
      </desktop-card>
      <!-- Win rates -->
      <desktop-card title="Win rates" :subtitle="winSubtitle">
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
    LastUpdate
  },
  computed: {
    popSubtitle: function () {
      return Math.round(this.metaData.meta.standings) + ' players'
    },
    winSubtitle: function () {
      return this.metaData.meta.matches + ' matches'
    }
  }
}
</script>
<style scoped>
.divider-on-right {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
