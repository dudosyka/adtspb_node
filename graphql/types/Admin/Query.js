const graphql = require('graphql');
const Admin = require('../../Entity/Admin');
const admin = new Admin();

module.exports = new graphql.GraphQLObjectType({
    name: "AdminQuery",
    fields: () => ({
        stat: {
            type: StatOutput,
            args: {},
            async resolve(obj) {
                return await admin.getStat();
            }
        }
    }),
});

const StatOutput = require('./StatOutput');
