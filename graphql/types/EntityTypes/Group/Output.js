const graphql = require("graphql");

module.exports = new graphql.GraphQLObjectType({
    name: "GroupOutput",
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
            type: TimetableOutput,
        },
    })
});

const TimetableOutput = require("../Timetable/Output");
