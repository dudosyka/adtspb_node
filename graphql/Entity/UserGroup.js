const baseEntity = require('./BaseEntity');
const AppConfig = require('../config/AppConfig');

let UserGroup = function () {}

UserGroup.prototype = Object.assign(UserGroup.prototype, baseEntity.prototype);

UserGroup.prototype.getInstance = () => UserGroup;

UserGroup.prototype.fields = {
    id: null,
};

UserGroup.prototype.table = "user_group";

UserGroup.prototype.execInsertQuery = async function (proposals, association_id, group_id) {
    let query = "";
    let ids = [];
    for (item of Object.keys(proposals)) {
        const proposal = proposals[item][0];
        if (proposal.association.id !== association_id)
            continue;
        query += "INSERT INTO `user_group` (`group_id`, `user_id`) VALUES (?, ?);";
        ids.push(group_id, proposal.child.id);
    }
    return await this.db.query(query, ids);
}

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

    await this.execInsertQuery(proposals, association_id, input.group_id);

    return true;
}

UserGroup.prototype.joinGroup = async function (input, groupModel, proposalModel) {
    if (!input.group_id)
        throw Error('Must provide `group_id` to `input` object');

    if (!input.proposals)
        throw Error('Must provide `proposals` to `input` object');

    const group = await groupModel.createFrom({ id: input.group_id });
    const association_id = group.__get('association_id');
    const proposals = await proposalModel.selectProposalsList('id', input.proposals, { child: true, association: true } );

    const group_size = await this.db.query('SELECT COUNT(`id`) as `count` FROM `user_group` WHERE `group_id` = ?', [ input.group_id ]).then(data => {
        return data[0].count;
    });

    if (group_size > 14) {
        throw Error('Group is full');
    }
    
    await this.execInsertQuery(proposals, association_id, input.group_id);
    return true;
}

module.exports = (new UserGroup());
