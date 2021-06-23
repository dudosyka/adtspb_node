const baseEntity = require('./BaseEntity');
const UserExtraData = require('./UserExtraData');

let AssociationExtraData = function () {}

AssociationExtraData.prototype = Object.assign(AssociationExtraData.prototype, baseEntity.prototype);

AssociationExtraData.prototype.getInstance = () => AssociationExtraData;

AssociationExtraData.prototype.createFrom = async function (data) {
    if (data.association_id) {
        const req = await this.db.select(this, '`association_id` = ?', [ data.association_id ]);
        if (req.length) {
            const model = this.newModel();
            const newData = Object.assign(req[0], data);
            model.fields = newData;
            return model;
        }
        else
            return await this.baseCreateFrom(data);
    }
    return this.baseCreateFrom(data);
}

AssociationExtraData.prototype.fields = {
    id: null,
};

AssociationExtraData.prototype.canJoinAssociation = async function (id) {
    const userData = await UserExtraData.createFrom({ user_id: id });
    const age = userData.calculateAge();

    console.log("AGE", age);

    if (this.__get('max_age') < age || this.__get('min_age') > age)
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
