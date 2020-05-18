<template>
  <div>
    <!-- Small screens -->
    <runner-corp-tabs>
      <!-- Runner -->
      <template v-slot:runner>
        <mobile-panel title="Popularity" :subtitle="popSubtitle">
          <identity-faction-popularity side="runner" :side-data="metaData.identities.runner"/>
        </mobile-panel>
        <mobile-panel title="Win rates" :subtitle="winSubtitle">
          <identity-faction-winrate side="runner" :side-data="metaData.identities.runner"/>
        </mobile-panel>
      </template>
      <!-- Corp -->
      <template v-slot:corp>
        <mobile-panel title="Popularity" :subtitle="popSubtitle">
          <identity-faction-popularity side="corp" :side-data="metaData.identities.corp"/>
        </mobile-panel>
        <mobile-panel title="Win rates" :subtitle="winSubtitle">
          <identity-faction-winrate side="corporation" :side-data="metaData.identities.corp"/>
        </mobile-panel>
      </template>
    </runner-corp-tabs>
    <!-- Desktop screens -->
    <div class="mr-4 ml-4 d-none d-md-block">
      <!-- Popularity card -->
      <desktop-card title="Popularity" :subtitle="popSubtitle">
        <template v-slot:left>
          <identity-faction-popularity side="runner" :side-data="metaData.identities.runner"/>
        </template>
        <template v-slot:right>
          <identity-faction-popularity side="corporation" :side-data="metaData.identities.corp"/>
        </template>
      </desktop-card>
      <!-- Win rates -->
      <desktop-card title="Win rates" :subtitle="winSubtitle">
        <template v-slot:left>
          <identity-faction-winrate side="runner" :side-data="metaData.identities.runner"/>
        </template>
        <template v-slot:right>
          <identity-faction-winrate side="corporation" :side-data="metaData.identities.corp"/>
        </template>
      </desktop-card>
    </div>
  </div>
</template>

<script>
import IdentityFactionPopularity from '@/components/widget/IdentityPopularity.vue'
import IdentityFactionWinrate from '@/components/widget/IdentityWinrate.vue'
import DesktopCard from '@/components/header/DesktopCard.vue'
import MobilePanel from '@/components/header/MobilePanel.vue'
import metaData from '@/assets/json/uprising.json'
import RunnerCorpTabs from '@/components/widget/RunnerCorpTabs.vue'
export default {
  name: 'Identities',
  props: {
  },
  components: {
    IdentityFactionPopularity,
    IdentityFactionWinrate,
    DesktopCard,
    MobilePanel,
    RunnerCorpTabs
  },
  data: () => ({
    metaData
  }),
  computed: {
    popSubtitle: function () {
      return Math.round(metaData.meta.standings) + ' players'
    },
    winSubtitle: function () {
      return metaData.meta.matches + ' matches'
    }
  }
}
</script>
<style scoped>
.divider-on-right {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
