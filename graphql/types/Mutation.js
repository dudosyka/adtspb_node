const {GraphQLObjectType, GraphQLString} = require("graphql");
const User = require("./EnityTypes/User");

module.exports = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        viewer: {
            type: User,
            async resolve(obj, data) {
                let user = await obj.user();
                console.log(user.id);
                return user;
            }
        },
    }
});