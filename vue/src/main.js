import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { request, GraphQLClient } from "graphql-request"
import * as AppConfig from './config/AppConfig'

console.log(localStorage);

// localStorage.removeItem('token');

let refreshApiToken = () => {
    global.api = new GraphQLClient(AppConfig.api_url, {
        headers: {
            Authorization: "Bearer " + localStorage.getItem('token'),
        }
    });
}

let refreshUserRules = async () => {

    if (localStorage.getItem('token') === null)
        return;

    let req = `
    query {
        viewer {
            rules
        }
    }
    `;

    return api.request(req).then(el => {
        console.log(el);
        localStorage.setItem('rules', el.viewer.rules);
    });
}

let hasAccess = id => {
    const rules = localStorage.getItem('rules');
    if (rules === null)
        return false;

    return rules.includes(id);
}

global.refreshUserRules = refreshUserRules;
global.refreshApiToken = refreshApiToken;
global.hasAccess = hasAccess;

const graphql = new GraphQLClient(AppConfig.api_url, {
    headers: {
        Authorization: "Bearer " + localStorage.getItem('token'),
    }
});

global.api = graphql;

const endoor  = new GraphQLClient(AppConfig.endoor_url, {});

global.endoor = endoor;

let token = localStorage.getItem('token');

let validToken = () => {
    const req = `
      query($token: String) {
        validToken(token: $token)
      }
    `;
    return api.request(req, {token: token})
    .then(data => {
      console.log(data.validToken);
      return data.validToken;
    })
    .catch(err => {
      console.log(err);
    });
};
let redirectTo = (name) => {
    router.push({name: name}).catch(err => { /* QUITE! */ });
}

router.afterEach(async (to, from) => {
    let isLogin = true;
    isLogin = (token !== null);
    console.log(isLogin)
    if (isLogin) {
        isLogin = await validToken();
        console.log(isLogin);
    }
    console.log(to.path);
    if ((to.path == '/login' || to.path == '/signup') && isLogin)
      redirectTo('Home');

    if (!isLogin && to.path != "/signup" && to.path != "/passreset")
      redirectTo('Authorization');
});

new Vue({
  router,
  render: h => h(App),
  created: async () => {
      if (localStorage.getItem('token') === null) {
          localStorage.removeItem('rules');
      }
      else {
          if (localStorage.getItem('rules') === null) {
              await refreshUserRules();
          }
      }
  }
}).$mount('#app');
