import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const routes = [
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('../views/Statistics.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/associations',
    name: 'Association',
    component: () => import('../views/Associations.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router
