<template>
  <div>
    <!-- runner/corp tabs for small screens -->
    <v-card class="d-md-none">
      <v-tabs height="36px" v-model="tab" :fixed-tabs="$vuetify.breakpoint.xs">
        <v-tab href="#runner">
          Runner
        </v-tab>
        <v-tab href="#corp">
          Corporation
        </v-tab>
      </v-tabs>
    </v-card>
    <!-- Popularity card -->
    <v-row class="ml-2 mr-2 mt-2">
      <v-col cols="12">
        <v-card>
          <v-card-title style="background-color: rgba(53, 149, 185, 0.5)">
            Popularity
            <v-spacer/>
            <span class="overline">
              {{ metaData.meta.tournaments }} tournaments,
              {{ Math.round(metaData.meta.standings / 2) }} attendees
            </span>
          </v-card-title>
          <v-text>
            <!-- for big screens -->
            <v-row dense class="d-none d-md-block">
              <v-col cols="6" class="divider-on-right">
                <identity-faction-popularity side="runner" :side-data="metaData.identities.runner"/>
              </v-col>
              <v-col cols="6">
                <identity-faction-popularity side="corporation" :side-data="metaData.identities.corp"/>
              </v-col>
            </v-row>
          </v-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- Win rates -->
    <h3 class="d-none d-md-block">Win rates</h3>
    <v-row class="d-none d-md-flex ml-2 mr-2">
      <v-col cols="6">
        <identity-faction-winrate side="runner" :side-data="metaData.identities.runner"/>
      </v-col>
      <v-col cols="6">
        <identity-faction-winrate side="corporation" :side-data="metaData.identities.corp"/>
      </v-col>
    </v-row>
      <!-- tab items -->
      <v-tabs-items v-model="tab" class="d-md-none">
        <v-tab-item :key="1" value="runner">
          <identity-faction-popularity side="runner" :side-data="metaData.identities.runner"/>
          <identity-faction-winrate side="runner" :side-data="metaData.identities.runner"/>
        </v-tab-item>
        <v-tab-item :key="2" value="corp">
          <identity-faction-popularity side="corp" :side-data="metaData.identities.corp"/>
          <identity-faction-winrate side="corporation" :side-data="metaData.identities.corp"/>
        </v-tab-item>
      </v-tabs-items>
  </div>
</template>

<script>
import IdentityFactionPopularity from '@/components/IdentityFactionPopularity.vue'
import IdentityFactionWinrate from '@/components/IdentityFactionWinrate.vue'
import metaData from '@/assets/json/uprising.json'
export default {
  name: 'Identities',
  props: {
  },
  components: {
    IdentityFactionPopularity,
    IdentityFactionWinrate
  },
  data: () => ({
    metaData,
    tab: 'runner' // default tab
  }),
  mounted () {
  }
}
</script>
<style scoped>
.divider-on-right {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
