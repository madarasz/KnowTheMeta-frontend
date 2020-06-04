import axios from 'axios'

export const cards = {
  namespaced: true,
  state: {
    stats: {},
    currentCardTitle: 'loading...'
  },
  getters: {
    getCurrentStat: (state) => {
      return state.stats[state.currentCardTitle]
    }
  },
  actions: {
    getCardStat ({ commit }, cardcode) {
      commit('setCurrentCardTitle', 'loading...')
      axios.get(`https://alwaysberunning.net/ktm/cards/${cardcode}.json`).then((response) => {
        commit('setCardStats', { data: response.data, title: response.data.card.title })
        commit('setCurrentCardTitle', response.data.card.title)
      })
    }
  },
  mutations: {
    setCurrentCardTitle (state, title) {
      state.currentCardTitle = title
    },
    setCardStats (state, { data, title }) {
      state.stats[title] = data
      state.stats[title].lowData = false
    },
    setLowDataWarning (state, title) {
      state.stats[title].lowData = true
    }
  }
}
