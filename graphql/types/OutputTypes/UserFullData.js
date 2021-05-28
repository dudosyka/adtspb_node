const graphql = require('graphql');
const OvzType = require('../EntityTypes/Ovz');
const DisabilityGroupType = require('../EntityTypes/DisabilityGroup');

module.exports = new graphql.GraphQLObjectType({
    name: "UserFullData",
    //Arrow func to prevent 'use before initialization' err
    fields: () => ({
        id: {
            type: graphql.GraphQLID
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
        birth_certificate: {
            type: graphql.GraphQLString,
        },
        ovz: {
            type: graphql.GraphQLInt,
        },
        ovz_type: {
            type: OvzType,
            async resolve(obj, data) {
                return {
                    id: null,
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
                    id: null,
                    name: null
                }
            }
        },
    })
});
