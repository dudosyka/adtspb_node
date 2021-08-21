const graphql = require("graphql");

module.exports = new graphql.GraphQLInputObjectType({
    name: "RuleInput",
    fields: () => ({
        id: {
            type: graphql.GraphQLInt
        },
        name: {
            type: graphql.GraphQLString
        },
        description: {
            type: graphql.GraphQLString
        }
    }),
});
