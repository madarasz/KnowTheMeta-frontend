import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Root',
    meta: {
      title: 'Know the Meta - Netrunner'
    }
  },
  {
    path: '/meta/:metacode/:subview/:side?',
    name: 'Meta',
    meta: {
      title: 'Know the Meta - Netrunner'
    },
    component: () => import(/* webpackChunkName: "meta" */ '../views/Meta.vue')
  },
  {
    path: '/mwl/:side?',
    name: 'MWL',
    meta: {
      title: 'Most Wanted List (MWL) - Know the Meta - Netrunner'
    },
    component: () => import(/* webpackChunkName: "mwl" */ '../views/MWL.vue')
  },
  {
    path: '/rotation/:section?',
    name: 'Rotation',
    meta: {
      title: 'Rotation - Know the Meta - Netrunner'
    },
    component: () => import(/* webpackChunkName: "rotation" */ '../views/Rotation.vue')
  },
  {
    path: '/card/:cardcode/:cardtitle',
    name: 'Card statistics',
    meta: {
      title: 'Card - Know the Meta - Netrunner'
    },
    component: () => import(/* webpackChunkName: "card" */ '../views/CardStat.vue')
  },
  {
    path: '/lab/:subview?/:sidecode?/:factioncode?/:metacode?',
    name: 'Lab',
    meta: {
      title: 'Know the Meta - Netrunner'
    },
    component: () => import(/* webpackChunkName: "lab" */ '../views/Lab.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
