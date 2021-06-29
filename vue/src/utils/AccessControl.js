const AccessContol = {};
import { request, GraphQLClient } from "graphql-request";
import * as AppConfig from '../config/AppConfig';

AccessContol.checkRule = function (id) {
    const rules = localStorage.getItem('rules');
    console.log(localStorage);
    console.log(id, rules);
    if (rules === null)
        return false;

    return rules.includes(id);
}

AccessContol.refreshApiToken = function () {
    global.api = new GraphQLClient(AppConfig.api_url, {
        headers: {
            Authorization: "Bearer " + localStorage.getItem('token'),
        }
    });
}

AccessContol.refreshUserRules = async function () {

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

AccessContol.refreshAccess = async function () {
    if (localStorage.getItem('token') === null) {
        localStorage.removeItem('rules');
    }
    else {
        if (localStorage.getItem('rules') === null) {
            await this.refreshUserRules();
        }
    }
}

export {AccessContol};
