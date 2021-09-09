const graphql = require('graphql');

const AccessControl = require('../../Entity/AccessControl');
const accessControl = new AccessControl();

const Rbac = require('../../utils/Rbac');
const rbac = new Rbac();

module.exports = new graphql.GraphQLObjectType({
    name: "AccessControlMutation",
    fields: () => ({
        add_role_to_user: {
            type: graphql.GraphQLBoolean,
            args: {
                user_role: {
                    type: UserRole
                }
            },
            async resolve(obj, { user_role }) {
                if (!obj.adminModel.hasAccess(35)) //User-role editing
                    throw Error('Forbidden');

                await rbac.addRoleToUser(user_role.user_id, user_role.role_id).catch(err => {
                    if (err.code) {
                        if (err.code == "ER_DUP_ENTRY")
                            throw Error('Role had already been added');
                    }
                });
                return true;
            }
        },
        delete_role_from_user: {
            type: graphql.GraphQLBoolean,
            args: {
                user_role: {
                    type: UserRole
                }
            },
            async resolve(obj, { user_role }) {
                if (!obj.adminModel.hasAccess(35)) //User-role editing
                    throw Error('Forbidden');

                await rbac.deleteRoleFromUser(user_role.user_id, user_role.role_id);
                return true;
            }
        },
        add_rules_to_role: {
            type: graphql.GraphQLBoolean,
            args: {
                input: {
                    type: RoleInput
                }
            },
            async resolve(obj, {input}) {
                if (!obj.adminModel.hasAccess(34)) //Roles editing
                    throw Error('Forbidden');

                await accessControl.assign(input.id, input.rules.map(el => el.id));
                return true;
            }
        },
        delete_rules_from_role: {
            type: graphql.GraphQLBoolean,
            args: {
                input: {
                    type: RoleInput
                }
            },
            async resolve(obj, {input}) {
                if (!obj.adminModel.hasAccess(34)) //Roles editing
                    throw Error('Forbidden');

                await accessControl.deleteAssign(input.id, input.rules.map(el => el.id));
                return true;
            }
        },
        add_child_role: {
            type: graphql.GraphQLBoolean,
            args: {
                parent_role: {
                    type: graphql.GraphQLInt
                },
                child_role: {
                    type: graphql.GraphQLInt
                }
            },
            async resolve(obj, { parent_role, child_role }) {
                if (!obj.adminModel.hasAccess(34)) //Roles editing
                    throw Error('Forbidden');

                await accessControl.assignRoles(parent_role, child_role);
                return true;
            }
        },
        delete_child_role: {
            type: graphql.GraphQLBoolean,
            args: {
                parent_role: {
                    type: graphql.GraphQLInt
                },
                child_role: {
                    type: graphql.GraphQLInt
                }
            },
            async resolve(obj, { parent_role, child_role }) {
                if (!obj.adminModel.hasAccess(34)) //Roles editing
                    throw Error('Forbidden');

                await accessControl.deleteRolesAssign(parent_role, child_role);
                return true;
            }
        },
        create_role: {
            type: graphql.GraphQLBoolean,
            args: {
                input: {
                    type: RoleInput
                }
            },
            async resolve(obj, {input}) {
                if (!obj.adminModel.hasAccess(33)) //Managing roles
                    throw Error('Forbidden');

                await accessControl.createRole(input);
                return true;
            }
        },
        delete_role: {
            type: graphql.GraphQLBoolean,
            args: {
                role: {
                    type: graphql.GraphQLInt
                }
            },
            async resolve(obj, {role}) {
                if (!obj.adminModel.hasAccess(33)) //Managing roles
                    throw Error('Forbidden');

                await accessControl.deleteRole(role);
                return true;
            }
        }
    }),
});

const UserRole = require('./Input/UserRole');
const RoleInput = require('./Input/Role');
