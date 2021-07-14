const graphql = require('graphql');

module.exports = new graphql.GraphQLObjectType({
    name: "LoginOutput",
    //Arrow func to prevent 'use before initialization' err
    fields: () => ({
        token: {
            type: graphql.GraphQLString
        },
        id: {
            type: graphql.GraphQLInt
        },
        isConfirmed: {
            type: graphql.GraphQLBoolean
        }
    })
});
