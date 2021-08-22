import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('../views/Statistics.vue')
  },
  {
    path: '/associations',
    name: 'Association',
    component: () => import('../views/Associations.vue')
  },
  {
    path: '/callback',
    name: 'Callback',
    component: () => import('../views/Callback.vue')
  },
  {
    path: '/proposals',
    name: 'Proposals',
    component: () => import('../views/Proposals.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router
