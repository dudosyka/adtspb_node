const graphql = require("graphql");

module.exports = new graphql.GraphQLObjectType({
    name: "Group",
    fields: {
        id: {
            type: graphql.GraphQLID,
        },
        name: {
            type: graphql.GraphQLString,
        },
        num: {
            type: graphql.GraphQLInt,
        },
        association_id: {
            type: graphql.GraphQLInt
        }
    }
});
