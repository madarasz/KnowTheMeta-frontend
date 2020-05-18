<template>
  <v-row>
    <v-col cols="6" class="divider-on-right">
      <card-lister :card-list="runnerCards"/>
    </v-col>
    <v-col>
      <card-lister :card-list="corpCards"/>
    </v-col>
  </v-row>
</template>

<script>
import CardLister from '@/components/widget/CardLister.vue'
export default {
  name: 'CardsInTwoColumns',
  props: {
    runnerCards: Array,
    corpCards: Array
  },
  components: {
    CardLister
  }
}
</script>
