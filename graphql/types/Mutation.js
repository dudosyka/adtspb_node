const {GraphQLObjectType, GraphQLString, GraphQLBoolean} = require("graphql");
const UserType = require("./EntityTypes/User");
const UserInput = require("./EntityTypes/InputTypes/User");
const User = require('../Entity/User');

const Rbac = require("../utils/Rbac");

const Db = require("../utils/Db");
const db = new Db();
const rbac = new Rbac();


const { client } = require('../utils/Redis');

module.exports = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        viewer: {
            type: UserType,
            async resolve(obj, data) {
                return obj().viewer.fields;
            }
        },
        createUser: {
            type: GraphQLString,
            args: {
                user: {
                    type: UserInput,
                }
            },
            async resolve(obj, { user }) {
                let check = await User.createFrom(user);
                console.log(check.fields);
                return check.createNew();
            }
        }
    }
});
