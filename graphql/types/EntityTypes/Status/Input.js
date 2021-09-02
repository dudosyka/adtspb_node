const graphql = require("graphql");

module.exports = new graphql.GraphQLInputObjectType({
    name: "ProposalStatusInput",
    fields: {
        id: {
            type: graphql.GraphQLID,
        },
        proposal_id: {
            type: graphql.GraphQLInt,
        },
        student: {
            type: graphql.GraphQLInt,
        },
        group: {
            type: graphql.GraphQLInt,
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
