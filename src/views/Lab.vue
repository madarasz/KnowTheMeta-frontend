<template>
  <div>
    <v-content>
      <v-card>
        <v-tabs height="40px" v-model="tab" :fixed-tabs="$vuetify.breakpoint.xs">
          <v-tab href="#drilldown" @click="$router.push({ path: '/lab/drilldown' })">
            Drilldown
          </v-tab>
          <v-tab href="#archetypes" @click="$router.push({ path: '/lab/archetypes' })">
            Archetypes
          </v-tab>
        </v-tabs>
      </v-card>
      <v-container fluid class="pa-0">
        <v-tabs-items v-model="tab">
          <v-tab-item :key="1" value="drilldown" :transition="false" :reverse-transition="false">
            <drill-down/>
          </v-tab-item>
          <v-tab-item :key="2" value="archetypes" :transition="false" :reverse-transition="false">
            <under-development/>
          </v-tab-item>
        </v-tabs-items>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import DrillDown from '@/components/subview/DrillDown.vue'
import UnderDevelopment from '@/components/widget/UnderDevelopment'

export default {
  components: {
    DrillDown,
    UnderDevelopment
  },
  data: function () {
    return {
      loaded: false,
      tab: this.$route.params.subview // default tab
    }
  }
}
</script>
