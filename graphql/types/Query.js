const {GraphQLBoolean, GraphQLObjectType, GraphQLString} = require("graphql");
const Db = require('../database/Db');

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
                return await db.query("SELECT * FROM mysql.user WHERE `User` = ?", [ name ])
                .then(data => {
                    return data[0].Host;
                }).catch(err => {
                    console.log(err);
                });
            }
        },
    },
});