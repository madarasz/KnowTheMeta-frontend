import axios from 'axios'
import transform from '@/netrunnerTransformations.js'

export const cards = {
  namespaced: true,
  state: {
    stats: {},
    currentCardTitle: 'loading...'
  },
  getters: {
    getCurrentStat: (state) => {
      return state.stats[state.currentCardTitle]
    },
    isRunner: (state, getters) => {
      if (!getters.getCurrentStat) {
        return undefined
      }
      return getters.getCurrentStat.card.side_code === 'runner'
    },
    isIdentity: (state, getters) => {
      if (!getters.getCurrentStat) {
        return undefined
      }
      return getters.getCurrentStat.card.type_code === 'identity'
    },
    getCardTitle: (state, getters) => {
      if (!getters.getCurrentStat) {
        return ''
      }
      const title = getters.getCurrentStat.card.title
      if (getters.isIdentity) {
        return transform.shortenIdentity(title)
      }
      return title
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
      state.stats[title].mwlWarning = false
    },
    setLowDataWarning (state, title) {
      state.stats[title].lowData = true
    },
    setMwlWarning (state, title) {
      state.stats[title].mwlWarning = true
    }
  }
}
