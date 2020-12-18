const {GraphQLObjectType, GraphQLString} = require("graphql");
const UserType = require("./EntityTypes/User");
const User = require('../Entity/User');
const Rbac = require("../utils/Rbac");

const Db = require("../utils/Db");
const db = new Db();
const rbac = new Rbac();

const { client } = require('../utils/Redis');

module.exports = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        viewer: {
            type: UserType,
            async resolve(obj, data) {
                let res = await db.query('SELECT * FROM `user_group`', [ ]);

                // let role_id = await rbac.addRole("test_role", "role for testing");
                // let rule_id = await rbac.addRule("test_rule", "rule for testing");

                // console.log("res", role_id, " ", rule_id);

                // await rbac.assign(role_id, rule_id);
                // await rbac.addRoleToUser(obj().viewer, role_id, false);

                // await rbac.removeRule(rule_id);
                // await rbac.removeRole(role_id);

                // res = await db.query("INSERT INTO `association` (name, description) VALUES (?, ?)", [ 'name', 'description' ]);

                return obj().viewer.fields;
            }
        },
    }
});
