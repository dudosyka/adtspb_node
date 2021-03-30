const {GraphQLObjectType, GraphQLString, GraphQLBoolean} = require("graphql");

const UserType = require("./EntityTypes/User");
const UserInput = require("./EntityTypes/InputTypes/User");
const User = require('../Entity/User');

const ProposalType = require('./EntityTypes/Proposal');
const ProposalInput = require('./EntityTypes/InputTypes/Proposal');
const Proposal = require('../Entity/Proposal');

const Rbac = require("../utils/Rbac");
const rbac = new Rbac();

const Db = require("../utils/Db");
const db = new Db();

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
                let usr = await User.createFrom(user);
                return usr.createNew();
            }
        },
        createProposal: {
            // type: ProposalType,
            type: GraphQLBoolean,
            args: {
                proposal: {
                    type: ProposalInput
                }
            },
            async resolve(obj, { proposal }) {
                let model = await Proposal.createFromInput(proposal);
                return model.createNew();
            }
        }
    }
});
