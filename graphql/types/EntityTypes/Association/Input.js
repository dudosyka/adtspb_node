const graphql = require("graphql");

module.exports = new graphql.GraphQLInputObjectType({
    name: "AssociationInput",

    fields: () => ({
        id: {
            type: graphql.GraphQLID,
        },
        name: {
            type: graphql.GraphQLString,
        },
        description: {
            type: graphql.GraphQLString,
        },
        min_age: {
            type: graphql.GraphQLInt,
        },
        max_age: {
            type: graphql.GraphQLInt,
        },
        study_years: {
            type: graphql.GraphQLInt,
        },
        hours_week: {
            type: graphql.GraphQLInt,
        },
        lessons_week: {
            type: graphql.GraphQLInt,
        },
        study_form: {
            type: graphql.GraphQLString,
        },
        hours_count: {
            type: graphql.GraphQLInt,
        },
        study_period: {
            type: graphql.GraphQLString,
        },
        timetable: {
            type: graphql.GraphQLString
        }
    })
});
