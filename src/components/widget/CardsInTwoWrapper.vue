<template>
  <div>
    <!-- without wrapping in card-text -->
    <cards-in-two-columns :runner-cards="runnerCards" :corp-cards="corpCards" v-if="!inCardText"
        :runner-test-id="runnerTestId" :corp-test-id="corpTestId"/>
    <!-- with wrapping -->
    <v-card-text class="pb-0 pt-0" v-if="inCardText">
      <cards-in-two-columns :runner-cards="runnerCards" :corp-cards="corpCards"
          :runner-test-id="runnerTestId" :corp-test-id="corpTestId"/>
    </v-card-text>
  </div>
</template>

<script>
import CardsInTwoColumns from '@/components/widget/CardsInTwoColumns.vue'
export default {
  name: 'CardsInWrapper',
  props: {
    runnerCards: Array,
    corpCards: Array,
    inCardText: Boolean,
    runnerTestId: String,
    corpTestId: String
  },
  components: {
    CardsInTwoColumns
  }
}
</script>
