<template>
  <div>
    <!-- without wrapping in card-text -->
    <cards-in-two-columns :runner-cards="runnerCards" :corp-cards="corpCards" v-if="!inCardText"/>
    <!-- with wrapping -->
    <v-card-text class="pb-0" v-if="inCardText">
      <cards-in-two-columns :runner-cards="runnerCards" :corp-cards="corpCards"/>
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
    inCardText: Boolean
  },
  components: {
    CardsInTwoColumns
  }
}
</script>
