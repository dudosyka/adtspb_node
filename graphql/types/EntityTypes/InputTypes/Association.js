const graphql = require("graphql");

module.exports = new graphql.GraphQLInputObjectType({
    name: "AssociationInput",

    fields: () => ({
        id: {
            type: graphql.GraphQLID,
        },
        name: {
            type: graphql.GraphQLString,
        }
    })
});
