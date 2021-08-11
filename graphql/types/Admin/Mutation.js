const graphql = require('graphql');

const EditDataLogger = require('../../Entity/EditDataLogger');
const Association = require('../../Entity/Association');
const AssociationExtraData = require('../../Entity/AssociationExraData');

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
        }
    }),
});

const AssociationInput = require('../EntityTypes/Association/Input');
