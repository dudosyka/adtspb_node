const graphql = require("graphql");

module.exports = new graphql.GraphQLInputObjectType({
    name: "DisabilityGroupInput",
    fields: {
        id: {
            type: graphql.GraphQLID,
        },
        name: {
            type: graphql.GraphQLString,
        },
    }
});
