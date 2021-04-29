import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
import PassReset from '../views/PassReset.vue'
import Page2 from '../views/Page2.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Authorization',
    meta: { layout: 'AuthLayout' },
    component: Login
  },
  {
    path: '/signup',
    name: 'Registration',
    meta: { layout: 'AuthLayout' },
    component: SignUp
  },
  {
    path: '/passreset',
    name: 'PasswordReset',
    meta: { layout: 'AuthLayout' },
    component: PassReset
  },
  {
    path: '/page',
    name: 'Page2',
    component: Page2
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router
