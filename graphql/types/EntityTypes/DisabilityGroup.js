const graphql = require("graphql");

module.exports = new graphql.GraphQLObjectType({
    name: "DisabilityGroup",
    fields: {
        id: {
            type: graphql.GraphQLID,
        },
        name: {
            type: graphql.GraphQLString,
        },
    }
});
