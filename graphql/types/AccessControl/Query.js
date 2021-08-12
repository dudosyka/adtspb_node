const graphql = require('graphql');

const AccessControl = require('../../Entity/AccessControl');
const accessControl = new AccessControl();

module.exports = new graphql.GraphQLObjectType({
    name: "AccessControlQuery",
    fields: () => ({
        user_rights: {
            type: UserRightsOutput,
            args: {
                user_id: {
                    type: graphql.GraphQLInt
                }
            },
            async resolve(obj, { user_id }) {
                const rights = await accessControl.getRights(user_id);
                console.log(rights);
                return {
                    user_id,
                    roles: rights
                };
            }
        }
    }),
});

const UserRightsOutput = require('../AccessControl/Output/UserRights');
