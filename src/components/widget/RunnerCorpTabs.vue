<template>
  <!-- for mobile screens -->
  <div v-if="$vuetify.breakpoint.smAndDown">
    <v-card>
      <v-tabs height="36px" v-model="tab" :fixed-tabs="$vuetify.breakpoint.xs" @change="changeTab(tab)">
        <v-tab href="#runner" @click="$router.push({ path: url + '/runner' })" :data-testid="url + '/runner'">
          Runner
        </v-tab>
        <v-tab href="#corp" @click="$router.push({ path: url + '/corp' })" :data-testid="url + '/corp'">
          Corporation
        </v-tab>
      </v-tabs>
    </v-card>
    <slot name="between"></slot>
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
  props: {
    url: String
  },
  data: function () {
    return {
      tab: this.$route.params.side || 'runner' // default tab
    }
  },
  methods: {
    changeTab: function (tabName) {
      // fire analytics event
      this.$ga.event({
        eventCategory: 'UI',
        eventAction: 'change-side-tab',
        eventLabel: tabName
      })
    }
  },
  watch: {
    '$route.params.side': function (newValue, oldValue) {
      this.tab = newValue || 'runner'
    }
  }
}
</script>
