<template>
  <div>
    <v-app>
      <v-app-bar dark color="primary" dense app>
        <div class="mr-4">
          <v-img :src="require('./assets/ktm.png')" width="24px"/>
        </div>
        <v-toolbar-title class="mr-4 d-none d-sm-flex">
          Know the Meta
        </v-toolbar-title>
        <!-- Meta selector -->
        <v-toolbar-items>
          <v-menu bottom left v-if="loaded">
            <!-- Meta name -->
            <template v-slot:activator="{ on }">
              <v-btn depressed :color="$route.path.indexOf('meta') > -1 ? 'highlight' : 'primary'" class="pr-2"  v-on="on" data-testid="current-meta">
                <span class="d-none d-sm-block">{{ currentMetaTitle ? currentMetaTitle : 'loading' }}</span>
                <span class="d-flex d-sm-none">{{ shortMetaTitle }}</span>
                <v-icon icon data-testid="icon-meta-select" v-if="currentMetaTitle">{{ mdiMenuDown }}</v-icon>
              </v-btn>
            </template>
            <!-- Meta list -->
            <v-list data-testid="list-metas">
              <template v-for="(meta, i) in metas.metaList">
                <router-link :to="'/meta/' + meta.code" tag="v-list-item" :key="i">
                  <v-list-item-content>
                    <v-list-item-title>{{ meta.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ meta.mwl }}</v-list-item-subtitle>
                  </v-list-item-content>
                </router-link>
              </template>
            </v-list>
          </v-menu>
        </v-toolbar-items>
        <v-spacer></v-spacer>
        <!-- Other menu items -->
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
import { mapState, mapGetters, mapMutations } from 'vuex'
import transform from '@/netrunnerTransformations.js'

export default {
  data: () => ({
    mdiMenuDown,
    loaded: false
  }),
  mounted: function () {
    this.getMetas()
  },
  methods: {
    getMetas: function () {
      this.$store.dispatch('metas/getMetaList').then(() => {
        this.loaded = true
        // if not on a meta page and there is no previously selected meta, then the latest meta will be selected
        if (this.metas.currentMetaCode == null && this.$route.path.indexOf('meta') === -1) {
          this.fallbackToLatestMeta()
        }
        // if on the root, forward to the latest meta
        if (this.$route.name === 'Root') {
          this.$router.push('/meta/' + this.latestMetaCode).catch(err => {
            console.error('Could not navigate to latest meta: ' + err)
          })
        }
      }).catch()
    },
    ...mapMutations({
      fallbackToLatestMeta: 'metas/fallbackToLatestMeta'
    })
  },
  computed: {
    ...mapState(['metas']),
    ...mapGetters({
      latestMetaCode: 'metas/getLatestMetaCode',
      currentMetaTitle: 'metas/getCurrentMetaTitle'
    }),
    shortMetaTitle: function () {
      return transform.shortenMeta(this.currentMetaTitle)
    }
  }
}
</script>

<style scoped>
  @import './assets/main.css';
</style>
