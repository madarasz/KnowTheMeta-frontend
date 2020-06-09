import axios from 'axios'

export const metas = {
  namespaced: true,
  state: {
    currentMetaCode: null,
    metaList: [],
    metaData: {}
  },
  getters: {
    getLatestMetaCode: (state) => {
      if (state.metaList.length === 0) {
        return ''
      }
      return state.metaList[0].code
    },
    getCurrentMetaTitle: (state) => {
      const matches = state.metaList.filter(x => { return x.code === state.currentMetaCode })
      if (matches.length === 1) {
        return matches[0].title
      }
      return ''
    },
    getCurrentMeta: (state) => {
      if (!state.currentMetaCode) return false
      return state.metaData[state.currentMetaCode]
    }
  },
  actions: {
    getMetaList ({ commit }) {
      return axios.get('https://alwaysberunning.net/ktm/metas.json').then((response) => {
        commit('setMetaList', response.data)
      }) // .catch((err) => { console.error(err) })
    },
    getMetaData ({ commit }, metacode) {
      return axios.get(`https://alwaysberunning.net/ktm/${metacode}.json`).then((response) => {
        commit('setCurrentMetaCode', metacode)
        commit('setMetaData', response.data)
      })
    }
  },
  mutations: {
    // makes the active meta the latest meta in the list (first element)
    fallbackToLatestMeta (state) {
      state.currentMetaCode = state.metaList[0].code
    },
    setCurrentMetaCode (state, metacode) {
      state.currentMetaCode = metacode
    },
    setMetaList (state, list) {
      state.metaList = list
    },
    setMetaData (state, metadata) {
      state.metaData = { ...state.metaData, [metadata.meta.code]: metadata } // new object, to follow vue reactivity rules
    }
  }
}
