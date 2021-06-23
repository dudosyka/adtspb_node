const graphql = require("graphql");
const Proposal = require("../../Entity/Proposal");
const AppConfig = require('../../config/AppConfig');
const Timetable = require("../../Entity/Timetable");

module.exports = new graphql.GraphQLObjectType({
    name: "Association",
    //Arrow func to prevent 'use before initialization' err
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
            type: graphql.GraphQLString,
        },
        isRecruiment: {
            type: graphql.GraphQLBoolean,
            async resolve(obj, data) {
                const proposals = await Proposal.selectByAssociation(obj, true);
                return (proposals.length < (obj.group_count * AppConfig.group_size));
            }
        },
        timetable: {
            type: graphql.GraphQLList(TimetableType),
            async resolve(obj, data) {
                const timetable = await Timetable.createFrom({ association_id: obj.id });
                return timetable.map(el => el.fields);
            }
        },
        proposals: {
            type: graphql.GraphQLList(ProposalType),
            async resolve (obj, data) {
                console.log('OBJ: ',obj);
                let proposals = await Proposal.selectByAssociation(obj);
                console.log('Proposal: ', proposals);
                return proposals;
            }
        }
    })
});

//Moved here to prevent from circular dependence err.
const ProposalType = require("./Proposal");
const TimetableType = require("./Timetable");
