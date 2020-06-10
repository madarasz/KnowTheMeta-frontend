<template>
  <div :data-testid="testId">
    <template v-for="cycle in cycleList">
      <div :key="cycle.code">
        <desktop-card-subtitle :subtitle="cycle.name"/>
        <template v-for="pack in getPacks(cycle.code)">
          <!-- legal -->
          <v-row align="center" :key="pack.name" class="rotation-content bordered-bottom"
              v-if="!legalReprints" :data-testid="testId + '-' + pack.code">
            <v-col>{{ pack.name }}</v-col>
            <v-col class="text-right">{{ pack.size }} cards</v-col>
            <v-col class="text-right">{{ pack.date_release }}</v-col>
          </v-row>
          <!-- rotated -->
          <v-expansion-panels :key="pack.name" v-if="legalReprints" flat :data-testid="testId + '-' + pack.code">
            <v-expansion-panel @change="expand(pack.code)">
              <!-- header -->
              <v-expansion-panel-header class="rotation-content bordered-bottom pt-0 pb-0 pl-3 pr-3" style="line-height: 21px">
                <v-row align="center">
                  <v-col>{{ pack.name }}</v-col>
                  <v-col class="text-right">
                    {{ pack.legal_reprints.length }} / {{ pack.size }}
                    <br v-if="$vuetify.breakpoint.xsOnly"/>
                    cards legal
                  </v-col>
                  <v-col class="text-right">{{ pack.date_release }}</v-col>
                </v-row>
              </v-expansion-panel-header>
              <!-- legal cardlist -->
              <v-expansion-panel-content class="bordered-bottom pb-2">
                <small v-if="pack.legal_reprints.length" :data-testid="'legal-list-' + pack.code">
                  <strong>legal cards: </strong>
                  <em v-for="(reprint, index) in pack.legal_reprints" :key="reprint">
                    {{ reprint }}<span v-if="index !== pack.legal_reprints.length - 1">, </span>
                  </em>
                </small>
                <small v-if="pack.legal_reprints.length === 0">
                  <strong>no legal cards</strong>
                </small>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DesktopCardSubtitle from '@/components/header/DesktopCardSubtitle.vue'
import transform from '@/store/nrdbTransformations'

export default {
  name: 'CycleLister',
  props: {
    cycleList: Array,
    legalReprints: Boolean,
    testId: String
  },
  components: {
    DesktopCardSubtitle
  },
  methods: {
    getPacks: function (cycleCode) {
      return this.netrunnerdb.packs.filter(x => { return x.cycle_code === cycleCode }).sort(transform.compareReleaseDates)
    },
    expand: function (packcode) {
      // fire analytics event
      this.$ga.event({
        eventCategory: 'UI',
        eventAction: 'rotated-expand/contract',
        eventLabel: packcode
      })
    }
  },
  computed: {
    ...mapState(['netrunnerdb'])
  }
}
</script>

<style scoped>
.bordered-bottom {
  border-bottom: thin solid rgba(0,0,0,.12);
}
.rotation-content {
  font-size: .875rem;
  color: rgba(0,0,0,0.6);
  margin: 0;
}
.v-expansion-panel--active>.v-expansion-panel-header {
  min-height: unset;
  border-bottom: 0 !important;
}
</style>
