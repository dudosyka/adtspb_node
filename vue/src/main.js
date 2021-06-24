import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { request, GraphQLClient } from "graphql-request";
import * as AppConfig from './config/AppConfig';
import {AccessContol} from './utils/AccessControl';

const graphql = new GraphQLClient(AppConfig.api_url, {
    headers: {
        Authorization: "Bearer " + localStorage.getItem('token'),
    }
});
const endoor  = new GraphQLClient(AppConfig.endoor_url, {});

global.refreshUserRules = AccessContol.refreshUserRules;
global.refreshApiToken = AccessContol.refreshApiToken;
global.hasAccess = AccessContol.checkRule;
global.getError = (err, id = 0) => {
    try {
        return JSON.parse(err.response.errors[id].message);
    } catch (e) {
        return err.response.errors[id].message;
    }
}
global.api = graphql;
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

(async function () {
    await AccessContol.refreshAccess();
    new Vue({
      router,
      render: h => h(App),
      beforeCreate: async () => {
      },
      created: async () => {

      }
    }).$mount('#app');
})();
