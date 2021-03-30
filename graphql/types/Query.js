const {GraphQLBoolean, GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt} = require("graphql");
const Db = require('../utils/Db');
const User = require('../Entity/User');
const UserType = require('./EntityTypes/User');
const Association = require('../Entity/Association');
const AssociationType = require('./EntityTypes/Association');
const Rbac = require('../utils/Rbac');
const Jwt = require('../utils/Jwt');

let db = new Db();
let rbac = new Rbac();
let jwt = new Jwt();

module.exports = new GraphQLObjectType({
    name: 'Query',
    fields: {
        user: {
            type: UserType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            async resolve(obj, { id }) {
                let user = await User.createFrom({id: id});
                return user.fields;
            }
        },
        association: {
            type: AssociationType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            async resolve(obj, { id }) {
                return (await Association.createFrom({id: id})).fields;
            }
        },
        validToken: {
            type: GraphQLBoolean,
            args: {
                token: {
                    type: GraphQLString
                }
            },
            async resolve(obj, { token }) {
              return (await jwt.parse(token) !== false);
            }
        },
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
