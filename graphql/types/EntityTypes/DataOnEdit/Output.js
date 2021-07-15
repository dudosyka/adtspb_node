const graphql = require("graphql");

module.exports = new graphql.GraphQLObjectType({
    name: "DataOnEditOutput",
    fields: () => ({
        id: {
            type: graphql.GraphQLID,
        },
        edited_table: {
            type: graphql.GraphQLString,
        },
        field: {
            type: graphql.GraphQLString,
        },
        old_value: {
            type: graphql.GraphQLString
        },
        new_value: {
            type: graphql.GraphQLString
        },
        timestamp: {
            type: graphql.GraphQLFloat
        },
        target_id: {
            type: graphql.GraphQLInt
        },
        requester_id: {
            type: graphql.GraphQLInt
        },
    })
});
