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
        students: {
            type: graphql.GraphQLList(UserOutput)
        },
        timetable: {
            type: TimetableOutput,
        },
    })
});

const TimetableOutput = require("../Timetable/Output");
const UserOutput = require('../User/OutputTypes/Main');
