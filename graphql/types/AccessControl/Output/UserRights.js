const graphql = require("graphql");

module.exports = new graphql.GraphQLObjectType({
    name: "AdminUserRightsOutput",
    //Arrow func to prevent 'use before initialization' err
    fields: () => ({
        user_id: {
            type: graphql.GraphQLInt
        },
        roles: {
            type: graphql.GraphQLList(RoleOutput)
        }
    }),
});

const RoleOutput = require('./Role');
