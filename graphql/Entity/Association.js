const baseEntity = require('./BaseEntity');
const Group = require('./Group');

let Association = function () {}

Association.prototype = Object.assign(Association.prototype, baseEntity.prototype);

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

    let groups = null;
    if (selections.groups) {
        const model = Group.newModel();
        groups = await model.getAssociationGroups(ids, selections.groups);
    }

    let proposals = null;
    if (selections.isRecruiment || selections.proposals) {
        proposals = await model.selectProposalsList('association_id', ids, {});
    }

    let associations = [];
    res.map(el => {
        el.id = el.association_id;
        delete el.association_id;
        const association = {
            ...el,
            groups: groups[el.id],
            proposals: proposals[el.id]
        };
        associations.push(association);
    });

    return associations;
}

Association.prototype.table = "association";

module.exports = (new Association());
