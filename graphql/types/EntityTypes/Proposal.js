const graphql = require("graphql");
const Status = require('../../Entity/Status');
const User = require('../../Entity/User');
const Association = require('../../Entity/Association');
const AssociationExtraData = require('../../Entity/AssociationExraData');

module.exports = new graphql.GraphQLObjectType({
    name: "Proposal",
    //Arrow func to prevent 'use before initialization' err
    fields: () => ({
        id: {
            type: graphql.GraphQLID,
        },
        association: {
            type: AssociationType,
        },
        child: {
            type: UserType,
            async resolve (obj, data) {
              return (await User.baseCreateFrom({id: obj.child_id})).fields;
            }
        },
        parent: {
            type: UserType,
            async resolve (obj, data) {
              return (await User.baseCreateFrom({id: obj.parent_id})).fields;
            }
        },
        status: {
            type: graphql.GraphQLList(StatusType),
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
        isDocumentTaken: {
            type: graphql.GraphQLBoolean,
            resolve(obj, data) {
                return obj.document_taken !== 0;
            }
        },
        isHidden: {
            type: graphql.GraphQLBoolean,
        }
    })
});

//Moved here to prevent from circular dependence err.
const AssociationType = require('./Association');
const StatusType = require('./Status');
const UserType = require('./User');
