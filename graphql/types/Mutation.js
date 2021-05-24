const {GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLInt} = require("graphql");

const UserType = require("./EntityTypes/User");
const UserInput = require("./EntityTypes/InputTypes/User");
const User = require('../Entity/User');
const UserExtraData = require('../Entity/UserExtraData');

const ProposalType = require('./EntityTypes/Proposal');
const ProposalInput = require('./EntityTypes/InputTypes/Proposal');
const Proposal = require('../Entity/Proposal');

const EmailValidation = require('../Entity/EmailValidation');
const EmailValidationType = require('./EntityTypes/EmailValidation');

const Rbac = require("../utils/Rbac");
const rbac = new Rbac();

const Db = require("../utils/Db");
const db = new Db();

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
            // type: ProposalType,
            type: GraphQLBoolean,
            args: {
                proposal: {
                    type: ProposalInput
                }
            },
            async resolve(obj, { proposal }) {
                let model = await Proposal.createFromInput(proposal);
                return model.createNew();
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
                // console.log(viewer.__get('id'));
                const result = await EmailValidation.confirmUser(code, obj().viewer.id);
                console.log(result);
                return result;
            }
        },
        generateNewConfirmationCode: {
                type: EmailValidationType,
                args: {},
                async resolve(obj, { }) {
                    return (await EmailValidation.setOnConfirmation(obj().viewer.id)).fields;
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
                child: {
                    type: GraphQLInt,
                }
            },
            async resolve(obj, { child }) {
                const viewer = await User.createFrom(obj().viewer);
                return await viewer.addChild(child);
            }
        },
        //Child agree parent request and add some information (specific child data) to account
        agreeParentRequest: {
            type: GraphQLBoolean,
            args: {
                request_id: {
                    type: GraphQLInt,
                },
                newData: {
                    type: UserInput
                }
            },
            async resolve(obj, { request_id, newData }) {
                const viewer = await User.baseCreateFrom(obj().viewer);
                // console.log('FIELDS', viewer.fields);
                // console.log('Input', newData);
                return await viewer.agreeParentRequest(request_id, newData);
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
                const viewer = await User.createFrom({id: obj().viewer.id});
                return viewer.createChild(child);
            }
        },
        //If we need system which could make user`s token unrelaible.....
        // setUserOnConfirmation: {

        // }
    }
});
