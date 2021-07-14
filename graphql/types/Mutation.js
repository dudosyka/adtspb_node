const {GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLInt} = require("graphql");

const UserMutation = require('./EntityTypes/User/Mutation');
const ProposalMutation = require('./EntityTypes/Proposal/Mutation');

module.exports = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        user: {
            type: UserMutation,
            resolve: (obj) => obj(),
        },
        proposal: {
            type: ProposalMutation,
            resolve: (obj) => obj(),
        }
    }
});
