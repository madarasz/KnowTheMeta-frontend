<template>
  <v-data-table :data-testid="testId" :headers="headers" :items="cardList" item-key="title" group-by="type" disable-filtering hide-default-footer :items-per-page="1000" dense>
    <template v-slot:item.title="{ item }">
      <span :class="'netrunner-icon icon-' + item.faction"/> <a :href="cardUrl(item)">{{ item.title }}</a>
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
    }
  }
}
</script>
