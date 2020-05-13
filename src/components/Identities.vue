<template>
  <div>
    <!-- for big screens -->
    <h3 class="d-none d-md-block">Popularity</h3>
    <v-row class="d-none d-md-flex ml-2 mr-2">
      <v-col cols="6">
        <identity-faction-popularity side="runner" :side-data="metaData.identities.runner"/>
      </v-col>
      <v-col cols="6">
        <identity-faction-popularity side="corporation" :side-data="metaData.identities.corp"/>
      </v-col>
    </v-row>
    <!-- for small screens -->
    <div class="d-md-none">
      <v-card>
        <!-- tabs -->
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
          <identity-faction-popularity side="runner" :side-data="metaData.identities.runner"/>
        </v-tab-item>
        <v-tab-item :key="2" value="corp">
          <identity-faction-popularity side="corp" :side-data="metaData.identities.corp"/>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import IdentityFactionPopularity from '@/components/IdentityFactionPopularity.vue'
import metaData from '@/assets/json/uprising.json'
export default {
  name: 'Identities',
  props: {
  },
  components: {
    IdentityFactionPopularity
  },
  data: () => ({
    metaData,
    tab: 'runner' // default tab
  }),
  mounted () {
    console.log(this.$vuetify.breakpoint)
  }
}
</script>
