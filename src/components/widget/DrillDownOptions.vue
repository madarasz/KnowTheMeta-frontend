<template>
  <div style="margin-left: -16px; margin-right: -16px; margin-bottom: -16px">
    <v-stepper :value="currentStep" class="pa-0 no-transition">
      <v-stepper-header>
        <v-stepper-step step="1" :complete="currentStep > 1">
          Select side
          <small v-if="currentStep > 1" class="overline">{{sideCode}}</small>
        </v-stepper-step>
        <v-divider/>
        <v-stepper-step step="2" :complete="currentStep > 2">
          Select faction
        </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <!-- Drilldown by side -->
        <v-stepper-content step="1">
          <v-container class="pa-0">
            <v-row>
              <v-col cols="6" class="text-center">
                <router-link to="/lab/drilldown/corp" aria-label="drilldown to corporation" class="text-decoration-none"
                  @click.native="$ga.event({ eventCategory: 'Navigation', eventAction: 'drilldown-side', eventLabel: 'corp' })">
                  <v-btn color="rgba(0,0,255,0.7)" class="white--text drilldown-button" width="100%">Corporation</v-btn>
                </router-link>
              </v-col>
              <v-col cols="6" class="text-center">
                <router-link to="/lab/drilldown/runner" aria-label="drilldown to runner" class="text-decoration-none"
                  @click.native="$ga.event({ eventCategory: 'Navigation', eventAction: 'drilldown-side', eventLabel: 'runner' })">
                  <v-btn color="rgba(255,0,0,0.7)" class="white--text" width="100%">Runner</v-btn>
                </router-link>
              </v-col>
            </v-row>
          </v-container>
        </v-stepper-content>
        <!-- Drilldown by faction -->
        <v-stepper-content step="2" class="text-center">
          <under-development/>
          <v-container class="pa-0">
            <v-row>
              <v-col cols="6" v-for="(faction, factioncode) in currentFactions" :key="faction" class="pb-0">
                <v-btn :color="factionCodeToColor(factioncode)" class="white--text pl-2 pr-2" width="100%">{{ faction }}</v-btn>
              </v-col>
            </v-row>
          </v-container>
          <router-link to="/lab/drilldown" aria-label="back" class="text-decoration-none d-inline-block pt-4"
                @click.native="$ga.event({ eventCategory: 'Navigation', eventAction: 'drilldown-back', eventLabel: 'to-sides' })">
            <v-btn x-small color="secondary" class="float-left mt-1">
              <v-icon small>{{ mdiArrowLeft }}</v-icon> back
            </v-btn>
          </router-link>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  <!-- <v-container class="pa-4">
    <v-row>
      <v-col cols="12" class="text-center" v-if="sideCode">
        <v-row dense v-if="$vuetify.breakpoint.mdAndUp">
          <v-col cols="3" class="pt-0">
            <router-link to="/lab/drilldown" aria-label="back" class="text-decoration-none"
                  @click.native="$ga.event({ eventCategory: 'Navigation', eventAction: 'drilldown-back', eventLabel: 'to-sides' })">
              <v-btn x-small color="secondary" class="float-left mt-1">
                <v-icon>{{ mdiArrowLeft }}</v-icon>
              </v-btn>
            </router-link>
          </v-col>
          <v-col cols="6" class="pt-0">
            <h3 class="pb-2">
              by faction
            </h3>
          </v-col>
        </v-row>
        <desktop-card-subtitle subtitle="by faction" v-if="!$vuetify.breakpoint.mdAndUp" class="drilldown-subtitle-right"/>
        <v-simple-table>
          <tr v-for="(faction, factioncode) in currentFactions" :key="faction">
            <td class="pr-0 pl-0">
              <v-btn :color="factionCodeToColor(factioncode)" class="white--text pl-2 pr-2">{{ faction }}</v-btn>
            </td>
          </tr>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mdiArrowLeft } from '@mdi/js'
import transform from '@/netrunnerTransformations.js'
import UnderDevelopment from '@/components/widget/UnderDevelopment'

export default {
  name: 'DrillDownOptions',
  components: {
    UnderDevelopment
  },
  props: {
    sideCode: String,
    currentFactions: Object,
    metaListLoaded: Boolean
  },
  data: () => ({
    mdiArrowLeft
  }),
  methods: {
    factionCodeToColor: transform.factionCodeToColor
  },
  computed: {
    ...mapState(['metas']),
    currentStep: function () {
      if (!this.sideCode) return 1
      return 2
    }
  }
}
</script>
