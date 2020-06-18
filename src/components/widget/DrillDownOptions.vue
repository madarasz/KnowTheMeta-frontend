<template>
  <v-container class="pa-0">
    <v-row>
      <!-- Drilldown by meta -->
      <v-col cols="6" class="divider-on-right text-center">
        <h3 class="pb-2" v-if="$vuetify.breakpoint.mdAndUp">by meta</h3>
        <desktop-card-subtitle subtitle="by meta" v-if="!$vuetify.breakpoint.mdAndUp" class="drilldown-subtitle-left"/>
        <v-simple-table>
          <tr v-for="(meta, index) in metas.metaList" :key="meta.code">
            <td style="width: 98%; padding: 0">
              <router-link :to="'/meta/' + meta.code + '/ids'" :aria-label="'drilldown to ' + meta.title + ' meta'" class="text-decoration-none"
                  @click.native="$ga.event({ eventCategory: 'Navigation', eventAction: 'drilldown-meta', eventLabel: meta.code })">
                <v-btn class="drilldown-button" :color="index === 0 ? 'primary' : ''" :dark="index === 0">
                  <div class="flex-column">
                    <span>{{ meta.title }}</span>
                    <div v-if="index === 0" class="caption text-lowercase" style="margin-top: -4px">latest meta</div>
                  </div>
                </v-btn>
              </router-link>
            </td>
          </tr>
        </v-simple-table>
      </v-col>
      <!-- Drilldown by side -->
      <v-col cols="6" class="text-center" v-if="!sideCode && metaListLoaded">
        <h3 class="pb-2" v-if="$vuetify.breakpoint.mdAndUp">by side</h3>
        <desktop-card-subtitle subtitle="by side" v-if="!$vuetify.breakpoint.mdAndUp" class="drilldown-subtitle-right"/>
        <v-simple-table>
          <tr>
            <td class="pa-0">
              <router-link to="/drilldown/corp" aria-label="drilldown to corporation" class="text-decoration-none"
                  @click.native="$ga.event({ eventCategory: 'Navigation', eventAction: 'drilldown-side', eventLabel: 'corp' })">
                <v-btn color="rgba(0,0,255,0.7)" class="white--text drilldown-button" width="100%">Corporation</v-btn>
              </router-link>
            </td>
          </tr>
          <tr>
            <td class="pa-0">
              <router-link to="/drilldown/runner" aria-label="drilldown to runner" class="text-decoration-none"
                  @click.native="$ga.event({ eventCategory: 'Navigation', eventAction: 'drilldown-side', eventLabel: 'runner' })">
                <v-btn color="rgba(255,0,0,0.7)" class="white--text" width="100%">Runner</v-btn>
              </router-link>
            </td>
          </tr>
        </v-simple-table>
      </v-col>
      <!-- Drilldown by faction -->
      <v-col cols="6" class="text-center" v-if="sideCode">
        <v-row dense v-if="$vuetify.breakpoint.mdAndUp">
          <v-col cols="3" class="pt-0">
            <router-link to="/drilldown" aria-label="back" class="text-decoration-none"
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
  </v-container>
</template>

<script>
import DesktopCardSubtitle from '@/components/header/DesktopCardSubtitle.vue'
import { mapState } from 'vuex'
import { mdiArrowLeft } from '@mdi/js'
import transform from '@/netrunnerTransformations.js'

export default {
  name: 'DrillDownOptions',
  props: {
    sideCode: String,
    currentFactions: Object,
    metaListLoaded: Boolean
  },
  components: {
    DesktopCardSubtitle
  },
  data: () => ({
    mdiArrowLeft
  }),
  methods: {
    factionCodeToColor: transform.factionCodeToColor
  },
  computed: {
    ...mapState(['metas'])
  }
}
</script>
