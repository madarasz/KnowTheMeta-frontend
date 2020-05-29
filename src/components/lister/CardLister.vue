<template>
  <v-row class="text-center justify-center" :data-testid="testId">
    <v-col v-for="card in cardList" :key="card.code" class="text-center pl-3 pr-3 pa-1 flex-grow-0">
      <netrunner-card :card="card"/>
    </v-col>
    <!-- empty message -->
    <v-col v-if="cardList.length === 0" class="overline mt-10">no cards</v-col>
  </v-row>
</template>

<script>
import NetrunnerCard from '@/components/cards/NetrunnerCard.vue'
export default {
  name: 'CardLister',
  props: {
    cardList: Array,
    testId: String
  },
  components: {
    NetrunnerCard
  }
}
</script>
