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
    })
});
