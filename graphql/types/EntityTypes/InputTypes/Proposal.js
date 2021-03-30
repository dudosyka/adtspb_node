const graphql = require("graphql");

const AssociationInput = require('./Association');
const UserInput = require('./User');

module.exports = new graphql.GraphQLInputObjectType({
    name: "ProposalInput",

    fields: () => ({
        id: {
            type: graphql.GraphQLID,
        },
        association: {
            type: AssociationInput,
        },
        child: {
            type: UserInput,
        },
        parent: {
            type: UserInput,
        }
    })
});
