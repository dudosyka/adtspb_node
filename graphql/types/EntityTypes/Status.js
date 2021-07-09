const graphql = require("graphql");

module.exports = new graphql.GraphQLObjectType({
    name: "Status",
    fields: {
        id: {
            type: graphql.GraphQLID,
        },
        text: {
            type: graphql.GraphQLString,
        },
        num: {
            type: graphql.GraphQLInt,
        },
        // TODO: Remove?
        hidden: {
            type: graphql.GraphQLBoolean,
        }
    }
});
