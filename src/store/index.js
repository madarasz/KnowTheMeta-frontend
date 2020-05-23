import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import { metas } from './modules/metas'
import { netrunnerdb } from './modules/netrunnerdb'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    metas, netrunnerdb
  },
  plugins: [createPersistedState()]
})
