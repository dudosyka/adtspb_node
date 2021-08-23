const graphql = require('graphql');

module.exports = new graphql.GraphQLObjectType({
    name: "ChildOnDeleteOutput",
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
        remove: {
            type: graphql.GraphQLString
        },
        comment: {
            type: graphql.GraphQLString
        }
    }),
});

const UserOutput = require('../../EntityTypes/User/OutputTypes/Main');
