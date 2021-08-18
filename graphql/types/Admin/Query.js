const graphql = require('graphql');
const Stats = require('../../Entity/Stats');
const stats = new Stats();

const User = require('../../Entity/User');
const Proposal = require('../../Entity/Proposal');

module.exports = new graphql.GraphQLObjectType({
    name: "AdminQuery",
    fields: () => ({
        stat: {
            type: StatOutput,
            args: {},
            async resolve(obj) {
                if (!obj.adminModel.hasAccess(15))
                    throw Error('Forbidden');
                return await stats.getStat();
            }
        },
        association_proposal_list: {
            type: graphql.GraphQLList(ProposalOutput),
            args: {
                association_id: {
                    type: graphql.GraphQLInt,
                }
            },
            async resolve(obj, { association_id }) {
                proposals = await Proposal.selectProposalsList('association_id', [ association_id ], {status: true, child: true, parent: true});
                return proposals[association_id];
            }
        },
        rbac: {
            type: AccessControlQuery,
            resolve: obj => obj
        }
    }),
});

const AccessControlQuery = require('../AccessControl/Query');

const StatOutput = require('./OutputTypes/StatOutput');
const ProposalOutput = require('./OutputTypes/Proposal');
