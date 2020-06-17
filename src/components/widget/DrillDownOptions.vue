<template>
  <v-container class="pa-0">
    <v-row>
      <!-- Drilldown by meta -->
      <v-col cols="6" class="divider-on-right text-center">
        <h3 class="pb-2">by meta</h3>
        <v-simple-table>
          <tr v-for="(meta, index) in metas.metaList" :key="meta.code">
            <td style="width: 98%; padding: 0">
              <router-link :to="'/meta/' + meta.code + '/ids'" :aria-label="'drilldown to ' + meta.title + ' meta'" class="text-decoration-none"
                  @click.native="$ga.event({ eventCategory: 'Navigation', eventAction: 'drilldown-meta', eventLabel: meta.code })">
                <v-btn width="100%" class="with-linebreaks text-decoration-none" :color="index === 0 ? 'primary' : ''" :dark="index === 0">
                  <div class="flex-column">
                    <div>{{ meta.title }}</div>
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
        <h3 class="pb-2">by side</h3>
        <v-simple-table>
          <tr>
            <td>
              <router-link to="/drilldown/corp" aria-label="drilldown to corporation" class="text-decoration-none"
                  @click.native="$ga.event({ eventCategory: 'Navigation', eventAction: 'drilldown-side', eventLabel: 'corp' })">
                <v-btn color="rgba(0,0,255,0.7)" class="white--text" width="100%">Corporation</v-btn>
              </router-link>
            </td>
          </tr>
          <tr>
            <td>
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
        <h3 class="pb-2">
          <router-link to="/drilldown" aria-label="back" class="text-decoration-none"
                  @click.native="$ga.event({ eventCategory: 'Navigation', eventAction: 'drilldown-back', eventLabel: 'to-sides' })">
            <v-icon style="padding-bottom: 2px">{{ mdiChevronLeft }}</v-icon>
          </router-link>
          by faction
        </h3>
        <v-simple-table>
          <tr v-for="(faction, factioncode) in currentFactions" :key="faction">
            <td>
              <v-btn :color="factionCodeToColor(factioncode)" class="white--text">{{ faction }}</v-btn>
            </td>
          </tr>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import { mdiChevronLeft } from '@mdi/js'
import transform from '@/netrunnerTransformations.js'

export default {
  name: 'DrillDownOptions',
  props: {
    sideCode: String,
    currentFactions: Object,
    metaListLoaded: Boolean
  },
  data: () => ({
    mdiChevronLeft
  }),
  methods: {
    factionCodeToColor: transform.factionCodeToColor
  },
  computed: {
    ...mapState(['metas'])
  }
}
</script>
