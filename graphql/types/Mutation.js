const {GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLInt} = require("graphql");

const UserType = require("./EntityTypes/User");
const UserInput = require("./EntityTypes/InputTypes/User");
const User = require('../Entity/User');
const UserChild = require('../Entity/UserChild');
const UserExtraData = require('../Entity/UserExtraData');
const UserChildOnDelete = require('../Entity/UserChildOnDelete');

const ProposalType = require('./EntityTypes/Proposal');
const ProposalInput = require('./EntityTypes/InputTypes/Proposal');
const Proposal = require('../Entity/Proposal');

const EmailValidation = require('../Entity/EmailValidation');
const EmailValidationType = require('./EntityTypes/EmailValidation');

const Rbac = require("../utils/Rbac");
const rbac = new Rbac();

const Db = require("../utils/Db");
const db = new Db();

const Jwt = require('../utils/Jwt');
let jwt = new Jwt();

const { client } = require('../utils/Redis');

module.exports = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: GraphQLString,
            args: {
                user: {
                    type: UserInput,
                }
            },
            async resolve(obj, { user }) {
                let usr = await User.createFrom(user);
                return usr.createNew();
            }
        },
        createProposal: {
            type: GraphQLBoolean,
            args: {
                proposal: {
                    type: ProposalInput
                }
            },
            async resolve(obj, { proposal }) {
                const userModel = User.newModel();
                const userExtraDataModel = UserExtraData.newModel();
                proposal.parent = {id: obj().viewer.id};
                let model = await Proposal.createFromInput(proposal);
                return model.createNew(userModel, userExtraDataModel);
            }
        },
        recallProposal: {
            type: GraphQLBoolean,
            args: {
                proposal_id: {
                    type: GraphQLInt
                }
            },
            async resolve(obj, { proposal_id }) {
                const proposal = await Proposal.baseCreateFrom({id: proposal_id});
                const res = await proposal.recall(obj().viewer.id).catch(err => {throw Error(err)});
                return res.affectedRows > 0;
            }
        },
        restorePassword: {
            type: GraphQLBoolean,
            args: {
                email: {
                    type: GraphQLString
                },
                code: {
                    type: GraphQLInt
                },
                password: {
                    type: GraphQLString
                }
            },
            async resolve(obj, { email, code, password }) {
                return User.restorePassword(email, code, password);
            }
        },
        confirmUser: {
            type: EmailValidationType,
            args: {
                code: {
                    type: GraphQLString
                }
            },
            async resolve (obj, { code }) {
                const result = await EmailValidation.confirmUser(code, obj().viewer.id);
                if (result.code == null) {
                    result.token = await jwt.sign({ id: obj().viewer.id, confirm: true });
                }
                return result;
            }
        },
        generateNewConfirmationCode: {
                type: EmailValidationType,
                args: {},
                async resolve(obj, { }) {
                    const user = await User.baseCreateFrom(obj().viewer);
                    return (await EmailValidation.setOnConfirmation(obj().viewer.id, user.__get('email'), user.fullname())).fields;
                }
        },
        //TODO: Logs
        upgradeUser: {
            type: GraphQLBoolean,
            args: {
                data: {
                    type: UserInput,
                }
            },
            async resolve(obj, { data }) {
                let id = obj().viewer.id;
                // data.user_id = id;
                // if (data.id)
                // {
                //     data.user_id = data.id;
                // }
                const usrData = await UserExtraData.createFrom(data)
                usrData.save();
                return true;
            }
        },
        //New request from parent to child
        //(1. Child already signed up, 2. Child must agree request - agreeParentRequest)
        addChild: {
            type: GraphQLBoolean,
            args: {
                child_data: {
                    type: GraphQLString,
                }
            },
            async resolve(obj, { child_data }) {
                const viewer = await User.createFrom(obj().viewer);
                return await viewer.addChild(child_data);
            }
        },
        //Child agree parent request and add some information (specific child data) to account
        agreeParentRequest: {
            type: GraphQLBoolean,
            args: {
                parent_id: {
                    type: GraphQLInt,
                },
                newData: {
                    type: UserInput
                }
            },
            async resolve(obj, { parent_id, newData }) {
                const viewer = await User.createFrom(obj().viewer);
                return await viewer.agreeParentRequest(parent_id, newData);
            }
        },
        removeChildRequest: {
            type: GraphQLBoolean,
            args: {
                request_id: {
                    type: GraphQLInt
                },
            },
            async resolve(obj, { request_id }) {
                const userChild = await UserChild.baseCreateFrom({id: request_id});
                return await userChild.removeRequest();
            }
        },
        //Parent create child account and automaticly add it to your children list
        createChild: {
            type: GraphQLBoolean,
            args: {
                child: {
                    type: UserInput
                }
            },
            async resolve(obj, { child }) {
                const viewer = await User.createFrom(obj().viewer);
                return viewer.createChild(child);
            }
        },
        //Parent remove child
        removeChild: {
            type: GraphQLBoolean,
            args: {
                child_id: {
                    type: GraphQLInt
                },
                removeAccount: {
                    type: GraphQLBoolean
                },
                comment: {
                    type: GraphQLString
                }
            },
            async resolve(obj, { child_id, removeAccount, comment }) {
                const viewer = await User.createFrom(obj().viewer);
                return viewer.removeChild(child_id, removeAccount, comment);
            }
        },
        //Admin confirm parent`s request to remove child
        confirmRemoveChild: {
            type: GraphQLBoolean,
            args: {
                link: {
                    type: GraphQLInt
                }
            },
            async resolve(obj, { link }) {
                const viewer = await User.createFrom(obj().viewer);
                return await viewer.confirmRemoveChild(link);
            }
        },

        editMainUserData: {
            type: GraphQLBoolean,
            args: {
                newData: {
                    type: UserInput
                },
                target_id: {
                    type: GraphQLInt
                }
            },
            async resolve(obj, { newData, target_id }) {
                const viewer = await User.createFrom(obj().viewer);
                return (await viewer.setMainDataOnEdit(newData, target_id)) !== false;
            }
        },
        editExtraUserData: {
            type: GraphQLBoolean,
            args: {
                newData: {
                    type: UserInput
                },
                target_id: {
                    type: GraphQLInt
                }
            },
            async resolve(obj, { newData, target_id }) {
                const viewer = await User.createFrom(obj().viewer);
                return (await viewer.setExtraDataOnEdit(newData, target_id, false, false)) !== false;
            }
        },

        confirmUserEditData: {
            type: GraphQLBoolean,
            args: {
                request_id: {
                    type: GraphQLInt
                }
            },
            async resolve(obj, { request_id }) {
                const viewer = await User.createFrom(obj().viewer);
                return await viewer.confirEditData(request_id)
            }
        }

        //If we need system which could make user`s token unrelaible.....
        // setUserOnConfirmation: {

        // }
    }
});
