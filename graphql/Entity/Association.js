const baseEntity = require('./BaseEntity');
const Group = require('./Group');

let Association = function () {}

Association.prototype = Object.assign(Association.prototype, baseEntity.prototype);

Association.prototype.table = "association";

Association.prototype.getInstance = () => Association;

Association.prototype.validateRules = async function () {
    return [
        this.validator(['name', 'description'], 'Can`t be empty.').notNull(),
        this.validator(['name'], 'Invalid format').len(1, 200),
        this.validator(['description'], 'Invalid format').len(1, 10000),
    ];
}

Association.prototype.fields = {
    id: null,
    name: null,
    description: null,
};

Association.prototype.getAssociations = async function (age = null, selections = {}, model = null, where = null, whereData = null) {
    let whereQuery = (age == null) ? "" : "WHERE `join`.`max_age` >= ? AND `join`.min_age <= ?";
    let data = (age == null) ? [] : [ age, age ];

    if (where != null) {
        whereQuery = where;
        data = whereData;
    }

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

Association.prototype.newFromInput = async function (input, extraModel) {
    this.load(input);
    const res = await this.save();
    if (res === false) {
        throw Error(JSON.stringify(await this.validate()));
    }
    console.log(input);
    input.association_id = res.insertId;
    extraModel.load(input);
    await extraModel.save();
    return input.association_id;
}

Association.prototype.edit = async function (newValue, logger, extraModel, admin_id) {
    if (!newValue.id)
        throw Error('Must provide `id` field into `input`');

    const id = newValue.id;
    delete newValue.id;

    const model = this.newModel();
    const oldData = await model.getAssociations(null, {}, null, "WHERE `main`.`id` = ?", [ Number(id) ]);
    model.load(oldData[0]);

    return await logger.logModel(model, newValue, admin_id, id).then(res => {
        model.load(newValue);
        model.update();
        extraModel.load(newValue);
        extraModel.fields.association_id = model.__get('id');
        extraModel.update(false, "association_id");
    });
}

module.exports = (new Association());
