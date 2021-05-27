const baseEntity = require('./BaseEntity');

let Association = function () {}

Association.prototype = Object.assign(Association.prototype, baseEntity.prototype);

Association.prototype.getInstance = () => Association;

Association.prototype.fields = {
    id: null,
};

Association.prototype.getAssociations = async function (age = null) {
    console.log("AGE", age);
    return (age == null)
    ? await this.db.query('SELECT * FROM `association` AS `main` RIGHT JOIN `association_extra_data` AS `join` ON `main`.id = `join`.association_id')
    : await  this.db.query('SELECT * FROM `association` AS `main` RIGHT JOIN `association_extra_data` AS `join` ON `main`.id = `join`.association_id WHERE `join`.`max_age` >= ? AND `join`.min_age <= ?', [ age, age ]);
}

Association.prototype.table = "association";

module.exports = (new Association());
