const { GraphQLObjectType, GraphQLBoolean, GraphQLString, GraphQLID, GraphQLInt } = require("graphql");
const graphql = require('graphql');

const UserQuery = require('./EntityTypes/User/Query');
const AssociationQuery = require('./EntityTypes/Association/Query');
const ProposalQuery = require('./EntityTypes/Proposal/Query');
const AdminQuery = require('./Admin/Query');

const Jwt = require('../utils/Jwt');
let jwt = new Jwt();

const User = require('../Entity/User');

module.exports = new GraphQLObjectType({
    name: 'Query',
    fields: function () {
        return {
            user: {
                type: UserQuery,
                resolve: obj => obj(),
            },
            admin: {
                type: AdminQuery,
                resolve: async obj => {
                    const admin_id = obj().viewer.id;
                    const adminModel = await User.createFrom({ id: admin_id });
                    return {
                        ...obj(),
                        adminModel
                    };
                },
            },
            association: {
                type: AssociationQuery,
                resolve: obj => obj(),
            },
            proposal: {
                type: ProposalQuery,
                resolve: obj => obj(),
            },
            validToken: {
                type: GraphQLBoolean,
                args: {
                    token: {
                        type: GraphQLString
                    }
                },
                async resolve(obj, { token }) {
                  return (await jwt.parse(token) !== false);
                }
            },
        };
    },
});
