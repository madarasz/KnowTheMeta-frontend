<template>
  <v-row class="text-center" :data-testid="testId">
    <v-col v-for="card in cardList" :key="card.code" class="text-center pa-1">
      <netrunner-card :card="card"/>
    </v-col>
    <!-- empty message -->
    <v-col v-if="cardList.length === 0" class="overline mt-10">no cards</v-col>
  </v-row>
</template>

<script>
import NetrunnerCard from '@/components/widget/NetrunnerCard.vue'
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
