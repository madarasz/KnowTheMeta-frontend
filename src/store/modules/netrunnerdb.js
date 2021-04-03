import axios from 'axios'
import transform from '@/store/nrdbTransformations'

const cacheTime = 1000 * 60 * 60 // 1 hour

export const netrunnerdb = {
  namespaced: true,
  state: {
    cycles: [],
    packs: [],
    cards: {},
    prints: {},
    mwl: [],
    rotationWarning: {},
    mwlTimestamp: 0,
    cardTimestamp: 0
  },
  getters: {
  },
  actions: {
    // gets cycle, pack, card data, if getMwlData = true, then it gets mwl as well
    getCardData ({ dispatch }, getMwlData = false) {
      dispatch('getCycles', getMwlData)
    },
    getCycles ({ commit, dispatch, state }, getMwlData = false) {
      if (state.cards.length === 0 || Date.now() - state.cardTimestamp > cacheTime) {
        return axios.get('https://netrunnerdb.com/api/2.0/public/cycles').then((response) => {
          commit('setCycles', response.data.data)
          dispatch('getPacks', getMwlData)
        })
      } else {
        if (getMwlData) {
          dispatch('getMwl')
        }
        return Promise.resolve()
      }
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
    getMwl ({ commit, state }) {
      if (state.mwl.length === 0 || Date.now() - state.mwlTimestamp > cacheTime) {
        return axios.get('https://netrunnerdb.com/api/2.0/public/mwl').then((response) => {
          for (let i = response.data.data.length - 1; i >= 0; i--) {
            commit('addMwl', { mwl: response.data.data[i], index: response.data.data.length - 1 - i })
          }
          commit('compareMwls')
        })
      } else {
        return Promise.resolve()
      }
    },
    getRotationWarning ({ commit, state }) {
      if (state.cycles.length > 0) {
        return axios.get('/api/rotation_warning.json').then((response) => {
          commit('setRotationWarning', response.data.data)
        })
      }
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
      state.cardTimestamp = Date.now()
    },
    // adds an mwl data
    addMwl (state, { mwl: mwlData, index }) {
      const mwl = transform.sortMwlData(mwlData.cards, state.cards, state.prints)
      mwl.name = mwlData.name
      mwl.date_start = mwlData.date_start
      this._vm.$set(state.mwl, index, mwl)
    },
    // compares latest MWL and the previous, adds badge data to latest MWL
    compareMwls (state) {
      transform.addBadgesToMwl(state.mwl[0], state.mwl[1])
      state.mwlTimestamp = Date.now()
    },
    // adds rotation warning labels to cycles
    setRotationWarning (state, rotationWarning) {
      state.rotationWarning = rotationWarning
      state.cycles = transform.addRotationWarning(state.cycles, rotationWarning)
    }
  }
}
