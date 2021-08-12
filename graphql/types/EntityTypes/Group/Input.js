const graphql = require("graphql");

module.exports = new graphql.GraphQLInputObjectType({
    name: "GroupInput",
    fields: () => ({
        id: {
            type: graphql.GraphQLID,
        },
        name: {
            type: graphql.GraphQLString,
        },
        num: {
            type: graphql.GraphQLInt,
        },
        closed: {
            type: graphql.GraphQLInt,
        },
        association_id: {
            type: graphql.GraphQLInt
        },
        timetable: {
            type: TimetableInput,
        },
    })
});

const TimetableInput = require("../Timetable/Input");
