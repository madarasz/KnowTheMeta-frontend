// src/plugins/vuetify.js

import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

const opts = {
  icons: {
    iconfont: 'mdiSvg' // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
  },
  theme: {
    themes: {
      light: {
        primary: '#2c3653',
        secondary: '#9acadc',
        accent: '#e6e6e6',
        highlight: '#638098'
        // error: '#e91e63',
        // warning: '#ffc107',
        // info: '#607d8b',
        // success: '#4caf50'
      }
    }
  }
}

export default new Vuetify(opts)
