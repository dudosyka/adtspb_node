import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

const ws = new WebSocket('ws://localhost:8081/')

console.log(ws)

createApp(App).use(store).use(router).mount('#app')
