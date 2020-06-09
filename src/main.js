import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import vuetify from '@/plugins/vuetify'
import { store } from './store/'
import VueAnalytics from 'vue-analytics'

Vue.use(VueAnalytics, {
  id: 'UA-1954357-11',
  router
})

Vue.config.productionTip = false

const app = new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// for testing, only available during E2E tests
if (window.Cypress) {
  window.app = app
}
