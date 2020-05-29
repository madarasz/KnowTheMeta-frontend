<template>
  <v-row>
    <v-col cols="6" class="divider-on-right">
      <card-lister :card-list="runnerCards" :test-id="runnerTestId"/>
    </v-col>
    <v-col>
      <card-lister :card-list="corpCards" :test-id="corpTestId"/>
    </v-col>
  </v-row>
</template>

<script>
import CardLister from '@/components/lister/CardLister.vue'
export default {
  name: 'CardsInTwoColumns',
  props: {
    runnerCards: Array,
    corpCards: Array,
    runnerTestId: String,
    corpTestId: String
  },
  components: {
    CardLister
  }
}
</script>
