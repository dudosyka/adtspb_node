const graphql = require('graphql');

module.exports = new graphql.GraphQLObjectType({
    name: "EmailValidation",
    //Arrow func to prevent 'use before initialization' err
    fields: () => ({
        id: {
            type: graphql.GraphQLID,
        },
        user_id: {
            type: graphql.GraphQLString,
        },
        code: {
            type: graphql.GraphQLString,
        },
        timestamp: {
            type: graphql.GraphQLInt,
        },
        isConfirmed: {
            type: graphql.GraphQLBoolean,
            resolve(obj, {}) {
                return obj.code == null;
            }
        },
        token: {
            type: graphql.GraphQLString,
            resolve(obj, {}) {
                return (obj.code != null) ? "" : obj.token;
            }
        }
    })
});
