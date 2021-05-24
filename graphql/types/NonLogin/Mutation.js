const {GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLInt} = require("graphql");

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
                const res = await User.auth({ user: login, pass: password });
                const id = res.id;

                return {
                    token: await jwt.sign({ id: id }),
                    id: id,
                };
            }
        },
        createUser: {
            type: SignUpOutput,
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
                // console.log(viewer.__get('id'));
                const result = await EmailValidation.confirmUser(code, user_id);
                console.log(result);
                return result;
            }
        },
        generateNewConfirmationCode: {
                type: EmailValidationType,
                args: {
                    user_id: {
                        type: GraphQLInt
                    }
                },
                async resolve(obj, { user_id }) {
                    return (await EmailValidation.setOnConfirmation(user_id)).fields;
                }
        },
    }
});
