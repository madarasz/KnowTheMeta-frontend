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
      console.log(`getting meta for ${state.currentMetaCode}`)
      return state.metaData[state.currentMetaCode]
    }
  },
  actions: {
    getMetaList ({ commit }) {
      return axios.get('https://alwaysberunning.net/ktm/metas.json').then((response) => {
        commit('setMetaList', response.data)
      })
    },
    getMetaData ({ commit }, metacode) {
      return axios.get(`https://alwaysberunning.net/ktm/${metacode}.json`).then((response) => {
        commit('setMetaData', response.data)
      })
    }
  },
  mutations: {
    // makes the active meta the latest meta in the list (first element)
    fallbackToLatestMeta (state) {
      console.log('falling back to latest meta')
      state.currentMetaCode = state.metaList[0].code
    },
    setCurrentMetaCode (state, metacode) {
      state.currentMetaCode = metacode
    },
    setMetaList (state, list) {
      state.metaList = list
    },
    setMetaData (state, metadata) {
      state.metaData[metadata.meta.code] = metadata
    }
  }
}
