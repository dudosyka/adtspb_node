const graphql = require("graphql");

module.exports = new graphql.GraphQLInputObjectType({
    name: "UserRole",
    fields: () => ({
        user_id: {
            type: graphql.GraphQLInt
        },
        role_id: {
            type: graphql.GraphQLInt
        }
    }),
});
