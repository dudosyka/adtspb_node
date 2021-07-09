const graphql = require("graphql");
const Proposal = require("../../Entity/Proposal");
const AppConfig = require('../../config/AppConfig');

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
            resolve(obj) {
                const proposals = obj.proposals;
                return (proposals.length < (obj.group_count * AppConfig.group_size));
            }
        },
        groups: {
            type: graphql.GraphQLList(GroupType),
        },
        proposals: {
            type: graphql.GraphQLList(ProposalType),
        }
    })
});

//Moved here to prevent from circular dependence err.
const ProposalType = require("./Proposal");
const GroupType = require('./Group');
