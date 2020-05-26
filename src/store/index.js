import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import { metas } from './modules/metas'
import { netrunnerdb } from './modules/netrunnerdb'
import { snackbar } from './modules/snackbar'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    metas, netrunnerdb, snackbar
  },
  plugins: [createPersistedState()]
})
