const graphql = require("graphql");
const Proposal = require("../../../Entity/Proposal");
const Association = require("../../../Entity/Association");
const User = require("../../../Entity/User");
const UserExtraData = require("../../../Entity/UserExtraData");
const AppConfig = require('../../../config/AppConfig');

module.exports = new graphql.GraphQLObjectType({
    name: "AssociationQuery",
    //Arrow func to prevent 'use before initialization' err
    fields: () => ({
        getAll: {
            type: graphql.GraphQLList(AssociationOutput),
            args: {
            },
            async resolve(obj, {  }) {
                const model = Proposal.newModel();
                const associations = await Association.getAssociations(null, obj.selections, model);
                console.log(associations[0].proposals[0])
                return associations;
            }
        },
        getForChild: {
            type: graphql.GraphQLList(AssociationOutput),
            args: {
                child_id: {
                    type: graphql.GraphQLInt
                }
            },
            async resolve(obj, { child_id }) {
                const usr = await UserExtraData.createFrom({user_id: child_id});
                const model = Proposal.newModel();
                return await Association.getAssociations(usr.calculateAge(), obj.selections, model);
            }
        },
        getSelected: {
            type: graphql.GraphQLList(graphql.GraphQLInt),
            args: {
                child: {
                    type: graphql.GraphQLInt
                }
            },
            async resolve(obj, { child }) {
                const userModel = User.newModel();
                return await Association.getSelected(obj.viewer.id, child, userModel)
            }
        }
    })
});

//Moved here to prevent from circular dependence err.
const AssociationOutput = require("./Output");
