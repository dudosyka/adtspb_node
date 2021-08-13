const graphql = require('graphql');

module.exports = new graphql.GraphQLObjectType({
    name: "AdminProposalOutput",
    fields: () => ({
        id: {
            type: graphql.GraphQLInt
        },
        child: {
            type: UserOutput,
        },
        parent: {
            type: UserOutput,
        },
        status: {
            type: graphql.GraphQLList(StatusOutput),
            args: {
            //Should we send hidden statuses? [true|false]
                showHidden: {
                  type: graphql.GraphQLBoolean,
                }
            },
            resolve (obj, { showHidden }) {
                return (obj.status.constructor === Array) ? obj.status : [ obj.status ];
            },
        }
    }),
});

const StatusOutput = require('../../EntityTypes/Status/Output');
const UserOutput = require('../../EntityTypes/User/OutputTypes/Main');
