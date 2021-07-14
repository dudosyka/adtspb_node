const graphql = require("graphql");

const Proposal = require('../../../Entity/Proposal');

const User = require('../../../Entity/User');
const UserExtraData = require('../../../Entity/UserExtraData');

const Association = require('../../../Entity/Association');

module.exports = new graphql.GraphQLObjectType({
    name: "ProposalQuery",
    //Arrow func to prevent 'use before initialization' err
    fields: () => ({
        generatePdf: {
            type: graphql.GraphQLString,
            args: {
                proposal: {
                    type: ProposalInput
                }
            },
            async resolve(obj, { proposal }) {
                const proposalEntity = await Proposal.createFromInput(proposal);
                if (proposalEntity.__get('association_id') == null)
                    throw Error('Proposal not found');

                const userModel = User.newModel();
                const parentModel = User.newModel();
                const userExtraModel = UserExtraData.newModel();
                const associationModel = Association.newModel();
                const buffer = await proposalEntity.generatePdf(userModel, parentModel, userExtraModel, associationModel);
                return buffer.toString("base64");
            }
        },
    })
});

//Moved here to prevent from circular dependence err.
const ProposalInput = require('./Input');
