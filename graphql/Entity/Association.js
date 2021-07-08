const baseEntity = require('./BaseEntity');
const AssociationExtraData = require('./AssociationExraData');


let Association = function () {}

Association.prototype = Object.assign(Association.prototype, baseEntity.prototype);

Association.prototype.getInstance = () => Association;

Association.prototype.fields = {
    id: null,
};

Association.prototype.getAssociations = async function (age = null) {
    return (age == null)
    ? await this.db.query('SELECT * FROM `association` AS `main` RIGHT JOIN `association_extra_data` AS `join` ON `main`.id = `join`.association_id')
    : await  this.db.query('SELECT * FROM `association` AS `main` RIGHT JOIN `association_extra_data` AS `join` ON `main`.id = `join`.association_id WHERE `join`.`max_age` >= ? AND `join`.min_age <= ?', [ age, age ]);
}

Association.prototype.getFullData = async function (id) {
    const mainEntity = await this.newModel().baseCreateFrom({id: id});
    const extraEntity = AssociationExtraData.newModel();
    const extra = await extraEntity.createFrom({association_id: id});
    mainEntity.fields = Object.assign(mainEntity.fields, extra.fields);
    return mainEntity;
}

Association.prototype.table = "association";

module.exports = (new Association());
