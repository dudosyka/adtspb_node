const graphql = require("graphql");

module.exports = new graphql.GraphQLObjectType({
    name: "RuleOutput",
    //Arrow func to prevent 'use before initialization' err
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
