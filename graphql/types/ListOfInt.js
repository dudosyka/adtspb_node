const graphql = require("graphql");

module.exports = new graphql.GraphQLInputObjectType({
    name: "ListOfInt",
    fields: () => ({
        list: {
            type: graphql.GraphQLList(graphql.GraphQLInt)
        }
    })
})
