const graphql = require("graphql");

module.exports = new graphql.GraphQLObjectType({
    name: "Rule",
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
