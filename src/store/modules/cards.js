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
      if (state.currentCardTitle === 'loading...') return false
      return state.stats[state.currentCardTitle]
    },
    isRunner: (state, getters) => {
      if (!getters.getCurrentStat) {
        return false
      }
      return getters.getCurrentStat.card.side_code === 'runner'
    },
    isIdentity: (state, getters) => {
      if (!getters.getCurrentStat) {
        return false
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
        const title = response.data.card.title
        commit('setCurrentCardTitle', title)
        commit('setCardStats', { data: response.data, title: title })
      })
    }
  },
  mutations: {
    setCurrentCardTitle (state, title) {
      state.currentCardTitle = title
    },
    setCardStats (state, { data, title }) {
      data.lowData = false
      data.mwlWarning = false
      state.stats = { ...state.stats, [title]: data }
    },
    setLowDataWarning (state, title) {
      state.stats[title].lowData = true
    },
    setMwlWarning (state, title) {
      state.stats[title].mwlWarning = true
    }
  }
}
