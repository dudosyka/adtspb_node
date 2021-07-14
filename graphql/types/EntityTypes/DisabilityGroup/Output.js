const graphql = require("graphql");

module.exports = new graphql.GraphQLObjectType({
    name: "DisabilityGroupOutput",
    fields: {
        id: {
            type: graphql.GraphQLID,
        },
        name: {
            type: graphql.GraphQLString,
        },
    }
});
