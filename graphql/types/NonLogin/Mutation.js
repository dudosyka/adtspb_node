const {GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLInt} = require("graphql");
const AppConfig = require('../../config/AppConfig');

const UserInput = require("../EntityTypes/User/Input");
const User = require('../../Entity/User');
const SignUpOutput = require('../EntityTypes/User/OutputTypes/SignUp');
const LoginOutput = require('../EntityTypes/User/OutputTypes/Login');
const EmailValidationOutput = require('../EntityTypes/EmailValidation/Output');

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
        }
    }
});
