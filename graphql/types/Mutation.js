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
            type: GraphQLString,
            async resolve(obj, data) {
                return "user";
            }
        },
    }
});