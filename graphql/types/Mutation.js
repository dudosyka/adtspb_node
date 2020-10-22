const {GraphQLObjectType, GraphQLString} = require("graphql");
const UserType = require("./EntityTypes/User");
const User = require('../Entity/User');
const Db = require("../utils/Db");
const db = new Db();

module.exports = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        viewer: {
            type: GraphQLString,
            async resolve(obj, data) {
                return "user";
            }
        },
    }
});