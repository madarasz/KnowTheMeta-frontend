import axios from 'axios'

const cacheTime = 1000 * 60 * 60 // 1 hour

export const metas = {
  namespaced: true,
  state: {
    currentMetaCode: null,
    metaListTimestamp: 0,
    metaList: [],
    metaData: {},
    metaDeckData: {}
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
    },
    getCurrentMetaDecks: (state) => {
      if (!state.currentMetaCode) return false
      return state.metaDeckData[state.currentMetaCode]
    }
  },
  actions: {
    getMetaList ({ commit, state }) {
      if (Date.now() - state.metaListTimestamp > cacheTime) {
        return axios.get('https://alwaysberunning.net/ktm/metas.json').then((response) => {
          commit('setMetaList', response.data)
        }) // .catch((err) => { console.error(err) })
      } else {
        return Promise.resolve()
      }
    },
    getMetaData ({ commit, state }, metacode) {
      if (!state.metaData[metacode] || Date.now() - state.metaData[metacode].timestamp > cacheTime) {
        return axios.get(`https://alwaysberunning.net/ktm/${metacode}.json`).then((response) => {
          commit('setCurrentMetaCode', metacode)
          commit('setMetaData', response.data)
        })
      } else {
        commit('setCurrentMetaCode', metacode)
        return Promise.resolve()
      }
    },
    getMetaDeckData ({ commit, state }, metacode) {
      if (!state.metaDeckData[metacode] || Date.now() - state.metaDeckData[metacode].timestamp > cacheTime) {
        return axios.get(`https://alwaysberunning.net/ktm/decks/${metacode}.json`).then((response) => {
          commit('setMetaDeckData', { metadata: response.data, metacode })
        })
      } else {
        return Promise.resolve()
      }
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
      state.metaListTimestamp = Date.now()
      state.metaList = list
    },
    setMetaData (state, metadata) {
      metadata.timestamp = Date.now()
      state.metaData = { ...state.metaData, [metadata.meta.code]: metadata } // new object, to follow vue reactivity rules
    },
    setMetaDeckData (state, { metadata, metacode }) {
      metadata.timestamp = Date.now()
      state.metaDeckData = { ...state.metaDeckData, [metacode]: metadata } // new object, to follow vue reactivity rules
    }
  }
}
