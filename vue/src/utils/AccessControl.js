const AccessContol = {};
import { request, GraphQLClient } from "graphql-request";
import * as AppConfig from '../config/AppConfig';

AccessContol.checkRule = function (id) {
    const rules = localStorage.getItem('rules');
    if (rules === null)
        return false;

    return rules.includes(id);
}

AccessContol.checkRole = function (id) {
    const roles = localStorage.getItem('roles');
    if (roles === null)
        return false;

    return roles.includes(id);
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
            rules, roles
        }
    }
    `;

    return _request("api", req).then(el => {
        localStorage.setItem('rules', el.viewer.rules);
        localStorage.setItem('roles', el.viewer.roles);
    });
}

AccessContol.refreshAccess = async function () {
    if (localStorage.getItem('token') === null) {
        localStorage.removeItem('rules');
        localStorage.removeItem('roles');
    }
    else {
        if (localStorage.getItem('roles') === null ||
            localStorage.getItem('rules') === null) {
            await this.refreshUserRules();
        }
    }
}

export {AccessContol};
