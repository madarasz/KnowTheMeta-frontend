<template>
  <div>
    <!-- desktop -->
    <v-autocomplete :append-icon="mdiMagnify" :allow-overflow="false" clearable persistent-hint
      :items="cardTitles" :hide-no-data="hideNoData" :search-input.sync="searchString" :loading="loading"
      placeholder="search for card" no-data-text="no such card" class="mr-4 mt-4"
      v-model="selected" @change="cardSelected" v-if="$vuetify.breakpoint.mdAndUp" data-testid="card-search">
    </v-autocomplete>
    <!-- mobile -->
    <div v-if="!$vuetify.breakpoint.mdAndUp">
      <v-btn icon depressed @click="searchMobile(true)" v-show="!mobileSearch" class="search-button" aria-label="card search">
        <div>
        <v-row dense>
          <v-col class="pa-0">
            <v-icon>{{ mdiMagnify }}</v-icon>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col class="pa-0 mobile-nav-text">
            Search
          </v-col>
        </v-row>
        </div>
      </v-btn>
      <v-autocomplete :append-icon="mdiMagnify" :allow-overflow="false" clearable persistent-hint
        :items="cardTitles" :hide-no-data="hideNoData" :search-input.sync="searchString" :loading="loading"
        placeholder="card search" no-data-text="no such card" class="ml-2 mt-4"
        v-model="selected" @change="cardSelected" v-show="mobileSearch" data-testid="card-search"
        ref="mobileautocomplete" @blur="searchMobile(false)">
      </v-autocomplete>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mdiMagnify } from '@mdi/js'
import transform from '@/netrunnerTransformations.js'

export default {
  name: 'CardAutocomplete',
  props: {
    minChars: {
      type: Number,
      default: 2
    }
  },
  data: () => ({
    mdiMagnify,
    mobileSearch: false, // is search ongoing on mobile screen
    loading: false, // loading animation
    selected: {}, // selected item
    searchString: '', // search string
    hideNoData: true // wether to hide "no such card message" because search character count is not enough
  }),
  mounted: function () {
  },
  methods: {
    cardSelected: function (title) {
      const code = Object.keys(this.netrunnerdb.prints).find(x => this.netrunnerdb.prints[x] === title)
      if (code) {
        const url = transform.cardUrl({ code, title })
        this.selected = {}
        // fire analytics
        this.$ga.event({
          eventCategory: 'Search',
          eventAction: 'card-search',
          eventLabel: title
        })
        // navigate to card stats
        this.$router.push({ path: url })
      }
    },
    searchMobile: function (enable) {
      this.$emit('mobile-search', enable)
      this.mobileSearch = enable
      // set focus on input field
      if (enable) {
        this.$nextTick(() => {
          this.$refs.mobileautocomplete.$refs.input.focus()
        })
      }
    }
  },
  watch: {
    searchString: function (newValue, oldValue) {
      // hide no data message if not enough characters
      this.hideNoData = this.loading || !newValue || newValue.length < this.minChars
      // load NetrunnerDB if cards are missing
      if (newValue && newValue.length >= this.minChars && Object.keys(this.netrunnerdb.cards).length === 0 && this.loading === false) {
        this.loading = '#638098'
        this.$store.dispatch('netrunnerdb/getCardData', false).then(() => {
          this.loading = false
        })
        return []
      }
    }
  },
  computed: {
    ...mapState(['netrunnerdb']),
    cardTitles: function () {
      // hide results if seach string is shorter than 2 chars
      if (!this.searchString || this.searchString.length < 2) return []
      // return emtpy if cards are missing
      if (!this.netrunnerdb.cards) return []
      // return cards
      return Object.keys(this.netrunnerdb.cards)
    }
  }
}
</script>
