const baseEntity = require('./BaseEntity');
const Timetable = require('./Timetable');
const UserGroup = require('./UserGroup');

let Group = function () {}

Group.prototype = Object.assign(Group.prototype, baseEntity.prototype);

Group.prototype.getInstance = () => Group;

Group.prototype.fields = {
    id: null,
};

Group.prototype.table = "group";

Group.prototype.getAssociationGroups = async function (association_ids, selections, userModel, proposalModel) {
    const { ids, query } = this.db.createRangeQuery(false, association_ids, '`association_id`');

    const res = await this.db.query("SELECT * FROM `group` as `main` WHERE " + query, ids);
    const groups_id = res.map(el => el.id);

    let timetables = {};
    if (selections.timetable) {
        const timetable = Timetable.newModel();
        timetables = await timetable.getByGroup(groups_id, selections.timetable);
    }

    let students = {};
    if (selections.students) {
        const userGroup = UserGroup.newModel();
        // const students_ids = await userGroup.getStructure(groups_id);
        const students_ids = await userGroup.getStudentsDocumentTaken(groups_id, proposalModel);

        for (id of Object.keys(students_ids)) {
            const rangeQuery = this.db.createRangeQuery(false, students_ids[id].map(el => el.user_id), '`main`.`id`');
            students[id] = await userModel.getFullData(false, selections.students, null, null, false, rangeQuery.query, rangeQuery.ids);
        }
    }

    let groups = {};
    res.map(group => {
        group.timetable = timetables[group.id] !== undefined ? timetables[group.id][0] : {};
        group.students = students[group.id] == undefined ? [] : students[group.id];

        if (groups[group.association_id]) {
            groups[group.association_id].push(group);
        }
        else {
            groups[group.association_id] = [ group ];
        }
    });

    return groups;
}

Group.prototype.newFromInput = async function (input, extraData) {
    this.load(input);
    const res = await this.save();
    if (res === false) {
        throw Error(JSON.stringify(await this.validate()));
    }

    const data = await this.db.query('SELECT `association_id` FROM `group` as `main` WHERE `id` = ?', [ res.insertId ]);

    await extraData.groupCreated(data[0].association_id);

    if (!input.timetable) {
        input.timetable = {};
    }
    const timetable = Timetable.newModel();
    input.timetable.group_id = res.insertId;
    input.timetable.association_id = input.association_id;
    await timetable.newFromInput(input.timetable);

    return res.insertId;
}

Group.prototype.edit = async function (newValue, logger, admin_id, extraData) {
    if (!newValue.id)
        throw Error('Must provide `id` field into `input`');

    const id = newValue.id;
    delete newValue.id;

    if (newValue.timetable) {
        const timetableData = newValue.timetable;
        const timetable = Timetable.newModel();
        await timetable.edit(timetableData, logger, admin_id).catch(err => {
            throw err;
        });
        delete newValue.timetable;
    }

    const model = this.newModel();
    const oldValue = await this.db.query("SELECT * FROM `group` as `main` WHERE `main`.`id` = ?", [ Number(id) ]);
    model.load(oldValue[0]);

    if (newValue.closed == 1) {
        await extraData.groupClosed(oldValue[0].association_id);
    }

    return await logger.logModel(model, newValue, admin_id, id).then(res => {
        model.load(newValue);
        model.update();
    });
}

module.exports = (new Group());
