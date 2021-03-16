const graphql = require("graphql");

module.exports = new graphql.GraphQLObjectType({
    name: "Proposal",
    //Arrow func to prevent 'use before initialization' err
    fields: () => ({
        id: {
            type: graphql.GraphQLID,
        },
        association: {
            type: require('./Association'),
        },
        child: {
            type: UserType,
            async resolve (obj, data) {
              return { /*..*/ };
            }
        },
        parent: {
            type: UserType,
            async resolve (obj, data) {
              return { /*..*/ };
            }
        },
        status: {
            type: StatusType,
            args: {
            //Should we send hidden statuses? [true|false]
                showHidden: {
                  type: graphql.GraphQLBoolean,
                }
            },
            async resolve (obj, { showHidden }) {
                return { /*..*/ };
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
