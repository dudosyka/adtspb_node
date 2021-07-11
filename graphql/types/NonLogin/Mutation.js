const {GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLInt} = require("graphql");
const AppConfig = require('../../config/AppConfig');

const UserInput = require("../EntityTypes/InputTypes/User");
const User = require('../../Entity/User');
const SignUpOutput = require('../OutputTypes/SignUp');
const LoginOutput = require('../OutputTypes/Login');
const EmailValidationType = require('../EntityTypes/EmailValidation');


const Jwt = require('../../utils/Jwt');
const jwt = new Jwt();

module.exports = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        login: {
            type: LoginOutput,
            args: {
                login: {
                    type: GraphQLString
                },
                password: {
                    type: GraphQLString
                }
            },
            async resolve (obj, { login, password }) {
                const auth = await User.auth({ user: login, pass: password });
                if (auth.status !== true)
                    throw Error(auth.res);
                const id = auth.res.id
                const confirm = auth.confirm;
                return {
                    token: await jwt.sign({ id: id, confirm: confirm }),
                    id: id,
                    isConfirmed: confirm
                };
            }
        },
        createUser: {
            type: SignUpOutput,
            args: {
                user: {
                    type: UserInput,
                },
                makeParent: {
                    type: GraphQLBoolean
                }
            },
            async resolve(obj, { user, makeParent }) {
                const model = User.newModel();
                model.fields = {...user};

                let additionalRoles = [];
                if (makeParent)
                    additionalRoles.push(AppConfig.parent_role_id);
                else
                    additionalRoles.push(AppConfig.child_role_id);

                return model.createNew(additionalRoles);
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
                },
                user_id: {
                    type: GraphQLInt
                }
            },
            async resolve (obj, { code, user_id }) {
                const result = await EmailValidation.confirmUser(code, user_id);
                return result;
            }
        },
        // generateNewConfirmationCode: {
                // type: EmailValidationType,
                // args: {
                    // user_id: {
                        // type: GraphQLInt
                    // }
                // },
                // async resolve(obj, { user_id }) {
                    // return {}
                    // return (await EmailValidation.setOnConfirmation(user_id)).fields;
                // }
        // },
    }
});
