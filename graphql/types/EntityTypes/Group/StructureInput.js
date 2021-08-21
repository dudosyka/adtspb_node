const graphql = require("graphql");

module.exports = new graphql.GraphQLInputObjectType({
    name: "GroupStructureInput",
    fields: () => ({
        group_id: {
            type: graphql.GraphQLInt,
        },
        proposals: {
            type: graphql.GraphQLList(graphql.GraphQLInt),
        }
    })
});
