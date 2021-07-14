const graphql = require("graphql");

const User = require('../../../Entity/User');
const UserExtraData = require('../../../Entity/UserExtraData');

const Proposal = require('../../../Entity/Proposal');

module.exports = new graphql.GraphQLObjectType({
    name: "ProposalMutation",
    //Arrow func to prevent 'use before initialization' err
    fields: () => ({
        createProposal: {
            type: graphql.GraphQLBoolean,
            args: {
                proposal: {
                    type: ProposalInput
                }
            },
            async resolve(obj, { proposal }) {
                const userModel = User.newModel();
                const userExtraDataModel = UserExtraData.newModel();
                proposal.parent = {id: obj.viewer.id};
                let model = await Proposal.createFromInput(proposal);
                return model.createNew(userModel, userExtraDataModel);
            }
        },
        recallProposal: {
            type: graphql.GraphQLBoolean,
            args: {
                proposal_id: {
                    type: graphql.GraphQLInt
                }
            },
            async resolve(obj, { proposal_id }) {
                const proposal = await Proposal.baseCreateFrom({id: proposal_id});
                const res = await proposal.recall(obj.viewer.id).catch(err => {throw Error(err)});
                return res.affectedRows > 0;
            }
        },
    })
});

//Moved here to prevent from circular dependence err.
const ProposalInput = require('./Input');
