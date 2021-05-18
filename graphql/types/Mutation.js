const {GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLInt} = require("graphql");

const UserType = require("./EntityTypes/User");
const UserInput = require("./EntityTypes/InputTypes/User");
const User = require('../Entity/User');

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
        viewer: {
            type: UserType,
            async resolve(obj, data) {
                const viewer = await User.baseCreateFrom(obj().viewer);
                return viewer.fields;
            }
        },
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
                return await EmailValidation.confirmUser(code, obj().viewer.id);
            }
        },
        generateNewConfirmationCode: {
                type: EmailValidationType,
                args: {},
                async resolve(obj, { }) {
                    return (await EmailValidation.setOnConfirmation(obj().viewer.id)).fields;
                }
        },
        // upgradeUser: {
        //     type: GraphQLBoolean,
        //     args: {
        //         data: {
        //             type: UserInput,
        //         }
        //     },
        //     async resolve(obj, { data }) {
        //         console.log(data);
        //         return true;
        //     }
        // },
        // addChild: {
        //     type: GraphQLBoolean,
        //     args: {
        //         child: {
        //             type: GraphQLInt
        //         }
        //     },
        //     async resolve(obj, { child }) {
        //         console.log(child);
        //         return true;
        //     }
        // },
        //If we need system which could make user`s token unrelaible.....
        // setUserOnConfirmation: {

        // }
    }
});
