const graphql = require("graphql");

module.exports = new graphql.GraphQLObjectType({
    name: "User",
    fields: {
        id: {
            type: graphql.GraphQLID,
        },
        name: {
            type: graphql.GraphQLString,
        }
    }
});