const graphql = require("graphql");

const Group = require('../../Entity/Group');
const GroupType = require('./Group');

const Association = require('../../Entity/Association');
const AssociationType = require('./Association');

module.exports = new graphql.GraphQLObjectType({
    name: "Timetable",
    fields: {
        id: {
            type: graphql.GraphQLID,
        },
        group: {
            type: GroupType,
            async resolve(obj, data) {
                const group = await Group.baseCreateFrom({id: obj.group_id});
                return group.fields;
            }
        },
        association: {
            type: AssociationType,
            async resolve(obj, data) {
                const association = await Association.baseCreateFrom({id: obj.association_id});
                return association.fields;
            }
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
