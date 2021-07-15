const graphql = require("graphql");

const User = require("../../../Entity/User");
const UserChild = require("../../../Entity/UserChild");
const UserExtraData = require("../../../Entity/UserExtraData");

const EmailValidation = require('../../../Entity/EmailValidation');

const Jwt = require('../../../utils/Jwt');
const jwt = new Jwt();

module.exports = new graphql.GraphQLObjectType({
    name: "UserMutation",
    fields: () => ({
        confirm: {
            type: EmailValidationOutput,
            args: {
                code: {
                    type: graphql.GraphQLString
                }
            },
            async resolve (obj, { code }) {
                const result = await EmailValidation.confirmUser(code, obj.viewer.id);
                if (result.code == null) {
                    result.token = await jwt.sign({ id: obj.viewer.id, confirm: true });
                }
                return result;
            }
        },
        generateNewConfirmationCode: {
                type: EmailValidationOutput,
                async resolve(obj) {
                    const user = await User.baseCreateFrom(obj.viewer);
                    return (await EmailValidation.setOnConfirmation(obj.viewer.id, user.__get('email'), user.fullname())).fields;
                }
        },
        editMainData: {
            type: graphql.GraphQLBoolean,
            args: {
                newData: {
                    type: UserInput
                },
                target_id: {
                    type: graphql.GraphQLInt
                }
            },
            async resolve(obj, { newData, target_id }) {
                const viewer = await User.createFrom(obj.viewer);
                return (await viewer.setMainDataOnEdit(newData, target_id)) !== false;
            }
        },
        editExtraData: {
            type: graphql.GraphQLBoolean,
            args: {
                newData: {
                    type: UserInput
                },
                target_id: {
                    type: graphql.GraphQLInt
                }
            },
            async resolve(obj, { newData, target_id }) {
                const viewer = await User.createFrom(obj.viewer);
                const child = (target_id != null && target_id != 0);
                return (await viewer.setExtraDataOnEdit(newData, target_id, false, child)) !== false;
            }
        },
        confirmEditData: {
            type: graphql.GraphQLBoolean,
            args: {
                request_id: {
                    type: graphql.GraphQLInt
                }
            },
            async resolve(obj, { request_id }) {
                const viewer = await User.createFrom(obj.viewer);
                return await viewer.confirEditData(request_id)
            }
        },
        upgrade: {
            //TODO: Logs
            type: graphql.GraphQLBoolean,
            args: {
                data: {
                    type: UserInput,
                }
            },
            async resolve(obj, { data }) {
                let id = obj.viewer.id;
                const usrData = await UserExtraData.createFrom(data)
                usrData.save();
                return true;
            }
        },
        createChild: {
            type: graphql.GraphQLBoolean,
            args: {
                child: {
                    type: UserInput
                }
            },
            async resolve(obj, { child }) {
                const viewer = await User.createFrom(obj.viewer, true, false);
                return viewer.createChild(child);
            }
        },
        addChild: {
            type: graphql.GraphQLBoolean,
            args: {
                child_data: {
                    type: graphql.GraphQLString,
                }
            },
            async resolve(obj, { child_data }) {
                const viewer = await User.createFrom(obj.viewer);
                return await viewer.addChild(child_data);
            }
        },
        agreeParentRequest: {
            type: graphql.GraphQLBoolean,
            args: {
                parent_id: {
                    type: graphql.GraphQLInt,
                },
                newData: {
                    type: UserInput
                }
            },
            async resolve(obj, { parent_id, newData }) {
                const viewer = await User.createFrom(obj.viewer);
                return await viewer.agreeParentRequest(parent_id, newData);
            }
        },
        removeChildRequest: {
            type: graphql.GraphQLBoolean,
            args: {
                request_id: {
                    type: graphql.GraphQLInt
                },
            },
            async resolve(obj, { request_id }) {
                const userChild = await UserChild.baseCreateFrom({id: request_id});
                return await userChild.removeRequest();
            }
        },
        removeChild: {
            type: graphql.GraphQLBoolean,
            args: {
                child_id: {
                    type: graphql.GraphQLInt
                },
                removeAccount: {
                    type: graphql.GraphQLBoolean
                },
                comment: {
                    type: graphql.GraphQLString
                }
            },
            async resolve(obj, { child_id, removeAccount, comment }) {
                const viewer = await User.createFrom(obj.viewer);
                return viewer.removeChild(child_id, removeAccount, comment);
            }
        },
        confirmRemoveChild: {
            type: graphql.GraphQLBoolean,
            args: {
                link: {
                    type: graphql.GraphQLInt
                }
            },
            async resolve(obj, { link }) {
                const viewer = await User.createFrom(obj.viewer);
                return await viewer.confirmRemoveChild(link);
            }
        },
    })
});

//Moved here to prevent from circular dependence err.
const UserInput = require('./Input');
const EmailValidationOutput = require('../EmailValidation/Output');
