<template>
  <v-row class="text-center">
    <v-col class="caption">
      <em>
        last update: {{ metaInfo.lastUpdate }} -
        tournaments: {{ metaInfo.tournaments }} -
        players: {{ Math.round(metaInfo.standings / 2) }} -
        decks: {{ (metaInfo.runnerDecks + metaInfo.corpDecks) }} -
        matches: {{ metaInfo.matches }}
      </em>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'CardLister',
  props: {
    metaInfo: Object
  }
}
</script>
