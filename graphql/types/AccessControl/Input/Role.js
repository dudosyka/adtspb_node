const graphql = require("graphql");

module.exports = new graphql.GraphQLInputObjectType({
    name: "RoleInput",
    fields: () => ({
        id: {
            type: graphql.GraphQLInt
        },
        name: {
            type: graphql.GraphQLString
        },
        description: {
            type: graphql.GraphQLString 
        },
        rules: {
            type: graphql.GraphQLList(RuleInput)
        }
    }),
});

const RuleInput = require('./Rule');
