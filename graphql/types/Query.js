const {GraphQLBoolean, GraphQLObjectType, GraphQLString} = require("graphql");
const Db = require('../utils/Db');
const User = require('../Entity/User');

let db = new Db();

module.exports = new GraphQLObjectType({
    name: 'Query',
    fields: {
        get_mysql_user_host: {
            type: GraphQLString,
            args: {
                name: {
                    type: GraphQLString
                }
            },
            async resolve(obj, { name }) {
                const user = new User();
                return await db.select(user, "`User` = ?", [ name ])
                .then(data => {
                    if (data.length)
                        return data[0].fields.Host;
                    return null;
                }).catch(err => {
                    console.log(err);
                });
            }
        },
    },
});