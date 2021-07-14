const graphql = require("graphql");

module.exports = new graphql.GraphQLObjectType({
    name: "RuleOutput",
    fields: {
        id: {
            type: graphql.GraphQLID,
        },
        name: {
            type: graphql.GraphQLString,
        },
        description: {
            type: graphql.GraphQLBoolean,
        }
    }
});
