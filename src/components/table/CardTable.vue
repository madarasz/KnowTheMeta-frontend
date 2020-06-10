<template>
  <v-data-table :data-testid="testId" :headers="headers" :items="cardList" item-key="title" group-by="type" disable-filtering hide-default-footer
      :items-per-page="1000" dense @update:sort-by="sorting">
    <template v-slot:item.title="{ item }">
      <span :class="'netrunner-icon icon-' + item.faction"/>&nbsp;
      <router-link :to="cardUrl(item)" @click.native="$ga.event({ eventCategory: 'Navigation', eventAction: 'card-table', eventLabel: item.title })">
        {{ item.title }}
      </router-link>
    </template>
  </v-data-table>
</template>

<script>
import transform from '@/netrunnerTransformations.js'

export default {
  name: 'CardTable',
  props: {
    cardList: Array,
    testId: String
  },
  data: () => ({
    headers: [
      {
        text: 'title',
        align: 'start',
        value: 'title',
        sortable: 'false'
      },
      {
        text: 'popularity',
        align: 'end',
        value: 'popularity'
      },
      {
        text: 'winrate',
        align: 'end',
        value: 'winrate'
      },
      {
        text: 'avg. per deck',
        align: 'end',
        value: 'avg'
      }
    ]
  }),
  methods: {
    cardUrl: function (card) {
      return transform.cardUrl(card)
    },
    sorting: function (param) {
      // fire analytics event
      this.$ga.event({
        eventCategory: 'UI',
        eventAction: this.testId + '-sort',
        eventLabel: param[0]
      })
    }
  }
}
</script>
