import axios from 'axios'

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
    getCardData ({ dispatch }) {
      dispatch('getCycles')
    },
    getMwl ({ commit }) {
      return axios.get('https://netrunnerdb.com/api/2.0/public/mwl').then((response) => {
        commit('resetMwl')
        commit('addMwl', response.data.data[response.data.data.length - 1]) // current MWL
        commit('addMwl', response.data.data[response.data.data.length - 2]) // previous MWL
      })
    },
    getCycles ({ commit, dispatch }) {
      return axios.get('https://netrunnerdb.com/api/2.0/public/cycles').then((response) => {
        commit('setCycles', response.data.data)
        dispatch('getPacks')
      })
    },
    getPacks ({ commit, dispatch }) {
      return axios.get('https://netrunnerdb.com/api/2.0/public/packs').then((response) => {
        commit('setPacks', response.data.data)
        dispatch('getCards')
      })
    },
    getCards ({ commit }) {
      return axios.get('https://netrunnerdb.com/api/2.0/public/cards').then((response) => {
        commit('setCards', { cards: response.data.data, imgtemplate: response.data.imageUrlTemplate })
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
      state.packs = []
      for (let i = 0; i < packs.length; i++) {
        state.packs.push({
          code: packs[i].code,
          cycle_code: packs[i].cycle_code,
          name: packs[i].name,
          rotated: state.cycles.find(x => { return x.code === packs[i].cycle_code }).rotated
        })
      }
    },
    // saves print data (code=>title) and cards data (title=>data)
    setCards (state, { cards, imgtemplate }) {
      state.cards = {}
      state.prints = {}
      for (let i = 0; i < cards.length; i++) {
        state.prints[cards[i].code] = cards[i].title
        const legal = !state.packs.find(x => { return x.code === cards[i].pack_code }).rotated
        if (cards[i].title in state.cards) {
          // reprint
          state.cards[cards[i].title].image_url = 'image_url' in cards[i] ? cards[i].image_url : imgtemplate.replace('{code}', cards[i].code) // keep image fresh
          state.cards[cards[i].title].in_pack.push(cards[i].pack_code)
          state.cards[cards[i].title].legal = legal
        } else {
          // new card
          state.cards[cards[i].title] = {
            runner: cards[i].side_code === 'runner',
            in_pack: [cards[i].pack_code],
            image_url: 'image_url' in cards[i] ? cards[i].image_url : imgtemplate.replace('{code}', cards[i].code),
            legal: legal
          }
        }
      }
    },
    // empties all mwl data
    resetMwl (state) {
      state.mwl = []
    },
    // adds an mwl data
    addMwl (state, mwlData) {
      const mwlCards = { banned: [], restricted: [] }
      for (const prop in mwlData.cards) {
        if (Object.prototype.hasOwnProperty.call(mwlData.cards, prop)) {
          const mwlcard = mwlData.cards[prop]
          const card = state.cards[state.prints[prop]]
          card.title = state.prints[prop]
          // banned
          if (('deck_limit' in mwlcard) && mwlcard.deck_limit === 0) {
            mwlCards.banned.push(card)
          }
          // restricted
          if (('is_restricted' in mwlcard) && mwlcard.is_restricted === 1) {
            mwlCards.restricted.push(card)
          }
        }
      }
      state.mwl.push(mwlCards)
    }
  }
}
