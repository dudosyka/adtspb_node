const graphql = require('graphql');
const OvzType = require('../EntityTypes/Ovz');
const DisabilityGroupType = require('../EntityTypes/DisabilityGroup');
const ProposalType = require('../EntityTypes/Proposal');
const Proposal = require('../../Entity/Proposal');
const User = require('../../Entity/User');

module.exports = new graphql.GraphQLObjectType({
    name: "UserFullData",
    //Arrow func to prevent 'use before initialization' err
    fields: () => ({
        id: {
            type: graphql.GraphQLID,
            resolve(obj) {
                return obj.user_id ?? obj.id;
            }
        },
        name: {
            type: graphql.GraphQLString,
        },
        surname: {
            type: graphql.GraphQLString,
        },
        lastname: {
            type: graphql.GraphQLString,
        },
        email: {
            type: graphql.GraphQLString,
        },
        sex: {
            type: graphql.GraphQLInt,
        },
        phone: {
            type: graphql.GraphQLString,
        },
        password: {
            type: graphql.GraphQLString,
        },

        //Extra data
        birthday: {
            type: graphql.GraphQLFloat
        },
        relationship: {
            type: graphql.GraphQLString,
        },
        state: {
            type: graphql.GraphQLString,
        },
        studyPlace: {
            type: graphql.GraphQLString,
        },
        registration_address: {
            type: graphql.GraphQLString,
        },
        registration_flat: {
            type: graphql.GraphQLString,
        },
        residence_address: {
            type: graphql.GraphQLString,
        },
        residence_flat: {
            type: graphql.GraphQLString,
        },
        ovz: {
            type: graphql.GraphQLInt,
        },
        ovz_type: {
            type: OvzType,
            async resolve(obj, data) {
                return {
                    id: obj.ovz_type,
                    name: null
                }
            }
        },
        disability: {
            type: graphql.GraphQLInt,
        },
        disability_group: {
            type: DisabilityGroupType,
            async resolve(obj, data) {
                return {
                    id: obj.disability_group,
                    name: null
                }
            }
        },
        proposals: {
            type: graphql.GraphQLList(ProposalType),
            resolve (obj, data) {
                return (obj.proposals === undefined || obj.proposals === null) ? [] : obj.proposals;
            }
        },
    })
});
