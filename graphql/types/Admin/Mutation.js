const graphql = require('graphql');

const EditDataLogger = require('../../Entity/EditDataLogger');
const logger = EditDataLogger.newModel();

const AssociationExtraData = require('../../Entity/AssociationExraData');
const extraData = AssociationExtraData.newModel();

const Association = require('../../Entity/Association');
const association = Association.newModel();

const Group = require('../../Entity/Group');
const group = Group.newModel();

const User = require('../../Entity/User');
const user = User.newModel();

const UserExtraData = require('../../Entity/UserExtraData');
const userExtraData = UserExtraData.newModel();

const Proposal = require('../../Entity/Proposal');
const proposal = Proposal.newModel();

const Status = require('../../Entity/Status');
const status = Status.newModel();

module.exports = new graphql.GraphQLObjectType({
    name: "AdminMutation",
    fields: () => ({
        edit_association: {
            type: graphql.GraphQLBoolean,
            args: {
                input: {
                    type: AssociationInput,
                }
            },
            async resolve(obj, { input }) {
                const admin_id = obj.viewer.id;
                await association.edit(input, logger, extraData, admin_id);
                return true;
            }
        },
        edit_group: {
            type: graphql.GraphQLBoolean,
            args: {
                input: {
                    type: GroupInput,
                }
            },
            async resolve(obj, { input }) {
                const admin_id = obj.viewer.id;
                await group.edit(input, logger, admin_id);
                return true;
            }
        },
        edit_proposal_status: {
            type: graphql.GraphQLBoolean,
            args: {
                input: {
                    type: ProposalStatusInput
                }
            },
            async resolve(obj, { input }) {
                const admin_id = obj.viewer.id;
                await status.editStatus(input, logger, admin_id);
            }
        },
        create_association: {
            type: graphql.GraphQLInt,
            args: {
                input: {
                    type: AssociationInput
                }
            },
            async resolve(obj, { input }) {
                const admin_id = obj.viewer.id;
                const association_id = await association.newFromInput(input, extraData);
                return association_id;
            }
        },
        create_group: {
            type: graphql.GraphQLInt,
            args: {
                input: {
                    type: GroupInput
                }
            },
            async resolve(obj, { input }) {
                const admin_id = obj.viewer.id;
                const group_id = await group.newFromInput(input, extraData);
                return group_id;
            }
        },
        create_proposal: {
            type: graphql.GraphQLInt,
            args: {
                proposal: {
                    type: ProposalInput
                }
            },
            async resolve(obj, { proposal }) {
                let model = await Proposal.createFromInput(proposal);
                return await model.createNew(user, userExtraData, true);
            }
        },
        rbac: {
            type: AccessControlMutation,
            resolve: obj => obj
        }
    }),
});

const AccessControlMutation = require('../AccessControl/Mutation'); 

const AssociationInput = require('../EntityTypes/Association/Input');
const AssociationOutput = require('../EntityTypes/Association/Input');

const GroupInput = require('../EntityTypes/Group/Input');
const GroupOutput = require('../EntityTypes/Group/Input');

const ProposalInput = require('../EntityTypes/Proposal/Input');
const ProposalStatusInput = require('../EntityTypes/Status/Input');
