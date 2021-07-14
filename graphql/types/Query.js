const { GraphQLObjectType, GraphQLBoolean, GraphQLString, GraphQLID, GraphQLInt } = require("graphql");
const graphql = require('graphql');

const UserQuery = require('./EntityTypes/User/Query');
const AssociationQuery = require('./EntityTypes/Association/Query');
const ProposalQuery = require('./EntityTypes/Proposal/Query');

const Jwt = require('../utils/Jwt');
let jwt = new Jwt();

module.exports = new GraphQLObjectType({
    name: 'Query',
    fields: function () {
        return {
            user: {
                type: UserQuery,
                resolve: (obj) => obj(),
            },
            association: {
                type: AssociationQuery,
                resolve: (obj) => obj(),
            },
            proposal: {
                type: ProposalQuery,
                resolve: (obj) => obj(),
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
