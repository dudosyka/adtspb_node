const graphql = require("graphql");
const Proposal = require("../../../Entity/Proposal");
const Association = require("../../../Entity/Association");
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
                return await Association.getAssociations(null, obj.selections, model);
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
    })
});

//Moved here to prevent from circular dependence err.
const AssociationOutput = require("./Output");
