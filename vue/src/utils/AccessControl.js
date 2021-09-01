const AccessControl = {};
import { request, GraphQLClient } from "graphql-request";
import * as AppConfig from '../config/AppConfig';

AccessControl.checkRule = function (id) {
    const rules = localStorage.getItem('rules');
    if (rules === null)
        return false;

    return rules.includes(id);
}

AccessControl.checkRole = function (id) {
    const roles = localStorage.getItem('roles');
    if (roles === null)
        return false;

    return roles.includes(id);
}

AccessControl.refreshApiToken = function (token = null) {
    localStorage.removeItem('selectedAssociations');
    if (token !== null) {
        localStorage.setItem('token', token);
    }

    global.api = new GraphQLClient(AppConfig.api_url, {
        headers: {
            Authorization: "Bearer " + localStorage.getItem('token'),
        }
    });
}

AccessControl.refreshUserRules = async function () {

    if (localStorage.getItem('token') === null)
        return;

    let req = `
    query {
        user {
            rights {
                rules, roles
            }
        }
    }
    `;

    return _request("api", req).then(el => {
        localStorage.setItem('rules', el.user.rights.rules);
        localStorage.setItem('roles', el.user.rights.roles);
    });
}

AccessControl.refreshAccess = async function () {
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

AccessControl.logout = function (redirToLogin = false) {
    localStorage.removeItem('token');
    localStorage.removeItem('rules');
    localStorage.removeItem('roles');
    localStorage.removeItem('selectedAssociations');

    if (redirToLogin)
        window.location = "/login";
    else
        window.location = window.location;
}

export {AccessControl};
