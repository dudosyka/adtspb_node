const graphql = require('graphql');

const EditDataLogger = require('../../Entity/EditDataLogger');
const Group = require('../../Entity/Group');

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
                const logger = EditDataLogger.newModel();
                const association = Association.newModel();
                const extraData = AssociationExtraData.newModel();
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
                const logger = EditDataLogger.newModel();
                const group = Group.newModel();
                await group.edit(input, logger, admin_id);
                return true;
            }
        },
    }),
});

const AssociationInput = require('../EntityTypes/Association/Input');
const GroupInput = require('../EntityTypes/Group/Input');
