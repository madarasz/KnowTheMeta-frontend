import axios from 'axios'

export const metas = {
  namespaced: true,
  state: {
    currentMetaCode: null,
    metaList: [],
    metaData: {}
  },
  getters: {
    getMetaCode: (state) => (filename) => {
      return filename.slice(0, -5) // remove ".json" from the end
    },
    getFirstMetaCode: (state, getters) => {
      return getters.getMetaCode(state.metaList[0])
    },
    getCurrentMeta: (state, getters) => {
      // if the metaData details are not available fall back to the metalist
      if (state.metaData[state.currentMetaCode] === undefined) {
        console.log('falling back to list for code: ' + state.currentMetaCode)
        return state.metaList.filter(x => { return getters.getMetaCode(x.file) === state.currentMetaCode })[0]
      }
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
      return axios.get(`https://alwaysberunning.net/ktm/${metacode}.json'`).then((response) => {
        commit('setMetaData', response.data)
      })
    }
  },
  mutations: {
    // makes the first meta in the list the active meta
    fallbackToFirstMeta (state) {
      state.currentMetaCode = state.metaList[0].file.slice(0, -5)
    },
    setCurrentMetaCode (state, metacode) {
      state.currentMetaCode = metacode
    },
    setMetaList (state, list) {
      state.metaList = list
    },
    setMetaData (state, metadata) {
      state.metaData[metadata.title] = metadata
    }
  }
}
