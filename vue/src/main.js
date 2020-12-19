import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { GraphQLClient, request } from 'graphql-request'
const ws = new WebSocket('ws://localhost:8081/')

console.log(ws)

Vue.prototype.$request_endpoint = process.env.VUE_APP_REQUEST_ENDPOINT
Vue.prototype.$request = request

const $globals = Vue.observable({
  $graphql_client: {},
  $access_control: {
    actions: []
  }
})

Object.defineProperty(Vue.prototype, '$graphql_client', {
  get () {
    return $globals.$graphql_client
  },

  set (value) {
    $globals.$graphql_client = value
  }
})


Object.defineProperty(Vue.prototype, '$access_control', {
  get () {
    return $globals.$access_control
  },

  set (value) {
    $globals.$access_control = value;
  }
})

async function hasAccess (action_id, action_list_id = 1) {
  const request = ` r
                mutation {
                    getViewerRights(action_list_id: ` + action_list_id + `)
                }
            `
  let result = false
  try {
    await $globals.$graphql_client.request(request, {}).then(data => {
      $globals.$access_control.actions = JSON.parse(data.getViewerRights).map(el => {
        return parseInt(el)
      })
      console.log(action_id)
      result = ($globals.$access_control.actions.indexOf(action_id) > -1)
      console.log(result)
    }).catch(err => {
      // console.log(err)
    })
  } catch (e) {}
  return result
}

const config = [
  //Page access control
]

const checkConfig = async () => {
  config.map(async el => {
      if (requested.path.match(el.regExp))
      {
        let success = false;
        let act = el.actions.map(async action => {
          if (await hasAccess(action))
          {
            success = true;
          }
        });
        act[el.actions.length - 1].finally(() => {
          if (!success)
            redirect();
        });
      }
    }
  )
}

let requested

let redirect

router.beforeEach(async function (to, from, next) {
  // console.log(1)
  requested = to
  redirect = () => {
    router.push('/')
  }
  if (isCreated) {
    checkConfig()
  }
  next()
})


new Vue({
  router,
  render: h => h(App),
  created: async function () {
    // checkConfig() check viewer rights
  }
}).$mount('#app')
