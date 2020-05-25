import axios from 'axios'
import transform from '@/store/nrdbTransformations'

export const netrunnerdb = {
  namespaced: true,
  state: {
    cycles: [],
    packs: [],
    cards: {},
    prints: {},
    mwl: []
  },
  getters: {
  },
  actions: {
    // gets cycle, pack, card data, if getMwlData = true, then it gets mwl as well
    getCardData ({ dispatch }, getMwlData = false) {
      dispatch('getCycles', getMwlData)
    },
    getCycles ({ commit, dispatch }, getMwlData = false) {
      return axios.get('https://netrunnerdb.com/api/2.0/public/cycles').then((response) => {
        commit('setCycles', response.data.data)
        dispatch('getPacks', getMwlData)
      })
    },
    getPacks ({ commit, dispatch }, getMwlData = false) {
      return axios.get('https://netrunnerdb.com/api/2.0/public/packs').then((response) => {
        commit('setPacks', response.data.data)
        dispatch('getCards', getMwlData)
      })
    },
    getCards ({ commit, dispatch }, getMwlData) {
      return axios.get('https://netrunnerdb.com/api/2.0/public/cards').then((response) => {
        commit('setCards', { cards: response.data.data, imgtemplate: response.data.imageUrlTemplate })
        if (getMwlData) {
          dispatch('getMwl')
        }
      })
    },
    getMwl ({ commit }) {
      return axios.get('https://netrunnerdb.com/api/2.0/public/mwl').then((response) => {
        commit('resetMwl')
        commit('addMwl', response.data.data[response.data.data.length - 1]) // current MWL
        commit('addMwl', response.data.data[response.data.data.length - 2]) // previous MWL
        commit('compareMwls')
      })
    }
  },
  mutations: {
    // saves cycle data
    setCycles (state, cycles) {
      state.cycles = cycles
    },
    // saves pack data, adds if pack rotated
    setPacks (state, packs) {
      state.packs = transform.transformPackData(state.cycles, packs)
    },
    // saves print data (code=>title) and cards data (title=>data)
    setCards (state, { cards, imgtemplate }) {
      const result = transform.transformCardData(cards, state.packs, imgtemplate)
      state.cards = result.cards
      state.prints = result.prints
    },
    // empties all mwl data
    resetMwl (state) {
      state.mwl = []
    },
    // adds an mwl data
    addMwl (state, mwlData) {
      state.mwl.push(transform.sortMwlData(mwlData.cards, state.cards, state.prints))
    },
    // compares latest MWL and the previous, adds badge data to latest MWL
    compareMwls (state) {
      transform.addBadgesToMwl(state.mwl[0], state.mwl[1])
    }
  }
}
