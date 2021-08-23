const graphql = require('graphql');

module.exports = new graphql.GraphQLObjectType({
    name: "DataOnConfirmOutput",
    fields: () => ({
        id: {
            type: graphql.GraphQLInt
        },
        target: {
            type: UserOutput,
        },
        requester: {
            type: UserOutput,
        },
        old_value: {
            type: graphql.GraphQLString
        },
        new_value: {
            type: graphql.GraphQLString
        },
        field: {
            type: graphql.GraphQLString
        }
    }),
});

const UserOutput = require('../../EntityTypes/User/OutputTypes/Main');
