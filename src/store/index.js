import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// import { cards } from './modules/cards'
// import { packs } from './modules/packs'
// import { cycles } from './modules/cycles'
// import { mwls } from './modules/mwls'
import { metas } from './modules/metas'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    metas //, cards, packs, cycles, mwls
  },
  plugins: [createPersistedState()]
})
