const {GraphQLBoolean, GraphQLObjectType, GraphQLString} = require("graphql");

module.exports = new GraphQLObjectType({
    name: 'Query',
    fields: {
        field: {
            type: GraphQLString,
            args: {
                input: {
                    type: GraphQLBoolean
                }
            },
            resolve(obj, {input}) {
                console.log(obj);
                console.log(input);
                return true;
            }
        },
    },
});