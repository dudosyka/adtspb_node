const graphql = require("graphql");
const User = require('../../../Entity/User');
const UserExtraData = require('../../../Entity/UserExtraData');
const Proposal = require('../../../Entity/Proposal');
const UserChild = require('../../../Entity/UserChild');
const UserDataOnEdit = require('../../../Entity/UserDataOnEdit');
const EmailValidation = require('../../../Entity/EmailValidation');
const Rbac = require('../../../utils/Rbac');

const rbac = new Rbac();

module.exports = new graphql.GraphQLObjectType({
    name: "UserQuery",
    fields: () => ({
        data: {
            type: UserOutput,
            args: {
                id: {
                    type: graphql.GraphQLInt
                }
            },
            async resolve(obj, { id }) {
                const rights = await rbac.auth(obj.viewer.id, true);
                const model = Proposal.newModel();

                const res = await User.getFullData([id ?? obj.viewer.id], obj.selections, model, rights.role);
                return res[0];
            }
        },
        dataOnEdit: {
            type: graphql.GraphQLList(UserDataOnEditOutput),
            args: {
                target_id: {
                    type: graphql.GraphQLInt
                }
            },
            async resolve (obj, { target_id }) {
                if (target_id == 0)
                    target_id = null;
                return await UserDataOnEdit.getUserDataOnEdit(obj.viewer.id, target_id);
            }
        },
        rights: {
            type: UserRightsOutput,
            async resolve(obj, data) {
                const rights = await rbac.auth(obj.viewer.id);
                return rights;
            }
        },
        children: {
            type: graphql.GraphQLList(UserOutput),
            async resolve(obj) {
                const selections = obj.selections;
                const userModel = User.newModel();

                const userChild = await UserChild.baseCreateFrom({ parent_id: obj.viewer.id });
                const children = await userChild.getChildren(true, 1, selections, userModel);

                return children;
            }
        },
        parentRequests: {
            type: graphql.GraphQLList(UserOutput),
            async resolve(obj) {
                const selections = obj.selections;
                const userModel = User.newModel();

                const userChild = await UserChild.baseCreateFrom({ child_id: obj.viewer.id });
                return await userChild.getParentRequests(obj.selections, userModel);
            }
        },
        generateResolution: {
            type: graphql.GraphQLString,
            args: {
                child_id: {
                    type: graphql.GraphQLInt,
                }
            },
            async resolve(obj, { child_id }) {
                const child = await User.newModel().baseCreateFrom({ id: child_id });
                const parent = await User.newModel().baseCreateFrom({ id: obj.viewer.id });
                console.log(child.fields);
                console.log(parent.fields);
                const childExtraData = await UserExtraData.createFrom({ user_id: child_id });
                const model = Proposal.newModel();
                return await model.generateResolution(child, parent, childExtraData);
            }
        },
        checkConfirmation: {
            type: EmailValidationOutput,
            resolve: async (obj) => await EmailValidation.checkConfirmation(obj.viewer.id),
        }
    })
});

//Moved here to prevent from circular dependence err.
const UserOutput = require('./OutputTypes/Main');
const UserDataOnEditOutput = require('../DataOnEdit/UserOutput');
const UserRightsOutput = require('./OutputTypes/UserRights');
const EmailValidationOutput = require('../EmailValidation/Output');
