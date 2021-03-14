const {GraphQLBoolean, GraphQLObjectType, GraphQLString, GraphQLID} = require("graphql");
const Db = require('../utils/Db');
const User = require('../Entity/User');
const UserType = require('./EntityTypes/User');
const Rbac = require('../utils/Rbac');
const Jwt = require('../utils/Jwt');

let db = new Db();
let rbac = new Rbac();
let jwt = new Jwt();

module.exports = new GraphQLObjectType({
    name: 'Query',
    fields: {
        get_user_by_id: {
            type: UserType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            async resolve(obj, { id }) {
                return await db.select(User, "`id` = ?", [ id ])
                .then(data => {
                    if (data === null)
                        return [];
                    if (data.length)
                        return data[0];
                    return null;
                }).catch(err => {
                    console.log(err);
                });
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
        }
    },
});
