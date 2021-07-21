const graphql = require("graphql");
const Association = require("../../../Entity/Association");
const User = require("../../../Entity/User");
const AppConfig = require('../../../config/AppConfig');

module.exports = new graphql.GraphQLObjectType({
    name: "AssociationMutation",
    fields: () => ({
        setSelected: {
            type: graphql.GraphQLBoolean,
            args: {
                associations: {
                    type: ListOfInt
                },
                child: {
                    type: graphql.GraphQLInt
                }
            },
            async resolve(obj, { associations, child }) {
                console.log(obj);
                const parent = await User.createFrom({id: obj.viewer.id}, false, false);
                return await Association.setSelected(associations.list, parent, child);
            }
        }
    }),
});

const AssociationInput = require('./Input');
const ListOfInt = require('../../ListOfInt');
