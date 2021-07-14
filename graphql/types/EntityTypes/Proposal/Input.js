const graphql = require("graphql");

const AssociationInput = require('../Association/Input');
const UserInput = require('../User/Input');

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
