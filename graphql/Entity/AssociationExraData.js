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
    console.log(id);
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

    console.log(age);
    console.log(this.fields);

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

module.exports = (new AssociationExtraData());
