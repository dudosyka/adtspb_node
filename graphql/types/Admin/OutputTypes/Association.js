const graphql = require('graphql');

module.exports = new graphql.GraphQLObjectType({
    name: "AdminAssociationStatOutput",
    fields: () => ({
        id: {
            type: graphql.GraphQLInt
        },
        name: {
            type: graphql.GraphQLString
        },
        planned: {
            type: graphql.GraphQLInt
        },
        actual: {
            type: graphql.GraphQLInt
        },
        fullness_percent: {
            type: graphql.GraphQLInt
        }
    }),
});
