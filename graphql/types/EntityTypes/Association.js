const graphql = require("graphql");
const Proposal = require("../../Entity/Proposal");

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
