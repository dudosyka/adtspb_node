const graphql = require('graphql');

module.exports = new graphql.GraphQLObjectType({
    name: "UserRightsOutput",
    //Arrow func to prevent 'use before initialization' err
    fields: () => ({
        rules: {
            type: graphql.GraphQLList(graphql.GraphQLInt)
        },
        roles: {
            type: graphql.GraphQLList(graphql.GraphQLInt),
            resolve(obj) {
                return obj.role;
            }
        }
    })
});
