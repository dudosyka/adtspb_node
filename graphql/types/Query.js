const { GraphQLObjectType, GraphQLBoolean, GraphQLString, GraphQLID, GraphQLInt } = require("graphql");
const graphql = require('graphql');

const Db = require('../utils/Db');

const User = require('../Entity/User');
const UserType = require('./EntityTypes/User');
const UserExtraData = require('../Entity/UserExtraData');
const UserFullDataType = require('./OutputTypes/UserFullData');

const UserChild = require('../Entity/UserChild');

const Association = require('../Entity/Association');
const AssociationType = require('./EntityTypes/Association');

const EmailValidation = require('../Entity/EmailValidation');
const EmailValidationType = require('./EntityTypes/EmailValidation');

const Proposal = require('../Entity/Proposal');
const ProposalType = require('./EntityTypes/Proposal');
const ProposalInput = require('./EntityTypes/InputTypes/Proposal');

const Rbac = require('../utils/Rbac');
const Jwt = require('../utils/Jwt');

const Timetable = require('../Entity/Timetable');
const TimetableType = require('./EntityTypes/Timetable');

const fs = require('fs');

let db = new Db();
let rbac = new Rbac();
let jwt = new Jwt();

module.exports = new GraphQLObjectType({
    name: 'Query',
    fields: {
        viewer: {
            type: UserType,
            async resolve(obj, data) {
                let viewer = await User.createFrom(obj().viewer);
                viewer.fields.rules = viewer.__get('__accessible');
                console.log(viewer.fields);
                return viewer.fields;
            }
        },
        user: {
            type: UserType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            async resolve(obj, { id }) {
                let user = await User.createFrom({id: id});
                return user.fields;
            }
        },
        association: {
            type: AssociationType,
            args: {
                id: {
                    type: GraphQLID
                }
            },
            async resolve(obj, { id }) {
                return (await Association.createFrom({id: id})).fields;
            }
        },
        validToken: {
            type: GraphQLBoolean,
            args: {
                token: {
                    type: GraphQLString
                }
            },
            async resolve(obj, { token }) {
              return (await jwt.parse(token) !== false);
            }
        },
        restorePasswordRequest: {
            type: GraphQLBoolean,
            args: {
                email: {
                    type: GraphQLString
                }
            },
            async resolve(obj, { email }) {
                return await User.restorePasswordRequest(email);
            }
        },
        checkRestoreCode: {
            type: GraphQLBoolean,
            args: {
                email: {
                    type: GraphQLString
                },
                code: {
                    type: GraphQLInt
                }
            },
            async resolve(obj, { email, code }) {
                return User.checkRestoreCode(email, code);
            }
        },
        checkUserConfirmation: {
            type: EmailValidationType,
            args: {},
            async resolve(obj, {}) {
                const viewer = await User.createFrom(obj().viewer);
                // console.log(viewer.__get('id'));
                return viewer.__get('isConfirmed').fields;
            }
        },
        //Check what data need to be child
        checkChildData: {
            type: GraphQLString,
            args: {},
            async resolve(obj, {  }) {
                const userData = await UserExtraData.createFrom({ user_id: obj().viewer.id });
                const res = userData.checkChildData();
                if (res !== true)
                    return JSON.stringify(res);
                else
                    return "success";
            }
        },
        getChildren: {
            type: graphql.GraphQLList(UserFullDataType),
            args: {},
            async resolve(obj, {}) {
                const userChild = await UserChild.baseCreateFrom({ parent_id: obj().viewer.id });
                const children = await userChild.getChildren(true, 1);
                return children;
            }
        },
        getFullUserData: {
            type: UserFullDataType,
            args: {},
            async resolve(obj, {}) {
                return User.getFullData(obj().viewer.id);
            }
        },
        getChildRequests: {
            type: graphql.GraphQLList(UserType),
            args: {},
            async resolve(obj, {}) {
                const userChild = await UserChild.baseCreateFrom({ parent_id: obj().viewer.id });
                return await userChild.getChildRequests();
            }
        },
        getParentRequests: {
            type: graphql.GraphQLList(UserType),
            args: {},
            async resolve(obj, {}) {
                const userChild = await UserChild.baseCreateFrom({ child_id: obj().viewer.id });
                return await userChild.getParentRequests();
            }
        },
        getAssociations: {
            type: graphql.GraphQLList(AssociationType),
            args: {
            },
            async resolve(obj, {  }) {
                return await Association.getAssociations();
            }
        },
        getAssociationsForChild: {
            type: graphql.GraphQLList(AssociationType),
            args: {
                child_id: {
                    type: GraphQLInt
                }
            },
            async resolve(obj, { child_id }) {
                const usr = await UserExtraData.createFrom({user_id: child_id});
                return await Association.getAssociations(usr.calculateAge());
            }
        },
        getAssociationTimetable: {
            type: graphql.GraphQLList(TimetableType),
            args: {
                association_id: {
                    type: graphql.GraphQLInt
                }
            },
            async resolve(obj, data) {
                const timetable = Timetable.createFrom(data);
                return timetable.map(el => el.fields);
            }
        },
        getChildProposals: {
            type: graphql.GraphQLList(ProposalType),
            args: {
                child_id: {
                    type: GraphQLInt
                }
            },
            async resolve(obj, { child_id }) {
                return await Proposal.selectByChild(child_id);
            }
        },
        getChildStudyLoad: {
            type: graphql.GraphQLList(AssociationType),
            args: {
                child_id: {
                    type: GraphQLInt
                }
            },
            async resolve(obj, { child_id }) {
                //TODO: Select associations where proposal status is `enlisted`
            }
        },
        canJoinAssociation: {
            type: graphql.GraphQLBoolean,
            args: {
                data: {
                    type: ProposalInput
                }
            },
            async resolve(obj, { data }) {
                data.parent = {id: obj().viewer.id};
                const proposal = await Proposal.createFromInput(data);
                const canJoin = await proposal.canJoinAssociation();
                return canJoin;
            }
        },
        generateProposalPdf: {
            type: GraphQLString,
            args: {
                proposal: {
                    type: ProposalInput
                }
            },
            async resolve(obj, { proposal }) {
                const proposalEntity = await Proposal.createFromInput(proposal);
                if (proposalEntity.__get('association_id') == null)
                    throw Error('Proposal not found');

                const buffer = await proposalEntity.generatePdf();
                return buffer.toString("base64");
            }
        }

    },
});
