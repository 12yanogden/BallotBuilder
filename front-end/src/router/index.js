import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import Ballot from '../views/Ballot.vue'
import Measure from '../views/Measure.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/ballot/:action/:id',
    name: 'ballot',
    component: Ballot
  },
  {
    path: '/measure/:action/:id',
    name: 'measure',
    component: Measure
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
