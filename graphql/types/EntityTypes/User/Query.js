const graphql = require("graphql");
const User = require('../../../Entity/User');
const Proposal = require('../../../Entity/Proposal');
const UserChild = require('../../../Entity/UserChild');
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
                const rights = await rbac.auth(id ?? obj.viewer.id, true);
                const model = Proposal.newModel();

                const res = await User.getFullData([id ?? obj.viewer.id], obj.selections, model, rights.role);
                return res[0];
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
                console.log(obj);
                const selections = obj.selections;
                const userModel = User.newModel();

                const userChild = await UserChild.baseCreateFrom({ parent_id: obj.viewer.id });
                const children = await userChild.getChildren(true, 1, false, selections, userModel);

                return children;
            }
        },
        parentRequests: {
            type: graphql.GraphQLList(UserOutput),
            async resolve(obj) {
                const userChild = await UserChild.baseCreateFrom({ child_id: obj.viewer.id });
                return await userChild.getParentRequests();
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
                const child = await User.baseCreateFrom({ id: child_id });
                const parent = await User.baseCreateFrom({ id: obj.viewer.id });
                const model = Proposal.newModel();
                return await model.generateResolution(child, parent);
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
const UserRightsOutput = require('./OutputTypes/UserRights');
const EmailValidationOutput = require('../EmailValidation/Output');
