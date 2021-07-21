const graphql = require('graphql');
const Admin = require('../../Entity/Admin');
const admin = new Admin();

const User = require('../../Entity/User');

module.exports = new graphql.GraphQLObjectType({
    name: "AdminQuery",
    fields: () => ({
        stat: {
            type: StatOutput,
            args: {},
            async resolve(obj) {
                const user = await User.createFrom({id: obj.viewer.id}, false, false);
                if (!user.hasAccess(15))
                    throw Error('Forbidden');
                return await admin.getStat();
            }
        }
    }),
});

const StatOutput = require('./StatOutput');
