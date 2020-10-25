const Db = require('./Db');
const User = require('../Entity/User');

let db = new Db();

let Rbac = function ()
{

}

//TODO Написать триггер для перевода данных о правах в удобное для обработки представление
//
// Rbac.getAssignments = function (parent) {
//
// }
//
// Rbac.checkAssignments = function (assignments, child, parent)
// {
//     assignments.filter(el => {
//
//     });
// }
//
// Rbac.checkAccess = function (user_id, rule_id)
// {
//     return new Promise(async (resolve, reject) => {
//         const role = await (new User({
//             id: user_id
//         })).getRole();
//
//         const assignments = await db.query("SELECT * FROM `auth_assignment` WHERE `child` = ?", [ rule_id ]);
//
//         let parents = []
//         assignments.map(el => {
//             //If rule
//             if (el.type == 2)
//             {
//                 if (el.parent == role)
//                 {
//                     resolve(true);
//                 }
//             }
//             parents.push(el.parent);
//         });
//
//     });
// }

Rbac.checkAccess = async function (user_id, rule_id)
{
   return await db.query("SELECT * FROM `auth_assignment_min` WHERE `parent_id` = ? AND `child` = ?", [ user_id, rule_id ])
            .then(data => {
                console.log(data);
                return data.length > 0;
            })
            .catch(err => {
               console.error(err);
               return false;
            });
}
