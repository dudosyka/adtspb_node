const {GraphQLObjectType, GraphQLString} = require("graphql");
const UserType = require("./EntityTypes/User");
const User = require('../Entity/User');

const Db = require("../utils/Db");
const db = new Db();

const { client } = require('../utils/Redis');

module.exports = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        viewer: {
            type: UserType,
            async resolve(obj, data) {
                let res = await db.query('SELECT * FROM `user_group`', [ ]);
                console.log(res);

                res = await db.query("INSERT INTO `association` (name, description) VALUES (?, ?)", [ 'name', 'description' ]);
                console.log(res);

                return {id: 1};
            }
        },
    }
});
