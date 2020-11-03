const {GraphQLBoolean, GraphQLObjectType, GraphQLString, GraphQLID} = require("graphql");
const Db = require('../utils/Db');
const User = require('../Entity/User');
const UserType = require('./EntityTypes/User');

let db = new Db();

module.exports = new GraphQLObjectType({
    name: 'Query',
    fields: {
        get_user_by_id: {
            type: GraphQLString,
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
