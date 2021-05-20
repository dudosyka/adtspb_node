const {GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLInt} = require("graphql");

const UserInput = require("../EntityTypes/InputTypes/User");
const User = require('../../Entity/User');
const SignUpOutput = require('../OutputTypes/SignUp');

const Jwt = require('../../utils/Jwt');
const jwt = new Jwt();

module.exports = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        login: {
            type: GraphQLString,
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

                return await jwt.sign({ id: id });
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
        }
    }
});
