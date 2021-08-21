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
                if (!obj.adminModel.hasAccess(15)) //Viewing stats
                    throw Error('Forbidden');
                return await stats.getStat(obj.adminModel);
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
                if (!obj.adminModel.hasAccess(16)) //Uploading recruiment statistic
                    throw Error('Forbidden');

                const allowed = await obj.adminModel.getAllowedAssociations();
                const { query, ids } = db.createRangeQuery(false, arr, "id");
                query = " AND `sub1`."+query;

                proposals = await Proposal.selectProposalsList('association_id', [ association_id ], {status: true, child: true, parent: true}, query, ids);
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
