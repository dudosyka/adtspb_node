const Db = require('../graphql/utils/Db');
const db = new Db();

const Association = require('./Entity/Association');
const User = require('./Entity/User');
const Proposal = require('./Entity/Proposal');
const Group = require('./Entity/Group');

const proposal = Proposal.newModel();
const association = Association.newModel();
const user = User.newModel();
const group = Group.newModel();

const UserGroup = require('./Entity/UserGroup');
const userGroup = UserGroup.newModel();

(async function () {
    const proposals = await db.query("select `id`, `child_id`, `association_id`, `group_selected` from `proposal` where `group_selected` != 0");

    const userGroupData = await db.query('select `main`.`user_id` as `child_id`, `sub`.`id` as `association_id`, `group_main`.`id` as `group_id` from `user_group` as `main` left join `group` as `group_main` on `main`.`group_id` = `group_main`.`id` left join `association` as `sub` on `sub`.`id` = `group_main`.`association_id`');

    let groups = {};
    userGroupData.map(el => {
        if (groups[el.group_id]) {
            groups[el.group_id][el.child_id] = true;
        }
        else {
            groups[el.group_id] = {
                [el.child_id]: true
            };
        }
    });

    for (let el of proposals) {
        if (groups[el.group_selected]) {
            if (groups[el.group_selected][el.child_id]) {
                //good
            }
            else {
                await db.query('insert into `user_group` (`group_id`, `user_id`) VALUES (?, ?)', [ el.group_selected, el.child_id ]);
            }
        }
        else {
            await db.query('insert into `user_group` (`group_id`, `user_id`) VALUES (?, ?)', [ el.group_selected, el.child_id ]);
        }
    }

    // const dublicates = await db.query('SELECT id, user_id, group_id, COUNT(*) FROM user_group GROUP BY user_id, group_id HAVING COUNT(*) > 1');
    // for (let el of dublicates) {
    //     await db.query('delete from `user_group` where `id` = ?', [ el.id ]);
    // }

})();

// {
//     association_id: {
//         group_1_id: [child, child, child],
//         group_2_id: [child, child, child]
//     }
// }
