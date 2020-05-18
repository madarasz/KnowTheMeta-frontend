<template>
  <!-- for mobile screens -->
  <div v-if="$vuetify.breakpoint.smAndDown">
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
    <v-tabs-items v-model="tab">
      <v-tab-item :key="1" value="runner">
        <slot name="runner"></slot>
      </v-tab-item>
      <v-tab-item :key="2" value="corp">
        <slot name="corp"></slot>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
export default {
  name: 'RunnerCorpTabs',
  data: () => ({
    tab: 'runner' // default tab
  })
}
</script>
