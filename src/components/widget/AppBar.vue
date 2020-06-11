<template>
  <v-app-bar dark dense app :color="$route.name !== 'Card statistics' ? 'primary' : 'black'">
    <!-- Ktm Logo -->
    <div class="app-logo">
      <router-link :to="latestMetaUrl" aria-label="to latest meta"
          @click.native="$ga.event({ eventCategory: 'Navigation', eventAction: 'logo' })">
        <v-img :src="require('../../assets/ktm.png')" width="24px" aria-label="logo"/>
      </router-link>
    </div>
    <!-- Regular app bar -->
    <v-toolbar-title class="mr-4 d-none d-sm-flex" v-if="$route.name !== 'Card statistics'">
      <h1>Know the Meta</h1>
    </v-toolbar-title>
    <!-- Meta selector -->
    <v-toolbar-items v-if="$route.name !== 'Card statistics'">
      <v-menu bottom left v-if="metas && metas.metaList.length > 0">
        <!-- Meta name -->
        <template v-slot:activator="{ on }">
          <v-btn depressed :color="$route.path.indexOf('meta') > -1 ? 'highlight' : 'primary'" class="meta-button" v-on="on" data-testid="current-meta">
            <span class="d-none d-sm-block">{{ currentMetaTitle ? currentMetaTitle : 'loading' }}</span>
            <span class="d-flex d-sm-none">{{ shortMetaTitle }}</span>
            <v-icon icon data-testid="icon-meta-select" v-if="currentMetaTitle">{{ mdiMenuDown }}</v-icon>
          </v-btn>
        </template>
        <!-- Meta list -->
        <v-list data-testid="list-metas">
          <template v-for="(meta, i) in metas.metaList">
            <router-link :to="'/meta/' + meta.code + '/' + ($route.params.subview ? $route.params.subview : 'ids')" tag="v-list-item" :key="i">
              <v-list-item-content>
                <v-list-item-title>{{ meta.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ meta.mwl }}</v-list-item-subtitle>
              </v-list-item-content>
            </router-link>
          </template>
        </v-list>
      </v-menu>
    </v-toolbar-items>
    <v-spacer v-if="$route.name !== 'Card statistics'"/>
    <card-autocomplete @mobile-search="mobileSearch = $event" v-if="$route.name !== 'Card statistics'"/>
    <!-- Other menu items -->
    <v-toolbar-items v-if="$route.name !== 'Card statistics' && !mobileSearch">
      <v-btn depressed :color="$route.path === '/MWL' ? 'highlight' : 'primary'" class="menu-button" data-testid="menu-mwl">
        <router-link to="/MWL" tag="span">
          MWL
        </router-link>
      </v-btn>
      <v-btn depressed :color="$route.path === '/Rotation' ? 'highlight' : 'primary'" class="menu-button" data-testid="menu-rotation">
        <router-link to="/Rotation" tag="span">
          Rotation
        </router-link>
      </v-btn>
    </v-toolbar-items>
    <!-- Card stat app bar -->
    <v-btn icon depressed @click="goBack" v-if="$route.name === 'Card statistics'" aria-label="navigate back" data-testid="menu-back">
      <v-icon>{{ mdiArrowLeft }}</v-icon>
    </v-btn>
    <v-toolbar-title class="mr-4" v-if="$route.name === 'Card statistics' && cards && cards.currentCardTitle" data-testid="card-title">
      <h1>{{ cards.currentCardTitle }}</h1>
    </v-toolbar-title>
  </v-app-bar>
</template>

<script>
import { VListItem } from 'vuetify/lib'
import CardAutocomplete from '@/components/widget/CardAutocomplete.vue'
import { mdiMenuDown, mdiArrowLeft } from '@mdi/js'
import { mapState, mapGetters, mapMutations } from 'vuex'
import transform from '@/netrunnerTransformations.js'

export default {
  name: 'AppBar',
  props: {
    prevRoute: Object
  },
  components: {
    CardAutocomplete,
    VListItem // eslint-disable-line vue/no-unused-components
  },
  data: () => ({
    mdiMenuDown,
    mdiArrowLeft,
    mobileSearch: false
  }),
  mounted: function () {
    this.getMetas()
  },
  methods: {
    getMetas: function () {
      this.$store.dispatch('metas/getMetaList').then(() => {
        // if not on a meta page and there is no previously selected meta, then the latest meta will be selected
        if (this.metas.currentMetaCode == null && this.$route.path.indexOf('meta') === -1) {
          this.fallbackToLatestMeta()
        }
        // if on the root, forward to the latest meta
        if (this.$route.name === 'Root') {
          this.$router.push(this.latestMetaUrl).catch()
        }
      }).catch(() => {
        this.showError('Could not load metas')
      })
    },
    goBack: function () {
      // fire analytics event
      this.$ga.event({ eventCategory: 'Navigation', eventAction: 'back' })
      // navigate
      if (this.prevRoute.fullPath === '/') {
        // this was the first page, going to latest meta instead of back
        this.$router.push(this.latestMetaUrl)
      } else {
        // navigate back
        this.$router.go(-1)
      }
    },
    ...mapMutations({
      fallbackToLatestMeta: 'metas/fallbackToLatestMeta'
    })
  },
  computed: {
    ...mapState(['metas', 'cards']),
    ...mapGetters({
      latestMetaCode: 'metas/getLatestMetaCode',
      currentMetaTitle: 'metas/getCurrentMetaTitle'
    }),
    shortMetaTitle: function () {
      return transform.shortenMeta(this.currentMetaTitle)
    },
    latestMetaUrl: function () {
      return '/meta/' + this.latestMetaCode + '/ids'
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
  font-weight: unset;
}
</style>
