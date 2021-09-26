import Vue from 'vue';
import App from './App.vue';
import router from './router';

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { request, GraphQLClient } from "graphql-request";
import * as AppConfig from './config/AppConfig';
import {AccessControl} from './utils/AccessControl';

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

const graphql = new GraphQLClient(AppConfig.api_url, {
    headers: {
        Authorization: "Bearer " + localStorage.getItem('token'),
    }
});
const endoor  = new GraphQLClient(AppConfig.endoor_url, {});

global.refreshUserRules = AccessControl.refreshUserRules;
global.refreshApiToken = AccessControl.refreshApiToken;
global.hasAccess = AccessControl.checkRule;
global.hasRole = AccessControl.checkRole;
global.getError = (err, id = 0) => {
    try {
        return JSON.parse(err.response.errors[id].message);
    } catch (e) {
        return err.response.errors[id].message;
    }
}
global.api = graphql;
global.endoor = endoor;
global._request = async (route, query, data = {}) => {
    const res = global[route].request(query, data).catch(err => {
        if (err.response.error) {
            const msg = JSON.parse(err.response.error).message;
            if (msg == 'Not confirmed') {
                router.push({name: "Confirmation"});
                // window.location = '/confirmation';
            }
            if (msg == 'refresh') {
                AccessControl.logout(true);
            }
        }
        throw err;
    });
    return res;
}

let token = localStorage.getItem('token');

let validToken = () => {
    console.log("VALID");
    // console.log(global['api'].request("", {}));
    const req = `
      query($token: String) {
        validToken(token: $token)
      }
    `;
    return _request("api", req, {token: token})
    .then(data => {
      console.log(data.validToken);
      return data.validToken;
    })
    .catch(err => {
      console.log(err);
    });
};
let redirectTo = (name) => {
    router.push({name: name}).catch(err => {});
}

router.afterEach(async (to, from) => {
    console.log('to', to)
    console.log('from', from)
    let isLogin = true;
    isLogin = (token !== null);

    console.log(`isLogin !== null ${isLogin}`)

    if (isLogin) {
        isLogin = await validToken();
        console.log(`validToken ${isLogin}`);
    }

    if (to.path == '/' && isLogin) router.push('/statistics');

    if (!isLogin && to.path !== '/') router.push('/');
});

(async function () {
    await AccessControl.refreshAccess();
    new Vue({
      router,
      render: h => h(App),
      beforeCreate: async () => {
      },
      created: async () => {

      }
    }).$mount('#app');
})();
