const {GraphQLBoolean, GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt} = require("graphql");
const User = require('../../Entity/User');

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
