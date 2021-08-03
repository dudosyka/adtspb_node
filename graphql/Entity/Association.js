const baseEntity = require('./BaseEntity');
const Group = require('./Group');

let Association = function () {}

Association.prototype = Object.assign(Association.prototype, baseEntity.prototype);

Association.prototype.table = "association";

Association.prototype.getInstance = () => Association;

Association.prototype.fields = {
    id: null,
};

Association.prototype.getAssociations = async function (age = null, selections = {}, model = null) {
    const whereQuery = (age == null) ? "" : "WHERE `join`.`max_age` >= ? AND `join`.min_age <= ?";
    const data = (age == null) ? [] : [ age, age ];

    fullQuery = "SELECT `main`.*, `join`.* FROM `association` as `main` LEFT JOIN `association_extra_data` as `join` ON `main`.`id` = `join`.`association_id` " + whereQuery;

    const res = await this.db.query(fullQuery, data);
    const ids = res.map(el => el.association_id);

    if (ids.length <= 0)
        return [];

    let groups = null;
    if (selections.groups) {
        const model = Group.newModel();
        groups = await model.getAssociationGroups(ids, selections.groups);
    }

    let proposals = null;
    if (selections.isRecruiment || selections.proposals) {
        console.log(selections.isRecruiment);
        if (selections.isRecruiment)
            proposals = await model.selectProposalsList('association_id', ids, {status: true});
        else
            proposals = await model.selectProposalsList('association_id', ids, {});
    }

    let associations = [];
    res.map(el => {
        el.id = el.association_id;
        delete el.association_id;
        const association = {
            ...el,
            groups: groups === null ? [] : groups[el.id],
            proposals: proposals === null ? [] : proposals[el.id]
        };
        associations.push(association);
    });

    return associations;
}

Association.prototype.setSelected = async function (associations, parent, child) {
    if (!parent.hasAccess(13))
        throw Error('Forbidden');

    const userModel = parent.newModel();
    await userModel.baseCreateFrom({id: child});

    const relation = await this.db.query('SELECT * FROM `user_child` WHERE `child_id` = ? AND `parent_id` = ?', [ child, parent.__get('id') ]);

    if (relation.length <= 0)
        throw Error('Forbidden');

    if (userModel.__get('name') == null)
        throw Error('Child not found');

    await this.db.query('DELETE FROM `selected_associations` WHERE `child_id` = ?', child);
    let query = "INSERT INTO `selected_associations` (`association_id`, `child_id`) VALUES ";
    let values = [];
    let data = [];
    associations.map(association_id => {
        values.push("(?,?) ");
        data.push(association_id, child);
    });
    query += values.join(",");
    this.db.query(query, data);
    return true;
}

Association.prototype.getSelected = async function (parent, child, userModel) {
    await userModel.baseCreateFrom({id: child});

    if (userModel.__get('name') == null)
        throw Error('Child not found');

    const relation = await this.db.query('SELECT * FROM `user_child` WHERE `child_id` = ? AND `parent_id` = ?', [ child, parent ]);

    if (relation.length <= 0)
        throw Error('Forbidden');

    return (await this.db.query('SELECT `association_id` FROM `selected_associations` WHERE `child_id` = ?', [ child ])).map(selected => selected.association_id);
}

module.exports = (new Association());
