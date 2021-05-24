const {GraphQLBoolean, GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt} = require("graphql");
const User = require('../../Entity/User');
const EmailValidationType = require('../EntityTypes/EmailValidation');

module.exports = new GraphQLObjectType({
    name: 'Query',
    fields: {
        restorePasswordRequest: {
            type: GraphQLBoolean,
            args: {
                email: {
                    type: GraphQLString
                }
            },
            async resolve(obj, { email }) {
                return await User.restorePasswordRequest(email);
            }
        },
        checkUserConfirmation: {
            type: EmailValidationType,
            args: {
                user_id: {
                    type: GraphQLInt
                }
            },
            async resolve(obj, { user_id }) {
                const viewer = await User.createFrom( user_id );
                // console.log(viewer.__get('id'));
                return viewer.__get('isConfirmed').fields;
            }
        },
        checkRestoreCode: {
            type: GraphQLBoolean,
            args: {
                email: {
                    type: GraphQLString
                },
                code: {
                    type: GraphQLInt
                }
            },
            async resolve(obj, { email, code }) {
                return User.checkRestoreCode(email, code);
            }
        }
    },
});
