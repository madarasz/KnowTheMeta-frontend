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
              <v-btn depressed :color="$route.path.indexOf('meta') > -1 ? 'highlight' : 'primary'" class="pr-2"  v-on="on" v-if="getCurrentMeta">
                {{ getCurrentMeta.title }}
                <v-icon icon>{{ mdiMenuDown }}</v-icon>
              </v-btn>
            </template>
            <v-list class="pa-0">
              <template v-for="(meta, i) in metas.metaList">
                <router-link :to="{ name: 'Meta', params: { metacode: getMetaCode(meta.file) } }" tag="v-list-item-two-line" :key="i">
                  <v-list-item-content class="pa-3 d-block">
                    <v-list-item-title>{{ meta.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ meta.mwl }}</v-list-item-subtitle>
                  </v-list-item-content>
                </router-link>
              </template>
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
import { mdiMenuDown } from '@mdi/js'
import { mapState, mapGetters } from 'vuex'

export default {
  data: () => ({
    mdiMenuDown
  }),
  mounted: function () {
    this.getMetas()
  },
  methods: {
    getMetas: function () {
      this.$store.dispatch('metas/getMetaList').then(() => {
        // if there is no selected meta, the first meta will be selected
        if (this.metas.currentMetaCode == null) {
          this.$store.commit('metas/fallbackToFirstMeta')
        }
        // if on the root, forward to the first meta
        if (this.$route.name === 'Root') {
          this.$router.push({ name: 'Meta', params: { metacode: this.metas.getFirstMetaCode } })
        }
      }).catch()
    }
  },
  computed: {
    ...mapState(['metas']),
    ...mapGetters({
      getMetaCode: 'metas/getMetaCode',
      getFirstMetaCode: 'metas/getFirstMetaCode',
      getCurrentMeta: 'metas/getCurrentMeta'
    })
  }
}
</script>

<style scoped>
  @import './assets/main.css';
</style>
