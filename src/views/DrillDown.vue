<template>
  <v-content>
    <!-- Desktop -->
    <div class="mr-4 ml-4" v-if="$vuetify.breakpoint.mdAndUp">
      <desktop-card title="Win rates over time">
        <template v-slot:left>
          <side-winrate-meta :meta-data="metas"/>
        </template>
        <template v-slot:right>
          <h3 class="text-center pb-2">Drilldown</h3>
          <v-container class="pa-0">
            <v-row>
              <v-col cols="6" class="divider-on-right text-center">
                <h3>by side</h3>
                <v-simple-table>
                  <tr>
                    <td>
                      <v-btn color="rgba(0,0,255,0.7)" class="white--text" width="100%">Corporation</v-btn>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <v-btn color="rgba(255,0,0,0.7)" class="white--text" width="100%">Runner</v-btn>
                    </td>
                  </tr>
                </v-simple-table>
              </v-col>
              <v-col cols="6" class="text-center">
                <h3>by meta</h3>
                <v-simple-table>
                  <tr v-for="meta in metas.metaList" :key="meta.code">
                    <td style="width: 98%; padding: 0">
                      <router-link :to="'/meta/' + meta.code + '/ids'" :aria-label="'to ' + meta.title + ' meta'"
                          @click.native="$ga.event({ eventCategory: 'Navigation', eventAction: 'drilldown-meta', eventLabel: meta.code })">
                        <v-btn width="100%" class="d-inline-block" style="overflow: hidden; white-space: normal">{{ meta.title }}</v-btn>
                      </router-link>
                    </td>
                  </tr>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-container>
        </template>
      </desktop-card>
    </div>
  </v-content>
</template>

<script>
import DesktopCard from '@/components/header/DesktopCard.vue'
import SideWinrateMeta from '@/components/chart/SideWinrateMeta.vue'
import { mapState } from 'vuex'

export default {
  name: 'DrillDown',
  components: {
    DesktopCard,
    SideWinrateMeta
  },
  computed: {
    ...mapState(['metas'])
  }
}
</script>
