const graphql = require('graphql');

const EditDataLogger = require('../../Entity/EditDataLogger');
const logger = EditDataLogger.newModel();

const AssociationExtraData = require('../../Entity/AssociationExraData');
const extraData = AssociationExtraData.newModel();

const Association = require('../../Entity/Association');
const association = Association.newModel();

const Group = require('../../Entity/Group');
const group = Group.newModel();

const UserGroup = require('../../Entity/UserGroup');
const userGroup = UserGroup.newModel();

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
        create_association: {
            type: graphql.GraphQLInt,
            args: {
                input: {
                    type: AssociationInput
                }
            },
            async resolve(obj, { input }) {
                if (!obj.adminModel.hasAccess(24)) //Association creating
                    throw Error('Forbidden');

                const admin_id = obj.viewer.id;
                const association_id = await association.newFromInput(input, extraData);
                return association_id;
            }
        },
        edit_association: {
            type: graphql.GraphQLBoolean,
            args: {
                input: {
                    type: AssociationInput,
                }
            },
            async resolve(obj, { input }) {
                if (!obj.adminModel.hasAccess(21)) //Association editing
                    throw Error('Forbidden');
                else
                    if (input.closed)
                        if (!obj.adminModel.hasAccess(17)) //Managing recruiment
                            throw Error('Forbidden');

                const admin_id = obj.viewer.id;
                await association.edit(input, logger, extraData, admin_id);
                return true;
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
                if (!obj.adminModel.hasAccess(25)) //Groups creating
                    throw Error('Forbidden');

                const admin_id = obj.viewer.id;
                const group_id = await group.newFromInput(input, extraData);
                return group_id;
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
                if (!obj.adminModel.hasAccess(22)) //Groups editing
                    throw Error('Forbidden');
                else
                    if (input.closed)
                        if (!obj.adminModel.hasAccess(27)) //Managing group`s recruiment
                            throw Error('Forbidden');

                const admin_id = obj.viewer.id;
                await group.edit(input, logger, admin_id, extraData);
                return true;
            }
        },
        edit_group_structure: {
            type: graphql.GraphQLBoolean,
            args: {
                input: {
                    type: GroupStructureInput
                }
            },
            async resolve(obj, { input }) {
                if (!obj.adminModel.hasAccess(36)) //Group`s structure editing
                    throw Error('Forbidden');

                const allowed = await obj.adminModel.getAllowedAssociations();
                return await userGroup.editGroupStructure(input, group, proposal, allowed);
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
                if (!obj.adminModel.hasAccess(31)) //Proposal creating (for admins)
                    throw Error('Forbidden');

                let model = await Proposal.createFromInput(proposal);
                return await model.createNew(user, userExtraData, true);
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
                if (!obj.adminModel.hasAccess(28)) //Proposal status editing
                    throw Error('Forbidden');

                const allowed = await obj.adminModel.getAllowedAssociations();
                const admin_id = obj.viewer.id;
                await status.editStatus(input, logger, admin_id, proposal, allowed);
            }
        },
        set_document_taken: {
            type: graphql.GraphQLBoolean,
            args: {
                proposal: {
                    type: graphql.GraphQLInt
                }
            },
            async resolve (obj, data) {
            if (!obj.adminModel.hasAccess(28)) //Proposal status editing
                throw Error('Forbidden');

            const allowed = await obj.adminModel.getAllowedAssociations();
            const admin_id = obj.viewer.id;
            await proposal.setDocumentTaken(data.proposal, logger, admin_id, allowed);
            return true;
            }
        },
        recall_proposal: {
            type: graphql.GraphQLBoolean,
            args: {
                proposal: {
                    type: graphql.GraphQLInt
                }
            },
            async resolve(obj, data) {
                if (!obj.adminModel.hasAccess(28)) //Proposal status editing
                    throw Error('Forbidden');

                const admin_id = obj.viewer.id;
                const model = await Proposal.createFrom({ id: data.proposal });
                await model.recall(admin_id, true);
                return true;
            }
        },

        edit_user: {
            type: graphql.GraphQLBoolean,
            args: {
                input: {
                    type: UserInput
                }
            },
            async resolve(obj, { input }) {
                if (!obj.adminModel.hasAccess(29)) //User data editing
                    throw Error('Forbidden');

                const admin_id = obj.viewer.id;
                await user.editData(input, logger, userExtraData, admin_id);
                return true;
            }
        },
        rbac: {
            type: AccessControlMutation,
            resolve: obj => obj
        },
    }),
});

const AccessControlMutation = require('../AccessControl/Mutation');

const AssociationInput = require('../EntityTypes/Association/Input');
const AssociationOutput = require('../EntityTypes/Association/Input');

const GroupInput = require('../EntityTypes/Group/Input');
const GroupStructureInput = require('../EntityTypes/Group/StructureInput');
const GroupOutput = require('../EntityTypes/Group/Input');

const ProposalInput = require('../EntityTypes/Proposal/Input');
const ProposalStatusInput = require('../EntityTypes/Status/Input');

const UserInput = require('../EntityTypes/User/Input');
