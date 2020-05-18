<template>
  <v-row>
    <v-col v-for="card in cardList" :key="card.code" class="text-center pa-1">
      <netrunner-card :card="card"/>
    </v-col>
  </v-row>
</template>

<script>
import NetrunnerCard from '@/components/widget/NetrunnerCard.vue'
export default {
  name: 'CardLister',
  props: {
    cardList: Array
  },
  components: {
    NetrunnerCard
  }
}
</script>

<style scoped>
.pop-table tbody tr td {
  padding: 2px;
  border-bottom: 0 !important;
  height: 36px;
}
</style>
