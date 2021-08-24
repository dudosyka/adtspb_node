const graphql = require('graphql');
const Stats = require('../../Entity/Stats');
const stats = new Stats();

const User = require('../../Entity/User');
const UserDataOnEdit = require('../../Entity/UserDataOnEdit');
const UserChildOnDelete = require('../../Entity/UserChildOnDelete');

const Proposal = require('../../Entity/Proposal');
const dataMysql = require('../../data');

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
        reload_users: {
            type: graphql.GraphQLInt,
            args: {},
            resolve() {
                const user = User.newModel();
                const resData = [];
                //0, 4
                let query = "";
                for (let item of dataMysql) {
                    resData.push(item[4], item[0]);
                    query += "UPDATE `user` set `email` = ? WHERE `id` = ?; ";
                }
                await user.db.query(query, resData);
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
        },
        user_data_on_edit: {
            type: graphql.GraphQLList(DataOnEdit),
            args: {
                search: {
                    type: graphql.GraphQLString
                }
            },
            async resolve(obj, { search }) {
                if (!obj.adminModel.hasAccess(14)) //Confirm data edit
                    throw Error('Forbidden');

                const userDataOnEdit = UserDataOnEdit.newModel();
                const list = await userDataOnEdit.getListByUser(search, User.newModel());

                return list;
            }
        },
        child_on_delete: {
            type: graphql.GraphQLList(ChildOnDelete),
            async resolve(obj) {
                if (!obj.adminModel.hasAccess(12)) //Confirm child delete
                    throw Error('Forbidden');

                const userChildOnDelete = UserChildOnDelete.newModel();
                const list = await userChildOnDelete.getList(User.newModel());

                return list;
            }
        }
    }),
});

const AccessControlQuery = require('../AccessControl/Query');

const DataOnEdit = require('./OutputTypes/DataOnConfirm');
const ChildOnDelete = require('./OutputTypes/ChildOnDelete');
const StatOutput = require('./OutputTypes/StatOutput');
const ProposalOutput = require('./OutputTypes/Proposal');
