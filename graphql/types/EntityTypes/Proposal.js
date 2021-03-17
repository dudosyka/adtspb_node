const graphql = require("graphql");
const Status = require('../../Entity/Status');
const User = require('../../Entity/User');

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
              return (await User._createFrom({id: obj.child_id})).fields;
            }
        },
        parent: {
            type: UserType,
            async resolve (obj, data) {
              return (await User._createFrom({id: obj.parent_id})).fields;
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
            async resolve (obj, { showHidden }) {
                console.log('OBJ 2: ', obj);
                let statuses = await Status.selectByProposal(obj, showHidden);
                console.log(statuses);
                return statuses;
            },
        },
        isHiddent: {
            type: graphql.GraphQLBoolean,
        }
    })
});

//Moved here to prevent from circular dependence err.
const AssociationType = require('./Association');
const StatusType = require('./Status');
const UserType = require('./User');
