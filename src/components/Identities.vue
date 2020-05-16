<template>
  <div>
    <!-- Small screens -->
    <div class="d-md-none">
      <!-- runner / corp tabs -->
      <v-card>
        <v-tabs height="36px" v-model="tab" :fixed-tabs="$vuetify.breakpoint.xs">
          <v-tab href="#runner">
            Runner
          </v-tab>
          <v-tab href="#corp">
            Corporation
          </v-tab>
        </v-tabs>
      </v-card>
      <!-- tab items -->
      <v-tabs-items v-model="tab">
        <v-tab-item :key="1" value="runner">
          <mobile-panel title="Popularity" :subtitle="popSubtitle">
            <identity-faction-popularity side="runner" :side-data="metaData.identities.runner"/>
          </mobile-panel>
          <mobile-panel title="Win rates" :subtitle="winSubtitle">
            <identity-faction-winrate side="runner" :side-data="metaData.identities.runner"/>
          </mobile-panel>
        </v-tab-item>
        <v-tab-item :key="2" value="corp">
          <mobile-panel title="Popularity" :subtitle="popSubtitle">
            <identity-faction-popularity side="corp" :side-data="metaData.identities.corp"/>
          </mobile-panel>
          <mobile-panel title="Win rates" :subtitle="winSubtitle">
            <identity-faction-winrate side="corporation" :side-data="metaData.identities.corp"/>
          </mobile-panel>
        </v-tab-item>
      </v-tabs-items>
    </div>
    <!-- Desktop screens -->
    <div class="mr-4 ml-4 d-none d-md-block">
      <!-- Popularity card -->
      <desktop-card title="Popularity" :subtitle="popSubtitle">
        <v-row dense>
          <v-col cols="6" class="divider-on-right">
            <identity-faction-popularity side="runner" :side-data="metaData.identities.runner"/>
          </v-col>
          <v-col cols="6">
            <identity-faction-popularity side="corporation" :side-data="metaData.identities.corp"/>
          </v-col>
        </v-row>
      </desktop-card>
      <!-- Win rates -->
      <desktop-card title="Win rates" :subtitle="winSubtitle">
        <v-row class="d-none d-md-flex ml-2 mr-2">
          <v-col cols="6" class="divider-on-right">
            <identity-faction-winrate side="runner" :side-data="metaData.identities.runner"/>
          </v-col>
          <v-col cols="6">
            <identity-faction-winrate side="corporation" :side-data="metaData.identities.corp"/>
          </v-col>
        </v-row>
      </desktop-card>
    </div>
  </div>
</template>

<script>
import IdentityFactionPopularity from '@/components/IdentityFactionPopularity.vue'
import IdentityFactionWinrate from '@/components/IdentityFactionWinrate.vue'
import DesktopCard from '@/components/DesktopCard.vue'
import MobilePanel from '@/components/MobilePanel.vue'
import metaData from '@/assets/json/uprising.json'
export default {
  name: 'Identities',
  props: {
  },
  components: {
    IdentityFactionPopularity,
    IdentityFactionWinrate,
    DesktopCard,
    MobilePanel
  },
  data: () => ({
    metaData,
    tab: 'runner' // default tab
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
