<template>
  <div>
    <v-content>
      <v-card>
        <v-tabs height="40px" v-model="tab" :fixed-tabs="$vuetify.breakpoint.xs">
          <v-tab href="#ids">
            Identities
          </v-tab>
          <v-tab href="#decks">
            Decks
          </v-tab>
          <v-tab href="#cards">
            Cards
          </v-tab>
        </v-tabs>
      </v-card>
      <v-container fluid class="pa-0">
        <v-tabs-items v-model="tab">
          <v-tab-item :key="1" value="ids" :transition="false" :reverse-transition="false">
            <identities/>
          </v-tab-item>
          <v-tab-item :key="2" value="decks" :transition="false" :reverse-transition="false">
            <h1>Decks</h1>
          </v-tab-item>
          <v-tab-item :key="3" value="cards" :transition="false" :reverse-transition="false">
            <h1>Cards</h1>
          </v-tab-item>
        </v-tabs-items>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import Identities from '@/components/subview/Identities.vue'
export default {
  components: {
    Identities
  },
  data: () => ({
    tab: 'ids' // default tab
  })
}
</script>
