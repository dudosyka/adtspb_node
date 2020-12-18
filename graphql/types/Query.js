const {GraphQLBoolean, GraphQLObjectType, GraphQLString, GraphQLID} = require("graphql");
const Db = require('../utils/Db');
const User = require('../Entity/User');
const UserType = require('./EntityTypes/User');
const Rbac = require('../utils/Rbac');

let db = new Db();
let rbac = new Rbac();

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
    },
});
