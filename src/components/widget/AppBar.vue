<template>
  <v-app-bar dark dense app :color="!isCardStatsPage ? 'primary' : 'black'">
    <!-- Ktm Logo -->
    <div class="app-logo">
      <router-link :to="latestMetaUrl" aria-label="to latest meta"
          @click.native="$ga.event({ eventCategory: 'Navigation', eventAction: 'logo' })">
        <v-img :src="require('../../assets/ktm.png')" width="24px" aria-label="logo"/>
      </router-link>
    </div>
    <!-- Regular app bar -->
    <v-toolbar-title class="mr-4 d-none d-md-flex" v-if="!isCardStatsPage">
      <h1>Know the Meta</h1>
    </v-toolbar-title>
    <!-- Meta selector -->
    <v-toolbar-items v-if="!isCardStatsPage">
      <v-menu bottom left v-if="metaLoaded">
        <!-- Meta name -->
        <template v-slot:activator="{ on }">
          <v-btn depressed :color="$route.path.indexOf('meta') > -1 ? 'highlight' : 'primary'" class="meta-button" v-on="on" data-testid="current-meta">
            <span class="d-none d-sm-block">{{ currentMetaTitle ? currentMetaTitle : 'loading' }}</span>
            <span class="d-flex d-sm-none">{{ shortMetaTitle }}</span>
            <v-icon icon data-testid="icon-meta-select" v-if="metaLoaded">{{ mdiMenuDown }}</v-icon>
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
      <!-- Drilldown -->
      <v-btn depressed :color="$route.path.includes('/drilldown') ? 'highlight' : 'primary'" class="menu-button" data-testid="menu-drilldown" aria-label="data drilldown">
        <router-link to="/drilldown" tag="span">
          <span class="d-none d-sm-inline">Drilldown</span>
          <v-icon color="white" class="d-flex d-sm-none">{{ mdiBullseyeArrow }}</v-icon>
        </router-link>
      </v-btn>
    </v-toolbar-items>
    <v-spacer v-if="!isCardStatsPage"/>
    <card-autocomplete @mobile-search="mobileSearch = $event" v-if="!isCardStatsPage"/>
    <!-- Other menu items -->
    <v-toolbar-items v-if="!isCardStatsPage && !mobileSearch">
      <v-btn depressed :color="$route.path === '/mwl' ? 'highlight' : 'primary'" class="menu-button" data-testid="menu-mwl" aria-label="most wanted list">
        <router-link to="/mwl" tag="span">
          <span class="d-xxs-none d-xs-inline">MWL</span>
          <v-icon color="white" class="d-xxs-only-inline">{{ mdiPoliceBadge }}</v-icon>
        </router-link>
      </v-btn>
      <v-btn depressed :color="$route.path === '/rotation' ? 'highlight' : 'primary'" class="menu-button" data-testid="menu-rotation" aria-label="rotation">
        <router-link to="/rotation" tag="span">
          <span class="d-xxs-none d-xs-inline">Rotation</span>
          <v-icon color="white" class="d-xxs-only-inline">{{ mdiRotate3dVariant }}</v-icon>
        </router-link>
      </v-btn>
    </v-toolbar-items>
    <!-- Card stat app bar -->
    <v-btn icon depressed @click="goBack" v-show="isCardStatsPage" aria-label="navigate back" data-testid="menu-back">
      <v-icon>{{ mdiArrowLeft }}</v-icon>
    </v-btn>
    <v-toolbar-title v-show="isCardStatsPage && cards && cards.currentCardTitle" data-testid="card-title">
      <h1>{{ cards.currentCardTitle }}</h1>
    </v-toolbar-title>
  </v-app-bar>
</template>

<script>
import { VListItem } from 'vuetify/lib'
import CardAutocomplete from '@/components/widget/CardAutocomplete.vue'
import { mdiMenuDown, mdiArrowLeft, mdiPoliceBadge, mdiRotate3dVariant, mdiBullseyeArrow } from '@mdi/js'
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
    mdiPoliceBadge,
    mdiRotate3dVariant,
    mdiBullseyeArrow,
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
    },
    isCardStatsPage: function () {
      return this.$route.name === 'Card statistics'
    },
    metaLoaded: function () {
      return this.metas && this.metas.metaList.length > 0
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
