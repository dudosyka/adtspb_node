const graphql = require("graphql");

module.exports = new graphql.GraphQLObjectType({
    name: "Timetable",
    fields: {
        id: {
            type: graphql.GraphQLID,
        },
        group_id: {
            type: graphql.GraphQLID,
        },
        association_id: {
            type: graphql.GraphQLID,
        },
        week: {
            type: graphql.GraphQLList(graphql.GraphQLString),
            async resolve(obj, data) {
                let week = [];
                week.push(obj.monday);
                week.push(obj.tuesday);
                week.push(obj.wednesday);
                week.push(obj.thursday);
                week.push(obj.friday);
                week.push(obj.saturday);
                week.push(obj.sunday);
                return week;
            }
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
