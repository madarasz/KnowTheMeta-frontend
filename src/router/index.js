import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Root'
  },
  {
    path: '/meta/:metacode/:subview',
    name: 'Meta',
    component: () => import(/* webpackChunkName: "meta" */ '../views/Meta.vue')
  },
  {
    path: '/mwl',
    name: 'MWL',
    component: () => import(/* webpackChunkName: "mwl" */ '../views/MWL.vue')
  },
  {
    path: '/rotation',
    name: 'Rotation',
    component: () => import(/* webpackChunkName: "rotation" */ '../views/Rotation.vue')
  },
  {
    path: '/card/:cardcode',
    name: 'Card statistics',
    component: () => import(/* webpackChunkName: "rotation" */ '../views/CardStat.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
