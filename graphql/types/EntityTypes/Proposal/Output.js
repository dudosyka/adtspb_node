const graphql = require("graphql");
const Status = require('../../../Entity/Status');
const User = require('../../../Entity/User');
const Association = require('../../../Entity/Association');
const AssociationExtraData = require('../../../Entity/AssociationExraData');

module.exports = new graphql.GraphQLObjectType({
    name: "ProposalOutput",
    //Arrow func to prevent 'use before initialization' err
    fields: () => ({
        id: {
            type: graphql.GraphQLID,
        },
        association: {
            type: AssociationOutput,
        },
        child: {
            type: UserOutput,
            // async resolve (obj, data) {
            //   return obj.child;
            // }
        },
        parent: {
            type: UserOutput,
            // async resolve (obj, data) {
            //   return odj.parent;
            // }
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
        },
        isReserve: {
            type: graphql.GraphQLBoolean,
        },
        queuePosition: {
            type: graphql.GraphQLInt,
        },
        isDocumentTaken: {
            type: graphql.GraphQLBoolean,
            resolve(obj, data) {
                return obj.document_taken !== 0;
            }
        },
        isGroupSelected: {
            type: graphql.GraphQLInt,
            resolve(obj, data) {
                return obj.group_selected;
            }
        },
        isHidden: {
            type: graphql.GraphQLBoolean,
        }
    })
});

//Moved here to prevent from circular dependence err.
const AssociationOutput = require('../Association/Output');
const StatusOutput = require('../Status/Output');
const UserOutput = require('../User/OutputTypes/Main');
