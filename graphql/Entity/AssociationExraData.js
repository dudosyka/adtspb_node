const baseEntity = require('./BaseEntity');
const UserExtraData = require('./UserExtraData');

let AssociationExtraData = function () {}

AssociationExtraData.prototype = Object.assign(AssociationExtraData.prototype, baseEntity.prototype);

AssociationExtraData.prototype.getInstance = () => AssociationExtraData;

AssociationExtraData.prototype.createFromField = "association_id";

AssociationExtraData.prototype.fields = {
    id: null,
};

AssociationExtraData.prototype.canJoinAssociation = async function (id = false, child = false) {
    let age;
    if (id !== false) {
        const userData = await UserExtraData.createFrom({ user_id: id });
        age = userData.calculateAge();
    }
    else if (child !== false) {
        age = child.calculateAge();
    }
    else {
        return "Age doesn`t pass";
    }

    if (age > this.__get('max_age') || age < this.__get('min_age'))
        return 'Age doesn`t pass';

    return true;
}

AssociationExtraData.prototype.getList = async function (arr) {
    if (arr.length < 1)
        return [];
    const range = this.db.createRangeQuery('id', arr);
    return await this.db.select(this, range.query, range.ids);

}

AssociationExtraData.prototype.table = "association_extra_data";

AssociationExtraData.prototype.groupCreated = async function (association_id) {
    return await this.db.query('UPDATE `' + this.table + '` SET `group_count` = `group_count` + 1 WHERE `association_id` = ?', [ association_id ]);
}

AssociationExtraData.prototype.groupClosed = async function (association_id) {
    return await this.db.query('UPDATE `' + this.table + '` SET `group_count` = `group_count` - 1 WHERE `association_id` = ?', [ association_id ]);
}

module.exports = (new AssociationExtraData());
