import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { request, GraphQLClient } from "graphql-request"
import { * as AppConfig } from './config/AppConfig'

console.log(localStorage);

// localStorage.removeItem('token');

// TODO:Change localhost to real domain when publish
const graphql = new GraphQLClient(, {
    headers: {
        Authorization: "Bearer " + AppConfig.graphql_url + localStorage.getItem('token'),
    }
});

global.api = graphql;

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

    if (isLogin) {
        isLogin = await validToken();
        console.log(isLogin);
    }

    if (to.path == '/login' && isLogin)
      redirectTo('Home');

    if (!isLogin && to.path != "/signup" && to.path != "/passreset")
      redirectTo('Authorization');
});

new Vue({
  router,
  render: h => h(App),
  created: () => {
    console.log(11);
  }
}).$mount('#app');
