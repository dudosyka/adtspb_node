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
        // TODO: Remove?
        hidden: {
            type: graphql.GraphQLBoolean,
        }
    }
});
