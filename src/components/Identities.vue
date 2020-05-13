<template>
  <div>
    <!-- for big screens -->
    <v-row class="d-none d-md-flex">
      <v-col cols="6">
        <v-card>
          <v-card-title>
            Runner
          </v-card-title>
          <v-card-text>
            <identity-faction side="runner"/>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card>
          <v-card-title>
            Corporation
          </v-card-title>
          <v-card-text>
            <identity-faction side="corporation"/>
          </v-card-text>
        </v-card>
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
          <identity-faction side="runner"/>
        </v-tab-item>
        <v-tab-item :key="2" value="corp">
          <identity-faction side="corp"/>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </div>
</template>

<script>
import IdentityFaction from '@/components/IdentityFaction.vue'
export default {
  name: 'Identities',
  props: {
  },
  components: {
    IdentityFaction
  },
  data: () => ({
    tab: 'runner' // default tab
  }),
  mounted () {
    console.log(this.$vuetify.breakpoint)
  }
}
</script>
