<template>
  <v-simple-table>
    <tr v-for="(meta, index) in metas.metaList" :key="meta.code">
      <td style="width: 98%; padding: 0" class="text-center">
        <router-link :to="'/meta/' + meta.code + '/ids'" :aria-label="'drilldown to ' + meta.title + ' meta'" class="text-decoration-none"
            @click.native="$ga.event({ eventCategory: 'Navigation', eventAction: 'drilldown-meta', eventLabel: meta.code })">
          <v-btn class="drilldown-button" :color="index === 0 ? 'primary' : ''" :dark="index === 0" max-width="250">
            <div class="flex-column">
              <span>{{ meta.title }}</span>
              <div v-if="index === 0" class="caption text-lowercase" style="margin-top: -4px">latest meta</div>
            </div>
          </v-btn>
        </router-link>
      </td>
    </tr>
  </v-simple-table>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'MetaOptions',
  props: {
    metaListLoaded: Boolean
  },
  computed: {
    ...mapState(['metas'])
  }
}
</script>
