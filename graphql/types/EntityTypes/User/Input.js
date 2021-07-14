const graphql = require("graphql");

module.exports = new graphql.GraphQLInputObjectType({
    name: "UserInput",

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
        ovz: {
            type: graphql.GraphQLInt,
        },
        ovz_type: {
            type: OvzInput,
        },
        disability: {
            type: graphql.GraphQLInt,
        },
        disability_group: {
            type: DisabilityGroupInput,
        },
    })
});

const DisabilityGroupInput = require('../DisabilityGroup/Input');
const OvzInput = require('../Ovz/Input');
