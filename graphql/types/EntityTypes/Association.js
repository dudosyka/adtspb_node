const graphql = require("graphql");

module.exports = new graphql.GraphQLObjectType({
    name: "Association",
    //Arrow func to prevent 'use before initialization' err
    fields: () => ({
        id: {
            type: graphql.GraphQLID,
        },
        proposals: {
            type: graphql.GraphQLList(ProposalType),
        }
    })
});

//Moved here to prevent from circular dependence err.
const ProposalType = require("./Proposal");
