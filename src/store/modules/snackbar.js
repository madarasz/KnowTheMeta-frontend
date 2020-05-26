export const snackbar = {
  namespaced: true,
  state: {
    show: false,
    message: '',
    color: 'error',
    timeout: 3000,
    bottom: true,
    left: false,
    right: false,
    top: false
  },
  getters: {
  },
  actions: {
  },
  mutations: {
    showError (state, message) {
      state.color = 'error'
      state.message = message
      state.show = true
    },
    closeSnackbar (state) {
      state.show = false
    }
  }
}
