import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { request, GraphQLClient } from "graphql-request";
import * as AppConfig from './config/AppConfig';
import {AccessControl} from './utils/AccessControl';
import {Association} from './models/Association';

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
                router.push({name: 'Confirmation'});
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
    router.push({name: name}).catch(err => { /* QUITE! */ });
}

global.uploadSelectedAssociations = function () {
    if (localStorage.getItem('selectedAssociations')) {
        const data = JSON.parse(localStorage.getItem('selectedAssociations'));
        Object.keys(data).map(child => {
            Association.setSelected(data[child], child);
        });
        localStorage.removeItem('selectedAssociations');
    }
}

router.afterEach(async (to, from) => {
    uploadSelectedAssociations();
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

window.onbeforeunload = uploadSelectedAssociations;
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
