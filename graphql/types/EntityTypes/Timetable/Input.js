const graphql = require("graphql");

module.exports = new graphql.GraphQLInputObjectType({
    name: "TimetableInput",
    fields: {
        id: {
            type: graphql.GraphQLID,
        },
        monday: {
            type: graphql.GraphQLString,
        },
        tuesday: {
            type: graphql.GraphQLString,
        },
        wednesday: {
            type: graphql.GraphQLString,
        },
        thursday: {
            type: graphql.GraphQLString,
        },
        friday: {
            type: graphql.GraphQLString,
        },
        saturday: {
            type: graphql.GraphQLString,
        },
        sunday: {
            type: graphql.GraphQLString,
        },
    }
});
