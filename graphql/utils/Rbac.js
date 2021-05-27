const Db = require('./Db');

let db = new Db();

let Rbac = function ()
{

}

Rbac.prototype.getRoleAssignments = async function (res, assignment)
{
    let data = await db.query("SELECT * FROM `auth_assignment` WHERE `parent` = ?", [ assignment.child ]);
    for (let i = 0; i < data.length; i++)
    {
        let el = data[i];
        let _ = {
            parent: assignment.parent,
            child: el.child
        }
        if (el.type == 1)
        {
            let key = String(assignment.parent) + String(el.child);

            Object.assign(res, {[key]: _ });
        }
        else
        {
            res = await this.getRoleAssignments(res, _);
        }
    }
    return res;
}

async function createQuery (assignments)
{
    let query = "";
    let data = [];
    await Promise.all(
       Object.keys(assignments).map(el => {
           let assignment = assignments[el];
           query += "INSERT INTO `auth_assignment_min` (role, rule) VALUES (?, ?);";
           data.push(assignment.parent);
           data.push(assignment.child);
       })
    );
    return {
        query: query,
        data: data
    }
}

Rbac.prototype.minimize = async function ()
{
    let all_assignments = await db.query("SELECT * FROM `auth_assignment`");
    let res = {};
    for (let i = 0; i < all_assignments.length; i++)
    {
        let el = all_assignments[i];
        if (el.type == 1)
        {
            let key = String(el.parent) + String(el.child);
            Object.assign(res, {[key]: { parent: el.parent, child: el.child }});
        }
        else
        {
            res = await this.getRoleAssignments(res, el);
        }
    }
    let {query, data} = await createQuery(res);
    await db.query('DELETE FROM `auth_assignment_min` WHERE `id` != -1', []);
    return await db.query(query, data).catch(err => {
        console.error(err);
        return true;
    }).then(data => {
        return true;
    });
}

Rbac.prototype.auth = async function (user_id)
{

   //Get all roles
   let roles = await db.query('SELECT `auth_role_id` FROM `user_role` WHERE `user_id` = ?', [ user_id ]).then(data => data.map(el => el.auth_role_id));
   let rules = [];

   //Get rule for every role
   for (role in roles) {
       rules.push(await db.query("SELECT `rule` FROM `auth_assignment_min` WHERE `role` = ?", [ roles[role] ])
        .then(data => data.map(el => el.rule))
        .catch(err => {
           return false;
       }));
   }

   //Remove nested arrays
   let res = [];
   for (rule in rules) {
       res = res.concat(rules[rule], res);
   }

   //Get only unique rules
   rules = res.filter((value, index, self) => (self.indexOf(value) === index));

   //Return roles and rules
   return {
       role: roles,
       rules: rules
   };
}

Rbac.prototype.addItem = async function (name, description, role = false)
{
    let table = "auth_rule";
    if (role)
        table = "auth_role";

    let res = await db.query("INSERT INTO `"+ table + "` ( name, description ) VALUES ( ?, ? ) ", [ name, description ]);

    await this.minimize();

    return res.insertId;
}

Rbac.prototype.addRole = async function (name, description)
{
    return await this.addItem(name, description, true);
}

Rbac.prototype.addRule = async function (name, description)
{
    return await this.addItem(name, description);
}

Rbac.prototype.assign = async function (parent, child, roleToRule = true)
{
    let issetParent = await db.query('SELECT * FROM `auth_role` WHERE `id` = ?', [ parent ]).then( data => { if (data.length) return true; else return false; } );
    let table = "auth_rule";

    if (!roleToRule)
        table = "auth_role";
    let issetChild = await db.query('SELECT * FROM `'+ table +'` WHERE `id` = ?', [ child ]).then( data => { if (data.length) return true; else return false; } );

    if (!issetParent || !issetChild)
        return false;

    await db.query("INSERT INTO `auth_assignment` ( parent, child, type ) VALUES ( ?, ?, ? )", [ parent, child, (roleToRule) ? 1 : 2 ]);

    await this.minimize();
}

Rbac.prototype.removeItem = async function (id, role = false)
{
    if (role)
    {
        await db.query("DELETE FROM `auth_assignment` WHERE `parent` = ? OR (`child` = ? AND `type` = ?)", [ id, id, 2 ]);
        await db.query("DELETE FROM `auth_role` WHERE `id` = ?", [ id ]);
    }
    else
    {
        await db.query("DELETE FROM `auth_assignment` WHERE `child` = ? AND `type` = ?", [ id, 1 ]);
        await db.query("DELETE FROM `auth_rule` WHERE `id` = ?", [ id ]);
    }

    await this.minimize();
}

Rbac.prototype.removeRole = async function (id)
{
    return await this.removeItem(id, true);
}

Rbac.prototype.removeRule = async function (id)
{
    return await this.removeItem(id, false);
}

Rbac.prototype.addRoleToUser = async function (user_id, role_id)
{
    let res = await db.query('INSERT INTO `user_role` (`user_id`, `auth_role_id`) VALUES (?, ?)', [ user_id, role_id ]);
    if (res === null)
        return false;
    return true;
}

Rbac.prototype.hasAccess = async function (role, rule) {
    const res = await db.query('SELECT * FROM `auth_assignment_min` WHERE `role` = ? AND `rule` = ?', [ role, rule ]);
    return res.length;
}

module.exports = Rbac;
