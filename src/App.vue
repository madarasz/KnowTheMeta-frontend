<template>
  <div id="app">
    <v-app id="app">
      <v-app-bar dark color="primary" dense app>
        <!-- <v-app-bar-nav-icon>
        </v-app-bar-nav-icon> -->
        <div class="mr-4">
          <v-img :src="require('./assets/ktm.png')" width="24px"/>
        </div>
        <v-toolbar-title class="mr-4 d-none d-sm-flex">
          Know the Meta
        </v-toolbar-title>
        <v-toolbar-items>
          <v-menu bottom left>
            <template v-slot:activator="{ on }">
              <v-btn depressed :color="$route.path.indexOf('Meta') > -1 ? 'highlight' : 'primary'" class="pr-2">
                Uprising
                <v-icon icon v-on="on">{{ mdiMenuDown }}</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(meta, i) in metaData" :key="i">
                <router-link :to="'/Meta/' + getMetaPath(meta.file)">
                  <v-list-item-title>{{ meta.title }}</v-list-item-title>
                </router-link>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar-items>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn depressed :color="$route.path === '/MWL' ? 'highlight' : 'primary'">
            <router-link to="/MWL" tag="span">
              MWL
            </router-link>
          </v-btn>
          <v-btn depressed :color="$route.path === '/Rotation' ? 'highlight' : 'primary'">
            <router-link to="/Rotation" tag="span">
              Rotation
            </router-link>
          </v-btn>
        </v-toolbar-items>
      </v-app-bar>
      <router-view/>
    </v-app>
  </div>
</template>

<script>
import axios from 'axios'
import { mdiMenuDown } from '@mdi/js'
export default {
  data: () => ({
    metaData: [],
    mdiMenuDown
  }),
  mounted: function () {
    this.getMetas()
  },
  methods: {
    getMetas: function () {
      axios.get('https://alwaysberunning.net/ktm/metas.json').then((response) => {
        this.metaData = response.data
        // forward to latest meta from root
        if (this.$route.name === 'Root') {
          this.$router.push('/Meta/' + this.getMetaPath(this.metaData[0].file))
        }
      }).catch(() => {
        // TODO: error handling
      })
    },
    getMetaPath: function (filename) {
      return filename[0].toUpperCase() + filename.slice(1, -5) // capitalize, remove ".json" from the end
    }
  }
}
</script>

<style scoped>
  @import './assets/main.css';
</style>
