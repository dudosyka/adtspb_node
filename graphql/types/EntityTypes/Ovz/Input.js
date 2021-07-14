const graphql = require("graphql");

module.exports = new graphql.GraphQLInputObjectType({
    name: "OvzInput",
    fields: {
        id: {
            type: graphql.GraphQLID,
        },
        name: {
            type: graphql.GraphQLString,
        },
    }
});
