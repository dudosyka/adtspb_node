const graphql = require("graphql");
const Proposal = require('../../Entity/Proposal');

module.exports = new graphql.GraphQLObjectType({
    name: "User",
    //Arrow func to prevent 'use before initialization' err
    fields: () => ({
        id: {
            type: graphql.GraphQLID,
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
        proposals: {
            type: graphql.GraphQLList(ProposalType),
            async resolve (obj, data) {
                console.log('USER OBJ: ', obj);
                return await Proposal.selectByUser(obj);
            }
        }
    })
});

//Moved here to prevent from circular dependence err.
const ProposalType = require('./Proposal');
