const graphql = require('graphql');

module.exports = new graphql.GraphQLObjectType({
    name: "AdminStatOutput",
    fields: () => ({
        parent_amount: {
            type: graphql.GraphQLInt
        },
        child_amount: {
            type: graphql.GraphQLInt
        },
        proposal_amount: {
            type: graphql.GraphQLInt
        },
        associations: {
            type: graphql.GraphQLList(AssociationStatOutput)
        }
    }),
});

const AssociationStatOutput = require('./AssociationStatOutput');
