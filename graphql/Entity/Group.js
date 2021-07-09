const baseEntity = require('./BaseEntity');

let Group = function () {}

Group.prototype = Object.assign(Group.prototype, baseEntity.prototype);

Group.prototype.getInstance = () => Group;

Group.prototype.fields = {
    id: null,
};

Group.prototype.table = "group";

Group.prototype.getAssociationGroups = async function (association_ids, selections) {
    const { ids, query } = this.db.createRangeQuery(false, association_ids, 'association_id');

    let sub1Query = "";
    if (selections.timetable) {
        sub1Query = "LEFT JOIN `timetable` AS `sub1` ON `main`.`id` = `sub1`.`group_id`";
    }

    let sub1Selections = (sub1Query == "") ? '' : '"" as `sub1_decorator`, `sub1`.`id` as `timetable_id`, `sub1`.*,';
    let mainSelections = '"" as `main_decorator`, `main`.*';

    let fullQuery = "SELECT " + sub1Selections + mainSelections + " FROM `group` AS `main` " + sub1Query + " WHERE `main`." + query;

    const res = await this.db.query(fullQuery, ids);
    let groups = {};
    res.map(group => {
        let parsed = {};
        let pushIntoSub1 = false;

        let timetable = {};
        let main = {};

        Object.keys(group).map(selectedField => {
            const value = group[selectedField];

            if (selectedField == 'sub1_decorator') {
                pushIntoSub1 = true;
            }
            if (selectedField == 'main_decorator') {
                pushIntoSub1 = false;
            }
            if (pushIntoSub1) {
                timetable[selectedField] = value;
            }
            else {
                main[selectedField] = value;
            }
            if (selectedField == 'association_id') {
                main[selectedField] = value;
            }
        });


        delete main.main_decorator;
        timetable.id = timetable.timetable_id;
        delete timetable.timetable_id;
        delete timetable.sub1_decorator;

        parsed = {
            ...main,
            timetable
        };

        if (groups[group['association_id']]) {
            groups[group['association_id']].push(parsed);
        }
        else {
            groups[group['association_id']] = [ parsed ];
        }
    });

    return groups;
}

module.exports = (new Group());
