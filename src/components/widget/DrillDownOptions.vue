<template>
  <div>
    <v-stepper :value="currentStep" class="pa-0 no-transition">
      <v-stepper-header>
        <v-stepper-step step="1" :complete="currentStep > 1">
          <span class="d-xxs-hide">Select </span>side
          <small v-if="currentStep > 1" class="overline">{{sideCode}}</small>
        </v-stepper-step>
        <v-divider/>
        <v-stepper-step step="2" :complete="currentStep > 2">
          <span class="d-xxs-hide">Select </span>faction
          <small v-if="currentStep > 2" class="overline">{{factionCode}}</small>
        </v-stepper-step>
        <v-divider/>
        <v-stepper-step step="3" :complete="currentStep > 3">
          <span class="d-xxs-hide">Go to </span>ID stats
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
              <v-col cols="6" v-for="(faction, fcode) in currentFactions" :key="faction" class="pb-0">
                <router-link :to="'/lab/drilldown/' + sideCode + '/' + fcode" aria-label="back" class="text-decoration-none"
                      @click.native="$ga.event({ eventCategory: 'Navigation', eventAction: 'drilldown-faction', eventLabel: fcode })">
                  <v-btn :color="factionCodeToColor(fcode)" class="white--text pl-2 pr-2" width="100%">
                    <div class="flex-column">
                      <span>{{ faction }}</span>
                      <div v-if="miniFactions.includes(faction)" class="caption text-lowercase" style="margin-top: -4px">go to stats</div>
                    </div>
                  </v-btn>
                </router-link>
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
      <!-- Drilldown to ID -->
      <v-stepper-content step="3" class="text-center">
        <under-development/>
        <router-link :to="'/lab/drilldown/' + sideCode" aria-label="back" class="text-decoration-none d-inline-block pt-4"
              @click.native="$ga.event({ eventCategory: 'Navigation', eventAction: 'drilldown-back', eventLabel: 'to-factions' })">
          <v-btn x-small color="secondary" class="float-left mt-1">
            <v-icon small>{{ mdiArrowLeft }}</v-icon> back
          </v-btn>
        </router-link>
      </v-stepper-content>
    </v-stepper>
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
    factionCode: String,
    currentFactions: Object,
    metaListLoaded: Boolean
  },
  data: () => ({
    mdiArrowLeft,
    miniFactions: ['Adam', 'Apex', 'Sunny Lebeau']
  }),
  methods: {
    factionCodeToColor: transform.factionCodeToColor
  },
  computed: {
    ...mapState(['metas']),
    currentStep: function () {
      if (!this.sideCode) return 1
      if (!this.factionCode) return 2
      return 3
    }
  }
}
</script>
