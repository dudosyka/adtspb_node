const AppConfig = require('../config/AppConfig');
const Db = require('../utils/Db');
const db = new Db();

const Rbac = require('../utils/Rbac');
const rbac = new Rbac();

let AccessControl = function () {}

AccessControl.prototype.getRights = async function (user_id) {
    const rights = await db.query('SELECT `main`.`user_id`, `assignment`.`role`, `assignment`.`rule`, `role`.`name` as `role_name`, `role`.`description` as `role_description`, `rule`.`name` as `rule_name`, `rule`.`description` as `rule_description`  FROM `user_role` as `main` LEFT JOIN `auth_role` as `role` ON `main`.`auth_role_id` = `role`.`id` LEFT JOIN `auth_assignment_min` as `assignment` ON `main`.`auth_role_id` = `assignment`.`role` LEFT JOIN `auth_rule` as `rule` ON `assignment`.`rule` = `rule`.`id` WHERE `user_id` = ?', [ user_id ]);
    const roles = {};
    rights.map(right => {
        if (roles[right.role]) {
            roles[right.role].rules.push({
                id: right.rule,
                name: right.rule_name,
                description: right.rule_description
            });
            return;
        }
        roles[right.role] = {
            id: right.role,
            name: right.role_name,
            description: right.role_description,
            rules: [
                {
                    id: right.rule,
                    name: right.rule_name,
                    description: right.rule_description
                }
            ]
        };
    });
    const output = [];
    Object.keys(roles).map(el => {
        output.push(roles[el]);
    });
    return output;
}

module.exports = AccessControl;
