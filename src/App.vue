<template>
  <div>
    <v-app>
      <!-- app bar -->
      <app-bar :prev-route="prevRoute"/>
      <!-- router view -->
      <router-view/>
      <!-- snackbar messages -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout"
          :left="snackbar.left" :right="snackbar.right"
          :bottom="snackbar.bottom" :top="snackbar.bottom"
          data-testid="snackbar">
        {{ snackbar.message }}
        <v-btn dark text @click="closeSnackbar">Close</v-btn>
      </v-snackbar>
    </v-app>
  </div>
</template>

<script>
import AppBar from '@/components/widget/AppBar.vue'
import { mapState, mapMutations } from 'vuex'

export default {
  components: {
    AppBar
  },
  data: () => ({
    prevRoute: { fullPath: '/' }
  }),
  methods: {
    ...mapMutations({
      closeSnackbar: 'snackbar/closeSnackbar'
    })
  },
  computed: {
    ...mapState(['snackbar'])
  },
  watch: {
    '$route' (to, from) {
      document.title = to.meta.title || 'Know the Meta - Netrunner'
      this.prevRoute = from
    }
  }
}
</script>

<style scoped>
  @import './assets/main.css';
  @import './assets/netrunnerfont.css'
</style>
