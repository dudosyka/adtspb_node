const baseEntity = require('./BaseEntity');
const AppConfig = require('../config/AppConfig');

let UserGroup = function () {}

UserGroup.prototype = Object.assign(UserGroup.prototype, baseEntity.prototype);

UserGroup.prototype.getInstance = () => UserGroup;

UserGroup.prototype.fields = {
    id: null,
};

UserGroup.prototype.table = "user_group";

UserGroup.prototype.editGroupStructure = async function (input, groupModel, proposal) {
    if (!input.group_id)
        throw Error('Must provide `group_id` to `input` object');

    if (!input.proposals)
        throw Error('Must provide `proposals` to `input` object');

    if (input.proposals.length > AppConfig.group_size)
        throw Error('Max group size: ' + AppConfig.group_size);

    const group = await groupModel.createFrom({ id: input.group_id });
    const association_id = group.__get('association_id');

    await this.db.query('DELETE FROM `user_group` WHERE `group_id` = ?;', [ input.group_id ]);
    const proposals = await proposal.selectProposalsList('id', input.proposals, { child: true, association: true });

    let query = "";
    let ids = [];
    for (item of Object.keys(proposals)) {
        const proposal = proposals[item][0];
        if (proposal.association.id !== association_id)
            continue;
        query += "INSERT INTO `user_group` (`group_id`, `user_id`) VALUES (?, ?);";
        ids.push(input.group_id, proposal.child.id);
    }
    await this.db.query(query, ids);

    return true;
}

module.exports = (new UserGroup());
