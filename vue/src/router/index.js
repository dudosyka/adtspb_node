import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import SignUp from '../views/SignUp.vue'
import PassReset from '../views/PassReset.vue'
import Page2 from '../views/Page2.vue'
import Confirmation from '../views/Confirmation.vue'

import Child from '../views/home/Child.vue'
import AddChild from '../views/home/AddChild.vue'
import Parent from '../views/home/Parent.vue'
import Ducument from '../views/home/Document.vue'
import Proposal from '../views/home/Proposal.vue'

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
    component: Login
  },
  {
    path: '/signup',
    name: 'Registration',
    component: SignUp
  },
  {
    path: '/confirmation',
    name: 'Confirmation',
    component: Confirmation
  },
  {
    path: '/passreset',
    name: 'PasswordReset',
    component: PassReset
  },
  {
    path: '/page',
    name: 'Page2',
    component: Page2
  },

  {
    path: '/child',
    name: 'Child',
    component: Child
  },
  {
    path: '/child/add',
    name: 'AddChild',
    component: AddChild
  },
  {
    path: '/parent',
    name: 'Parent',
    component: Parent
  },
  {
    path: '/document',
    name: 'Ducument',
    component: Ducument
  },
  {
    path: '/proposal',
    name: 'proposal',
    component: Proposal
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router
