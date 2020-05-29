<template>
  <v-row class="text-center justify-center" :data-testid="testId">
    <v-col v-for="card in cardList" :key="card.code" class="text-center pl-3 pr-3 pa-1 flex-grow-0">
      <netrunner-stat-card :card="card" :runner="runner" :deck-count="deckCount"/>
    </v-col>
    <!-- empty message -->
    <v-col v-if="cardList.length === 0" class="overline mt-10">no notable cards</v-col>
  </v-row>
</template>

<script>
import NetrunnerStatCard from '@/components/widget/NetrunnerStatCard.vue'
export default {
  name: 'CardStatLister',
  props: {
    cardList: Array,
    testId: String,
    deckCount: Number,
    runner: Boolean
  },
  components: {
    NetrunnerStatCard
  }
}
</script>
