const {GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLInt} = require("graphql");

const UserMutation = require('./EntityTypes/User/Mutation');
const ProposalMutation = require('./EntityTypes/Proposal/Mutation');
const AssociationMutation = require('./EntityTypes/Association/Mutation');
const AdminMutation = require('./Admin/Mutation');

const User = require('../Entity/User');

module.exports = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        user: {
            type: UserMutation,
            resolve: obj => obj(),
        },
        proposal: {
            type: ProposalMutation,
            resolve: obj => obj(),
        },
        association: {
            type: AssociationMutation,
            resolve: obj => obj(),
        },
        admin: {
            type: AdminMutation,
            resolve: async obj => {
                const admin_id = obj().viewer.id;
                const adminModel = await User.createFrom({ id: admin_id });
                return {
                    ...obj(),
                    adminModel
                };
            },
        }
    }
});
